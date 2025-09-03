import Sequelize from 'sequelize';
import { cryptograper, safePromise, loggerService } from '../../../../utilities';
import DBConfig from '../../../db';

import usersActivatedProviders from '../../user/activated';

const { connection } = DBConfig;

const { ProvidersCredentialAndToken } = DBConfig.models;

const fetchActivatedProviderCredsAndTokens = async (
  user: { [key: string]: any },
  provider: any,
  auth_type: string = '', // eslint-disable-line no-unused-vars
) => {
  const dbQuery = `
        SELECT 
            DISTINCT pct.provider_data as data,
            pct.credentials as credentials,
            pct.config as config,
            pct.provider
    
        FROM providers_credential_and_tokens pct
        INNER JOIN users_activated_providers uap ON (uap.user_ref_id=pct.user_ref_id)
        WHERE pct.user_ref_id=?
        AND pct.provider=?;
    `;

  const [queryError, list] = await safePromise(
    connection.query(dbQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: [user.ref_id, provider.toLowerCase()],
    }),
  );

  if (queryError) {
    throw queryError;
  }

  if (!list || !list.length) {
    return [];
  }

  const listSanitized = list.map((item: any) => {
    const local = { ...item };
    if (item.credentials && typeof item.credentials === 'string') {
      local.credentials = JSON.parse(item.credentials);
    }
    if (item.config && typeof item.config === 'string') {
      local.config = JSON.parse(item.config);
    }
    return local;
  });
  return listSanitized;
};

const fetchActivatedProviderDetail = async ({ user, provider }: { [key: string]: any }) => {
  const query = `
      SELECT
        uap.*
      FROM users_activated_providers uap
      WHERE uap.user_ref_id=? and uap.provider_ref_id=?
      LIMIT 1;
    `;

  const [queryError, result] = await safePromise(connection.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: [user.ref_id, provider.toLowerCase()],
  }));

  if (queryError) {
    loggerService.error(queryError);
    throw new Error(queryError.message);
  }

  if (!result.length) {
    return null;
  }

  const data = result.map((item: { [key: string]: any }) => {
    const local = { ...item };
    local.provider_key = item.provider_ref_id;
    local.active = !!item.active;
    local.id = undefined;
    local.user_ref_id = undefined;
    local.createdAt = undefined;
    local.created_at = undefined;
    local.updatedAt = undefined;
    local.updated_at = undefined;

    return local;
  });
  return {
    ...data[0],
  };
};

const fetchActivatedProviders = async ({ user }: { [key: string]: any }) => {
  let replacements: any[] = [];
  const query = `
      SELECT
        uap.*
      FROM users_activated_providers uap
      WHERE uap.user_ref_id=? and uap.active=1;
    `;
  replacements = [user.ref_id];
  const [queryError, result] = await safePromise(connection.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements,
  }));

  if (queryError) {
    loggerService.error(queryError);
    throw new Error(queryError.message);
  }

  const data = result.map((item: { [key: string]: any }) => {
    const local = { ...item };
    local.provider_key = item.provider_ref_id;
    local.active = !!item.active;
    if (user && user.ref_id) {
      local.activated = !!(item.active && item.ref_id);
    }
    local.id = undefined;
    local.user_ref_id = undefined;
    local.hidden = undefined;
    local.createdAt = undefined;
    local.created_at = undefined;
    local.updatedAt = undefined;
    local.updated_at = undefined;

    return local;
  });
  return data;
};

const saveProviderCredsAndTokens = async ({ body: bodyObj, user }: { [key: string]: any }) => {
  const body = bodyObj;

  const provider = body.provider ? body.provider.toLowerCase() : '';
  const where = {
    user_ref_id: user.ref_id,
    provider,
  };
  const [findError] = await safePromise(
    ProvidersCredentialAndToken.destroy({
      where,
    }),
  );

  if (findError) {
    throw new Error(findError.message);
  }

  const payload: any = {
    user_ref_id: user.ref_id,
    provider,
  };

  if (body.config && body.config.client_id) {
    const keys : any = {
      CLIENT_ID: body.config.client_id,
      CLIENT_SECRET: body.config.client_secret,
    };

    const credentials = {
      encrypted: cryptograper.encrypt(keys),
      masked: cryptograper.maskKeys(keys),
    };
    payload.auth_type = 'OAUTH2.0';
    payload.credentials = credentials;
    if (body.config.selected_scopes) {
      payload.credentials.selected_scopes = Array.isArray(body.config.selected_scopes) ? body.config.selected_scopes : body.config.selected_scopes.trim().split(',')
        .filter((item: string) => item.trim());
    }
    if (body.config.subdomain) {
      payload.credentials.subdomain = body.config.subdomain;
    }
    if (body.config.endpoint) {
      payload.credentials.endpoint = body.config.endpoint;
    }

    if (body.config.auth_endpoint) {
      payload.credentials.auth_endpoint = body.config.auth_endpoint;
    }
  } else if (body.config && body.config.api_key && body.auth_type === 'OAUTH1.0') {
    const keys = {
      API_KEY: body.config.api_key,
      API_SECRET: body.config.api_secret,
    };

    const credentials = {
      encrypted: cryptograper.encrypt(keys),
      masked: cryptograper.maskKeys(keys),
    };

    payload.auth_type = body.auth_type;
    payload.credentials = credentials;
  } else {
    payload.auth_type = 'TOKEN';
    const config = {
      encrypted: cryptograper.encrypt(body.config),
      masked: cryptograper.maskKeys(body.config),
    };
    payload.config = config;
  }

  const [queryError, result] = await safePromise(
    ProvidersCredentialAndToken.create(payload),
  );

  if (queryError) {
    throw new Error(queryError.message);
  }

  const [activationError] = await safePromise(
    usersActivatedProviders({
      user,
      provider: body.provider,
    }),
  );

  if (activationError) {
    throw new Error(activationError.message);
  }

  return result.toJSON();
};

const deleteProviderCredsAndTokens = async ({ provider, user }: { [key: string]: any }) => {
  const where = {
    user_ref_id: user.ref_id,
    provider: provider.toLowerCase(),
  };

  const update = {
    active: false,
    config: {},
    credentials: {},
    provider_data: {},
  };

  const [deleteCredsError] = await safePromise(
    ProvidersCredentialAndToken.update(update, {
      where,
    }),
  );

  if (deleteCredsError) {
    throw new Error(deleteCredsError.message);
  }

  const [activationError] = await safePromise(
    usersActivatedProviders({
      user,
      provider,
      active: 0,
    }),
  );

  if (activationError) {
    throw new Error(activationError.message);
  }
};
export {
  fetchActivatedProviderCredsAndTokens,
  fetchActivatedProviderDetail,
  fetchActivatedProviders,
  saveProviderCredsAndTokens,
  deleteProviderCredsAndTokens,
};
