import express, { Request, Response, Router } from 'express';
import Sequelize from 'sequelize';

import axios from 'axios';
import { uuidv7 } from 'uuidv7';
import moment from 'moment';

import { loggerService, safePromise } from '../../../utilities';
import Middlewares from '../../middlewares';

import DBConfig from '../../db';

const { connection } = DBConfig;

const { isAuthorized } = Middlewares;

const router: Router = express.Router();

const {
  INTERNAL_API_HEX,
  TARGET_BUILD_ENDPOINT,
  API_HEX,
  INSTANCE_BUILD_DEFAULT_PASSWORD: DEFAULT_PASSWORD,
} : any = process.env;

router.get('/build/config', isAuthorized, async (req: Request, res: Response) => {
  // check users
  if (!TARGET_BUILD_ENDPOINT && !API_HEX) {
    return res.status(400).json({
      message: 'Build process is disabled for now.',
    });
  }

  const { user } : any = req.session;

  const uReplacements: any = [user.ref_id];
  const userSqlQuery = 'SELECT email, extra FROM users where ref_id=?';
  const [userQError, userResult] = await safePromise(connection.query(userSqlQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: uReplacements,
  }));

  if (userQError) {
    console.log(userQError);
    return res.status(500).json({
      message: 'Error creating LowCodeAPI build task',
    });
  }

  if (!userResult.length) {
    return res.status(422).json({
      message: 'Build not allowed for you',
      res: {
        build_enabled: false,
      },
    });
  }
  const { email, extra: userExtra } = userResult[0];
  if (!userExtra.custom_build_enabled) {
    return res.status(200).json({
      message: 'Custom build is not enabled for you.',
      res: {
        build_enabled: false,
      },
    });
  }
  loggerService.info('Custom build is enabled for user ->', user.ref_id);

  const sqlQueryTotal = 'SELECT count(*) as total FROM builds WHERE user_ref_id=?;';
  const replacementsTotal: any = [user.ref_id];
  const [queryTotalError, queryTotal] = await safePromise(connection.query(sqlQueryTotal, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: replacementsTotal,
  }));

  if (queryTotalError) {
    loggerService.error(queryTotalError);
    return res.status(500).json({
      message: 'Error retrieving build limits.',
      res: {
        build_enabled: true,
        build_limit: 0,
      },
    });
  }

  const userBuildTotal = queryTotal.length ? queryTotal[0].total : 0;

  const custom_build_limit = userExtra.custom_build_limit || 3;
  const custom_subdomain_allowed = !!userExtra.custom_subdomain_allowed;
  const custom_domain_allowed = !!userExtra.custom_domain_allowed;
  const custom_metadata_enabled = !!userExtra.custom_metadata_enabled;
  const download_enabled = !!userExtra.download_enabled;
  const delete_instance_enabled = !!userExtra.delete_instance_enabled;
  const build_enabled = true;
  const results : any = {
    email: build_enabled ? email : undefined,
    build_enabled,
    build_limit: custom_build_limit,
    build_created_total: userBuildTotal,
    build_allowed: custom_build_limit >= userBuildTotal,
    provider_limit: userExtra.custom_build_provider_limit || 2,
  };

  if (userExtra.custom_rebuild_enabled) {
    results.rebuild_enabled = true;
  }
  if (custom_subdomain_allowed) {
    results.subdomain_allowed = true;
  }
  if (custom_domain_allowed) {
    results.root_domain_allowed = true;
  }
  if (custom_metadata_enabled) {
    results.metadata_allowed = true;
  }
  if (download_enabled) {
    results.download_enabled = true;
  }

  if (delete_instance_enabled) {
    results.delete_instance_enabled = true;
  }
  res.json({
    message: 'LowCodeAPI build config',
    res: results,
  });
});

router.get('/build/check', isAuthorized, async (req: Request, res: Response) => {
  // check users
  if (!TARGET_BUILD_ENDPOINT && !API_HEX) {
    return res.status(400).json({
      message: 'Build process is disabled for now.',
    });
  }

  const { user } : any = req.session;

  const uReplacements: any = [user.ref_id];
  const userSqlQuery = 'SELECT extra FROM users where ref_id=?';
  const [userQError, userResult] = await safePromise(connection.query(userSqlQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: uReplacements,
  }));

  if (userQError) {
    console.log(userQError);
    return res.status(500).json({
      message: 'Error creating LowCodeAPI build task.',
    });
  }

  if (!userResult.length) {
    return res.status(422).json({
      message: 'Custom build is not enabled for you.',
      res: {
        build_enabled: false,
      },
    });
  }
  const { subdomain, custom_domain } = req.query;

  if (!subdomain && !custom_domain) {
    return res.status(422).json({
      message: 'Please provide subdomain or custom domain.',
    });
  }
  let sqlQuery = 'SELECT * FROM builds WHERE ';
  let replacements: any = [];

  let check_name = '';
  if (custom_domain) {
    sqlQuery = `${sqlQuery} root_domain=?`;
    replacements = [custom_domain];
    check_name = 'custom_domain';
  } else if (subdomain) {
    sqlQuery = `${sqlQuery} subdomain=?`;
    replacements = [subdomain];
    check_name = 'subdomain';
  }
  sqlQuery = `${sqlQuery} AND active = 1 ORDER BY created_at DESC LIMIT 1;`;
  const [queryError, queryResult] = await safePromise(connection.query(sqlQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements,
  }));

  if (queryError) {
    loggerService.error(queryError);
    return res.status(500).json({
      message: 'Error reading builds',
    });
  }

  const found = queryResult.length ? queryResult[0] : null;

  let user_can_use = false;
  if (found) {
    user_can_use = found.user_ref_id === user.ref_id;
    if (!user_can_use) {
      return res.status(422).json({
        message: 'Already in use',
        res: {},
      });
    }
  }

  res.json({
    message: user_can_use ? 'Used by your other instance will be switched to new instance.' : 'Available to use.',
    res: {
      [check_name]: true,
      user_can_use,
    },
  });
});

router.get('/build', isAuthorized, async (req: Request, res: Response) => {
  // check users
  if (!TARGET_BUILD_ENDPOINT && !API_HEX) {
    return res.status(400).json({
      message: 'Build process is disabled for now.',
    });
  }

  const { user } : any = req.session;

  const uReplacements: any = [user.ref_id];
  const userSqlQuery = 'SELECT extra FROM users where ref_id=?';
  const [userQError, userResult] = await safePromise(connection.query(userSqlQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: uReplacements,
  }));

  if (userQError) {
    console.log(userQError);
    return res.status(500).json({
      message: 'Error creating LowCodeAPI build task',
    });
  }

  if (!userResult.length) {
    return res.status(422).json({
      message: 'Build not allowed for you',
      res: {
        build_enabled: false,
      },
    });
  }
  const userExtra = userResult[0].extra;

  if (!userExtra.download_enabled) {
    // TODO:
  }

  const sqlQuery = 'SELECT build_id, build_name, target, status, build_metadata, deploy_status, deploy_target, created_at FROM builds WHERE user_ref_id=? and active=1 ORDER BY created_at DESC LIMIT 50;';
  const replacements: any = [user.ref_id];
  const [queryError, queryResult] = await safePromise(connection.query(sqlQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements,
  }));

  if (queryError) {
    loggerService.error(queryError);
    return res.status(500).json({
      message: 'Error reading builds',
    });
  }
  const results = queryResult.map((item: any) => {
    const obj : { [key:string]: any } = {
      name: item.build_name,
      target: item.target,
      status: item.status,
      date: item.created_at,
      deploy_status: 'pending',
    };

    if (userExtra.download_enabled) {
      obj.build_link = `${TARGET_BUILD_ENDPOINT}/zip/${item.build_name}.zip`;
    }

    if (item.deploy_status) {
      obj.deploy_status = item.deploy_status;
      if (obj.deploy_status.toLowerCase() === 'ready' && item.deploy_target && item.deploy_target.endpoint) {
        obj.deploy_endpoint = item.deploy_target.endpoint;
      }
    }
    return obj;
  });

  res.json({
    message: 'Your LowCodeAPI build targets',
    res: results,
  });
});

router.post('/build', isAuthorized, async (req: Request, res: Response) => {
  const { body } = req;
  loggerService.info('Build request received.');
  // check users
  if (!TARGET_BUILD_ENDPOINT && !API_HEX) {
    return res.status(400).json({
      message: 'Build process is disabled for now.',
    });
  }

  const { user } : any = req.session;
  const uuidv7Hash = uuidv7();
  const {
    email: targetEmail,
    password,
    target: targetBody,
    subdomain,
    custom_domain = '',
    metadata: custom_metadata = {},
    rebuild = false,
    build_id = null,
  } = body;

  let target = targetBody;

  const replacements: any = [user.ref_id];
  const sqlQuery = 'SELECT first_name, last_name, email, extra FROM users where ref_id=?';
  const [queryError, queryResult] = await safePromise(connection.query(sqlQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements,
  }));

  if (queryError) {
    console.log(queryError);
    return res.status(500).json({
      message: 'Error creating LowCodeAPI build task',
    });
  }

  if (!queryResult.length) {
    return res.status(422).json({
      message: 'Build not allowed for you',
    });
  }
  const {
    first_name, last_name, email: userEmail, extra: userExtra,
  } = queryResult[0];
  const buildByUser = last_name ? `${first_name} ${last_name}` : `${first_name}`;
  if (!userExtra.custom_build_enabled) {
    return res.status(422).json({
      message: 'Custom build is not enabled for you.',
    });
  }

  let reBuildAllowed = false;
  if (rebuild && !userExtra.custom_rebuild_enabled) {
    return res.status(422).json({
      message: 'Re-builds is not enabled for your account.',
    });
  } if (rebuild && userExtra.custom_rebuild_enabled && !build_id) {
    return res.status(422).json({
      message: 'Build id missing for Re-builds.',
    });
  } if (rebuild && userExtra.custom_rebuild_enabled && build_id) {
    reBuildAllowed = true;
  }
  loggerService.info('Custom build is enabled for user ->', user.ref_id);

  const sqlQueryTotal = 'SELECT * FROM builds WHERE user_ref_id=? AND active=1;';
  const replacementsTotal: any = [user.ref_id];
  const [queryTotalError, buildList] = await safePromise(connection.query(sqlQueryTotal, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: replacementsTotal,
  }));

  if (queryTotalError) {
    loggerService.error(queryTotalError);
    return res.status(500).json({
      message: 'Error retrieving build limits.',
    });
  }

  const userBuildTotal = buildList.length ? buildList.length : 0;

  if (reBuildAllowed) {
    const reBuildPayload = buildList.filter((item : any) => item.build_id === build_id);
    if (reBuildPayload.length) {
      const reBuildPayloadTarget = reBuildPayload[0];
      target = reBuildPayloadTarget.target;
    }
    // TODO: populate all the fields.
  }
  console.log({
    userBuildTotal,
    custom_build_limit: userExtra.custom_build_limit,
    custom_build_provider_limit: userExtra.custom_build_provider_limit,
  });

  const custom_build_limit = userExtra.custom_build_limit || 3;
  if (userBuildTotal >= +custom_build_limit) {
    loggerService.info('Custom build limit reached for user ->', user.ref_id, `Total build ${userBuildTotal}, Limit: ${custom_build_limit}`);
    return res.status(422).json({
      message: 'Custom build limit reached.',
    });
  }

  const providersTarget : any = {};
  const providersBuildTarget : any = {};
  const custom_build_provider_limit = userExtra.custom_build_provider_limit || 2;
  if (custom_build_provider_limit) {
    const providers = Object.keys(target).splice(0, custom_build_provider_limit);
    providers.forEach((provider) => {
      providersTarget[provider] = target[provider];
      providersBuildTarget[provider] = []; // intent is taken from database during build
    });
  }
  const build_name = buildByUser ? `${buildByUser.toLowerCase().replace(/\s/ig, '-')}-${uuidv7Hash}` : `lowcodeapi-${uuidv7Hash}`;
  const metadata : { [key: string]: any } = {};
  let buildPayload : { [key: string]: any } = {
    uuidv7: uuidv7Hash,
    user,
    password: password || DEFAULT_PASSWORD,
    email: targetEmail || userEmail,
    target: providersBuildTarget,
    build_name,
    build_by_user: buildByUser,
  };
  if (subdomain) {
    const subdomain_sanitized = subdomain.toLowerCase().replace(/https?:\/\//ig, '').replace(/lowcodeapi.com/ig, '').replace(/[^a-z0-9A-Z -]/ig, '')
      .slice(0, 50)
      .trim()
      .replace(/\s/ig, '-');
    metadata.subdomain = subdomain_sanitized;
  }

  if (custom_domain) {
    const sanitized_root_domain = custom_domain.toLowerCase().replace(/https?:\/\//ig, '').replace(/[^a-z0-9A-Z .-_]/ig, '').trim()
      .replace(/\s/ig, '-');
    metadata.root_domain = sanitized_root_domain || '';
  }

  if (userExtra.custom_metadata_enabled) {
    if (custom_metadata) {
      if (custom_metadata.title) {
        metadata.TITLE = custom_metadata.title;
      }
      if (custom_metadata.site_name) {
        metadata.NAME = custom_metadata.site_name;
      }
      if (custom_metadata.description) {
        metadata.DESCRIPTION = custom_metadata.description;
      }
      if (custom_metadata.copyright) {
        metadata.COPYRIGHT = custom_metadata.copyright;
      }
    }
  }

  buildPayload = {
    ...buildPayload,
    build_metadata: metadata,
    subdomain: metadata.subdomain,
    root_domain: metadata.root_domain,
  };

  const buildMetadata = JSON.stringify(metadata);
  const insertReplacements: any = [
    user.ref_id,
    uuidv7Hash,
    build_name,
    metadata.subdomain ? metadata.subdomain : '',
    metadata.root_domain ? metadata.root_domain : '',
    body.title || `LowCodeAPI Build for ${buildByUser}`,
    body.description || '',
    JSON.stringify(providersTarget),
    buildMetadata,
    'pending',
    1,
  ];

  let domainEval = [];
  if (metadata.root_domain && metadata.subdomain) {
    const domainCheckQuery = 'SELECT * FROM builds WHERE active=1 AND (root_domain=? OR subdomain=?)';
    const domainCheckReplacements = [metadata.root_domain, metadata.subdomain];
    const [domainError, domainUsed] = await safePromise(connection.query(domainCheckQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: domainCheckReplacements,
    }));
    if (domainError) {
      console.log(domainError);
      return res.status(500).json({
        message: 'Error getting build details',
      });
    }
    domainEval = domainUsed;
  } else if (metadata.root_domain) {
    const domainCheckQuery = 'SELECT * FROM builds WHERE active=1 AND root_domain=?';
    const domainCheckReplacements = [metadata.root_domain];
    const [domainError, domainUsed] = await safePromise(connection.query(domainCheckQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: domainCheckReplacements,
    }));
    if (domainError) {
      console.log(domainError);
      return res.status(500).json({
        message: 'Error getting build details',
      });
    }
    domainEval = domainUsed;
  } else if (metadata.subdomain) {
    const domainCheckQuery = 'SELECT * FROM builds WHERE active=1 AND subdomain=?';
    const domainCheckReplacements = [metadata.subdomain];
    const [domainError, domainUsed] = await safePromise(connection.query(domainCheckQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: domainCheckReplacements,
    }));
    if (domainError) {
      console.log(domainError);
      return res.status(500).json({
        message: 'Error getting build details',
      });
    }
    domainEval = domainUsed;
  }

  let domainExists = !!domainEval.length;
  const domainCanBeUsed = domainEval.filter((domain: any) => domain.user_ref_id === user.ref_id);

  if (domainCanBeUsed.length) {
    domainExists = false;
  }

  if (domainExists) {
    return res.status(422).json({
      message: 'Can not use this domain.',
    });
  }

  if (domainCanBeUsed) {
    // Updating exisitng domain used by the user.
    if (metadata.root_domain && metadata.subdomain) {
      let updateSQLQuery = 'UPDATE builds SET active=0';
      updateSQLQuery = `${updateSQLQuery}, root_domain='', subdomain='' WHERE user_ref_id=? AND (root_domain=? OR subdomain=?);`;
      const updateReplacements = [user.ref_id];
      updateReplacements.push(metadata.root_domain);
      updateReplacements.push(metadata.subdomain);
      const [queryError1] = await safePromise(connection.query(updateSQLQuery, {
        replacements: updateReplacements,
      }));

      if (queryError1) {
        console.log(queryError1, 'root_domain & subdomain');
        return res.status(500).json({
          message: 'Error updating build details',
        });
      }
    }

    if (metadata.root_domain) {
      let updateSQLQuery = 'UPDATE builds SET active=0';
      updateSQLQuery = `${updateSQLQuery}, root_domain='' WHERE user_ref_id=? AND root_domain=?;`;
      const updateReplacements = [user.ref_id];
      updateReplacements.push(metadata.root_domain);
      const [queryError1] = await safePromise(connection.query(updateSQLQuery, {
        replacements: updateReplacements,
      }));

      if (queryError1) {
        console.log(queryError1, 'root_domain');
        return res.status(500).json({
          message: 'Error updating build details',
        });
      }
    }

    if (metadata.subdomain) {
      let updateSQLQuery = 'UPDATE builds SET active=0';
      updateSQLQuery = `${updateSQLQuery}, subdomain='' WHERE user_ref_id=? AND subdomain=?;`;
      const updateReplacements = [user.ref_id];
      updateReplacements.push(metadata.subdomain);
      const [queryError1] = await safePromise(connection.query(updateSQLQuery, {
        replacements: updateReplacements,
      }));

      if (queryError1) {
        console.log(queryError1, 'subdomain');
        return res.status(500).json({
          message: 'Error updating build details',
        });
      }
    }
  }

  const placeholders = new Array(insertReplacements.length).fill('?').join(',');
  const sqlQuery2 = `INSERT INTO builds (user_ref_id, build_id, build_name, subdomain, root_domain, title, description, target, build_metadata, status, active) VALUES (${placeholders});`;
  const [queryError2] = await safePromise(connection.query(sqlQuery2, {
    replacements: insertReplacements,
  }));

  console.log(providersTarget);
  if (queryError2) {
    console.log(queryError2);
    return res.status(500).json({
      message: 'Error creating LowCodeAPI build task',
    });
  }
  const url = `${TARGET_BUILD_ENDPOINT}/build?api_hex=${API_HEX}`;

  const [error, resp] = await safePromise(axios({
    url,
    method: 'POST',
    data: {
      ...buildPayload,
    },
  }));

  if (error) {
    loggerService.error(error);
    return res.status(500).json({
      message: 'Error creating custom LowCodeAPI build',
    });
  }

  const { data } = resp;
  res.json({
    message: 'Build request received',
    res: {
      build_link: data.build_link,
      name: build_name,
      target: providersTarget,
      status: 'pending',
      deploy_status: 'waiting',
      date: moment().utc().format(),
    },
  });
});

// Internal target
router.get('/build/:build_id/target', async (req: Request, res: Response) => {
  if (!TARGET_BUILD_ENDPOINT && !API_HEX) {
    return res.status(400).json({
      message: 'Build process is disabled for now.',
    });
  }

  const { api_hex = '' } = req.query;
  if (!INTERNAL_API_HEX.includes(api_hex)) {
    return res.status(401).json({
      message: 'Request is not allowed',
    });
  }

  const sqlQueryTotal = 'SELECT target FROM builds WHERE build_id=? LIMIT 1;';
  const replacementsTotal: any = [req.params.build_id];
  const [error, data] = await safePromise(connection.query(sqlQueryTotal, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: replacementsTotal,
  }));

  if (error) {
    loggerService.error(error);
    return res.status(500).json({
      message: 'Error retrieving build target.',
      res: {

      },
    });
  }

  const result = data.length ? data[0] : {};
  res.json({
    res: result.target,
  });
});

router.put('/build', async (req: Request, res: Response) => {
  if (!TARGET_BUILD_ENDPOINT && !API_HEX) {
    return res.status(400).json({
      message: 'Build process is disabled for now.',
    });
  }

  const { api_hex = '' } = req.query;
  if (!INTERNAL_API_HEX.includes(api_hex)) {
    return res.status(401).json({
      message: 'Request is not allowed',
    });
  }

  const { body } = req;

  if (!body.build_id) {
    console.log('build_id', body.build_id);
    return res.status(422).json({
      message: 'Request is not allowed, build_id is missing',
    });
  }

  console.log(body);
  if (body.status) {
    const replacements = [body.status.toLowerCase()];
    let sql2Query = 'UPDATE builds SET status = ? ';

    if (body.deploy_port) {
      replacements.push(body.deploy_port);
      sql2Query += ', deploy_port = ?';
    }
    replacements.push(body.build_id);
    sql2Query += ' WHERE build_id = ?';

    const [updateError] = await safePromise(connection.query(sql2Query, {
      replacements,
    }));

    if (updateError) {
      return res.status(500).json({
        message: `Error updatiing build status of ${body.build_id} in system.`,
      });
    }
  }

  if (body.deploy_status) {
    const deploy_target = body.deploy_target ? { ...body.deploy_target } : {};
    const replacements = [body.deploy_status.toLowerCase(), JSON.stringify(deploy_target)];

    let sql2Query = 'UPDATE builds SET deploy_status = ?, deploy_target = ? ';

    if (body.deploy_name) {
      sql2Query += ', deploy_name = ?';
      replacements.push(body.deploy_name);
    }

    if (body.deploy_completed) {
      sql2Query += ', deploy_completed = ?';
      replacements.push(body.deploy_completed);
    }

    replacements.push(body.build_id);
    sql2Query += ' WHERE build_id = ?';

    const [updateError] = await safePromise(connection.query(sql2Query, {
      replacements,
    }));

    if (updateError) {
      return res.status(500).json({
        message: `Error updatiing deploy status of ${body.build_id} in system.`,
      });
    }
  }

  res.json({
    message: 'Status updated',
  });
});

router.delete('/build/:build', async (req: Request, res: Response) => {
  if (!TARGET_BUILD_ENDPOINT && !API_HEX) {
    return res.status(400).json({
      message: 'Build process is disabled for now.',
    });
  }

  const { params } = req;

  if (!params.build) {
    console.log('build', params.build);
    return res.status(422).json({
      message: 'Request is not allowed, build is missing',
    });
  }

  const replacements = ['deleted', params.build];
  const sql2Query = 'UPDATE builds SET status = ?, active = 0 WHERE build_name = ?';
  const [updateError] = await safePromise(connection.query(sql2Query, {
    replacements,
  }));

  if (updateError) {
    return res.status(500).json({
      message: `Error deleting instance ${params.build} in system.`,
    });
  }

  res.json({
    message: 'Instance willl be removed in sometime.',
  });
});
export default router;
