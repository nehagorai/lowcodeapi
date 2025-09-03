import Sequelize from 'sequelize';
import db from '../../db';
import { loggerService, safePromise } from '../../../utilities';

const { connection } = db;

export default async (user: any) => {
  loggerService.info({ user });
  const dbQuery = `
    SELECT 
      DISTINCT pct.provider_data as data,
      pct.provider

    FROM providers_credential_and_tokens pct
    INNER JOIN users_activated_providers uap ON (uap.user_ref_id=pct.user_ref_id)
    WHERE pct.user_ref_id=?;
  `;

  const [queryError, list] = await safePromise(connection.query(dbQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: [
      user.ref_id,
    ],
  }));

  if (queryError) {
    throw queryError;
  }

  const l = list ? list.filter((i: any) => !!i.data) : [];
  const obj: {[key:string]: any} = {};

  l.forEach((i: any) => {
    const provider = i.provider.toLowerCase();
    if (provider === 'twitter') {
      obj[provider] = i.data.profile_image_url_https.split('_normal').join('');
    } else {
      obj[provider] = i.data.picture;
    }
  });
  return obj;
};
