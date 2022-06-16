/**
 * Request handlers
 */

// Dependencies
import * as datam from './data.mjs';

const ping = (data, callback) => {
  callback(200);
};

const notFound = (data, callback) => {
  callback(404);
};

// description
const usersPost = (data, callback) => {
  const firstName =
    typeof data.payload.firstName == 'string' &&
    data.payload.firstName.length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == 'string' && data.payload.lastName.length > 0
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof data.payload.phone == 'string' &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password == 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  const tosAgreement =
    typeof data.payload.tosAgreement == 'boolean'
      ? data.payload.tosAgreement
      : false;

  if (!firstName || !lastName || !phone || !password || !tosAgreement) {
    callback(400, { Error: 'Missing required fields' });
  } else {
    // Checks if the users exists
    datam.read('users', phone);
  }
};
const usersGet = (data, callback) => {};
const usersPut = (data, callback) => {};
const usersDelete = (data, callback) => {};

const users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

const handlers = {
  ping,
  notFound,
  users,
  _users: {
    post: usersPost,
  },
};

export { handlers };
