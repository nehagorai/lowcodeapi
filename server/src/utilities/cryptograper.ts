import CryptoJS from 'crypto-js';
import config from '../config';

const { ENCRYPTION_KEY } = config;

function maskToken(token: string) {
  let length: number = 4;

  if (token.length <= 8) {
    length = token.length / 3;
  }

  const firstFive = token.slice(0, length);
  const lastFive = token.slice(-length);
  const maskedChars = '*'.repeat(16);
  const maskedToken = firstFive + maskedChars + lastFive;

  return maskedToken;
}

function encrypt(key: { [key: string]: any }): { [key: string]: any } {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not define in .env');
  }

  return {
    value: CryptoJS.AES.encrypt(JSON.stringify(key), ENCRYPTION_KEY).toString(),
    hash: CryptoJS.MD5(ENCRYPTION_KEY).toString(),
  };
}

const decrypt = (encrypted: any) => CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(
  CryptoJS.enc.Utf8,
);

function maskKeys(key: { [key: string]: any }): { [key: string]: any } {
  const maskedValues: { [key: string]: any } = {};

  Object.entries(key).forEach(([maskKey, maskValue]) => {
    maskedValues[maskKey] = maskToken(maskValue);
  });

  return maskedValues;
}

const generateMD5 = (key: string) => CryptoJS.MD5(key).toString();

const cryptograper: {
  encrypt: Function;
  decrypt: Function;
  maskKeys: Function;
  generateMD5: Function;
} = {
  encrypt,
  decrypt,
  maskKeys,
  generateMD5,
};

export default cryptograper;
