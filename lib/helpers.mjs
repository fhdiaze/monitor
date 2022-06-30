/**
 * Helpers for various tasks
 */

// Dependencies
import crypto from 'crypto';
import * as config from './config.mjs';

/**
 *
 */
const hash = str => {
  if (typeof str == 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', config.environment.hashingSecret)
      .update(str)
      .digest('hex');

    return hash;
  } else {
    return false;
  }
};

const parseJsonToObject = buffer => {
  try {
    const obj = JSON.parse(buffer);

    return obj;
  } catch (err) {
    return {};
  }
};

const createRandomString = length => {
  length = typeof(length) == 'number' && length > 0 ? length : false;

  if (length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';

    for (let i = 1; i <= length; i++) {
      var randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      str += randomChar;
    }

    return str;
  } else {
    return false;
  }
};

export { hash, parseJsonToObject, createRandomString };
