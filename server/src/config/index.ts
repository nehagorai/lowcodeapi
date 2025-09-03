import 'dotenv/config';

const { IP_LOGGING = false } = process.env;
const {
  ENCRYPTION_KEY,
  APPLICATION_MODE,
  MICROSERVICE_ENABLED = false,
  CACHE_ENABLED,
  READ_MODE, GRACE_MODE,
} = process.env;

const {
  SESSION_EXPIRY = 8640000,
  SESSION_STORE_IN_REDIS,
  SESSION_SECRET_KEY,
} = process.env;

const { JWT_SECRET, JWT_EXPIRES = '7d' } = process.env;

const { CAHCE_KEY_EXPIRY_VALUE = 0 } = process.env;

const {
  INTERNAL_ACCESS_KEY,
  INTERNAL_ACCESS_KEYS,
} = process.env;

const {
  PROTOCOL = 'http',
  PORT,
  API_ENDPOINT,
  APP_DOMAIN,
  UI_DOMAIN,
  MOUNT_POINT = '/api/v1',
  AUTH_MOUNT_POINT = '/auth',
  BASE_PATH,
} = process.env;

const { API_REQUEST_LOG_KEY } = process.env;

const DB = {
  DB_TYPE: process.env.DB_TYPE || 'sqlite',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  SSL: process.env.SSL || false,
};

// RATE LIMIT

const { RATE_LIMIT_WINDOW_IN_MS, RATE_LIMIT_MAX_REQUEST } = process.env;

const RATE_LIMIT = {
  RATE_LIMIT_WINDOW_IN_MS: +RATE_LIMIT_WINDOW_IN_MS! || 900000,
  RATE_LIMIT_MAX_REQUEST: +RATE_LIMIT_MAX_REQUEST! || 100,
};

const {
  GOOGLE_SHEET_CLIENT_ID,
  GOOGLE_SHEET_CLIENT_SECRET,
  GOOGLE_SHEET_DEFAULT_DATA_LIMIT,
  GOOGLE_DOCS_CLIENT_ID,
  GOOGLE_DOCS_CLIENT_SECRET,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,

  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

const GOOGLE_SCOPE = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];
const GOOGLE = {
  SCOPE: [],
  AUTH: {
    GOOGLE: {
      CLIENT_ID: GOOGLE_CLIENT_ID,
      CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
      SCOPE: [
        ...GOOGLE_SCOPE,
      ],
    },
    GOOGLESHEETS: {
      CLIENT_ID: GOOGLE_SHEET_CLIENT_ID,
      CLIENT_SECRET: GOOGLE_SHEET_CLIENT_SECRET,
      DEFAULT_API_DATA_LIMIT: GOOGLE_SHEET_DEFAULT_DATA_LIMIT || 200,
      SCOPE: [
        ...GOOGLE_SCOPE,
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/spreadsheets.readonly',
      ],
    },
    GOOGLEDOCS: {
      CLIENT_ID: GOOGLE_DOCS_CLIENT_ID,
      CLIENT_SECRET: GOOGLE_DOCS_CLIENT_SECRET,
      SCOPE: [
        ...GOOGLE_SCOPE,
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/documents.readonly',
      ],
    },
    GMAIL: {
      CLIENT_ID: GMAIL_CLIENT_ID,
      CLIENT_SECRET: GMAIL_CLIENT_SECRET,
      SCOPE: [
        ...GOOGLE_SCOPE,
        'https://www.googleapis.com/auth/gmail.send',
      ],
    },
    GOOGLECALENDAR: {
      SCOPE: [
        ...GOOGLE_SCOPE,
      ],
    },
    GOOGLEDRIVE: {
      SCOPE: [
        ...GOOGLE_SCOPE,
      ],
    },
    GOOGLEFORMS: {
      SCOPE: [
        ...GOOGLE_SCOPE,
      ],
    },
    GOOGLEMAPS: {
      SCOPE: [
        ...GOOGLE_SCOPE,
      ],
    },
  },
};

const TWITTER = {
  CLIENT_ID: process.env.TWITTER_CLIENT_ID,
  CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
  OAUTH1: {
    API_KEY: process.env.TWITTER_OAUTH1_API_KEY,
    API_SECRET: process.env.TWITTER_OAUTH1_API_SECRET,
  },
  OAUTH2: {
    CLIENT_ID: process.env.TWITTER_CLIENT_ID,
    CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
  },
};

const TRELLO = {
  API_KEY: process.env.TRELLO_OAUTH1_API_KEY,
  API_SECRET: process.env.TRELLO_OAUTH1_API_SECRET,
};

const FACEBOOK = {
  SCOPE: [],
};

const INSTAGRAM = {
  SCOPE: [],
};

const WHATSAPP = {
  SCOPE: [],
};

const GITHUB = {
  SCOPE: [],
};

const GITLAB = {
  SCOPE: [],
};

const GUMROAD = {
  SCOPE: '',
};

const REDDIT = {
  SCOPE: '',
};

const DROPBOX = {
  SCOPE: '',
};

const PRODUCTHUNT = {
  SCOPE: '',
};

const AIRTABLE = {
  SCOPE: '',
};

const WORDPRESS = {
  SCOPE: '',

};
const DIGITALOCEAN = {
  SCOPE: '',

};

const BITLY = {
  SCOPE: '',
};

const SLACK = {
  SCOPE: '',
};

const ZOHOSHEET = {
  SCOPE: [],
};
const ZOHOMAIL = {
  SCOPE: [],
};

// https://discord.com/developers/docs/topics/oauth2

const DISCORD = {
  SCOPE: '',
};

const ASANA = {
  SCOPE: '',
};

const IMGUR = {
  SCOPE: '',
};

const SPOTIFY = {
  SCOPE: '',
};

const SHOPIFY = {
  SCOPE: '',
};

const ALGOLIA = {
  SCOPE: '',
};

const GETTYIMAGES = {
  SCOPE: '',
};

const PIPEDRIVE = {
  SCOPE: '',
};

const GIPHY = {
  SCOPE: '',
};

const DRIP = {
  SCOPE: '',
};

const ZOHOBOOKS = {
  SCOPE: [],
};

const ZOHODESK = {
  SCOPE: [],
};

const ZOHOPEOPLE = {
  SCOPE: [],
};

const ZOHOCALENDAR = {
  SCOPE: [],
};

const ZOHOWORKDRIVE = {
  SCOPE: [],
};

const ZOHOSIGN = {
  SCOPE: [],
};

const ZOHOCONNECT = {
  SCOPE: [],
};

const ZOHOASSIST = {
  SCOPE: [],
};

const ZOHOLENS = {
  SCOPE: [],
};

const ZOHOFSM = {
  SCOPE: [],
};

const ZOHOCRM = {
  SCOPE: [],
};

const ZOHOEXPENSE = {
  SCOPE: [],
};

const ZOHOINVENTORY = {
  SCOPE: [],
};

const ZOHOINVOICE = {
  SCOPE: [],
};

const ZOHOCONTRACTS = {
  SCOPE: [],
};

const ZOHOBIGIN = {
  SCOPE: [],
};

const ZOHOANALYTICS = {
  SCOPE: [],
};

const ZOHOTHRIVE = {
  SCOPE: [],
};

const ZOHOBOOKINGS = {
  SCOPE: [],
};

const ZOHOSALESIQ = {
  SCOPE: [],
};

const ZOHOCOMMERCE = {
  SCOPE: [],
};

const ZOHOCAMPAIGNS = {
  SCOPE: [],
};

const ZOHOWEBINAR = {
  SCOPE: [],
};

const ZOHOWRITER = {
  SCOPE: [],
};
const ZOHOMARKETING = {
  SCOPE: [],
};

const ZOHOBILLING = {
  SCOPE: [],
};

const ZOHOPRACTICE = {
  SCOPE: [
    'AaaServer.profile.READ',
  ],
};

const ZOHORECRUIT = {
  SCOPE: [],
};

const ZOHOWORKELY = {
  SCOPE: [],
};

const ZOHOPAYROLL = {
  SCOPE: [],
};

const ZOHOPROJECTS = {
  SCOPE: [],
};

const ZOHOSPRINTS = {
  SCOPE: [],
};

const ZOHOTABLES = {
  SCOPE: [],
};

const ZOHOZEPTOMAIL = {
  SCOPE: [],
};

const ZOHOINTEGRATOR = {
  SCOPE: [],
};

const ZOHOTEAMINBOX = {
  SCOPE: [],
};

const ZOHOBUGTRACKER = {
  SCOPE: [],
};

const ZOHOSHIFTS = {
  SCOPE: [],
};

const HUBSPOT = {
  SCOPE: [],
};
const XERO = {
  SCOPE: '',
};

const expo: { [key: string]: any } = {
  IP_LOGGING,
  APPLICATION_MODE,
  MICROSERVICE_ENABLED,
  CACHE_ENABLED,
  ENCRYPTION_KEY,
  READ_MODE,
  GRACE_MODE,

  INTERNAL_ACCESS_KEY,
  INTERNAL_ACCESS_KEYS,

  JWT_SECRET,
  JWT_EXPIRES,

  SESSION_EXPIRY,
  SESSION_STORE_IN_REDIS,
  SESSION_SECRET_KEY,

  DB,

  PROTOCOL,
  PORT,
  API_ENDPOINT,
  APP_DOMAIN,
  UI_DOMAIN,
  BASE_PATH,
  AUTH_MOUNT_POINT,
  MOUNT_POINT,

  CAHCE_KEY_EXPIRY_VALUE,
  API_REQUEST_LOG_KEY,
  RATE_LIMIT,

  // Providers
  OAUTH: {
    TRELLO,
    FACEBOOK,
    INSTAGRAM,
    WHATSAPP,
    GITHUB,
    GITLAB,
    GUMROAD,
    REDDIT,
    DROPBOX,
    PRODUCTHUNT,
    WORDPRESS,
    DIGITALOCEAN,
    BITLY,
    SLACK,
    DISCORD,
    ASANA,
    IMGUR,
    SPOTIFY,
    SHOPIFY,
    ALGOLIA,
    GETTYIMAGES,
    PIPEDRIVE,
    GIPHY,
    DRIP,
    ZOHOSHEET,
    ZOHOMAIL,
    ZOHOCRM,
    ZOHOBOOKS,
    ZOHODESK,
    ZOHOPEOPLE,
    ZOHOCALENDAR,
    ZOHOSIGN,
    ZOHOCONNECT,
    ZOHOWORKDRIVE,
    ZOHOASSIST,
    ZOHOEXPENSE,
    ZOHOINVENTORY,
    ZOHOINVOICE,
    ZOHOLENS,
    ZOHOFSM,
    ZOHOCONTRACTS,
    ZOHOBIGIN,
    ZOHOANALYTICS,
    ZOHOTHRIVE,
    ZOHOBOOKINGS,
    ZOHOWEBINAR,
    ZOHOSALESIQ,
    ZOHOCOMMERCE,
    ZOHOCAMPAIGNS,
    ZOHOWRITER,
    ZOHOBILLING,
    ZOHOPRACTICE,
    ZOHORECRUIT,
    ZOHOWORKELY,
    ZOHOPAYROLL,
    ZOHOSHIFTS,
    ZOHOMARKETING,
    ZOHOPROJECTS,
    ZOHOSPRINTS,
    ZOHOTABLES,
    ZOHOZEPTOMAIL,
    ZOHOINTEGRATOR,
    ZOHOTEAMINBOX,
    ZOHOBUGTRACKER,
    AIRTABLE,
    ...GOOGLE.AUTH,
    TWITTER: {
      ...TWITTER.OAUTH1,
      ...TWITTER.OAUTH2,
    },
    HUBSPOT,
    XERO,
  },
};

export default expo;
