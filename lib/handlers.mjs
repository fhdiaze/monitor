/**
 * Request handlers
 */

// Dependencies
import * as datam from './data.mjs';
import * as helpers from './helpers.mjs';

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
    try {
      datam.read('users', phone);
      callback(400, { error: 'The user already exists' });
      return;
    } catch (err) {
      // The user does not exist
      const hashedPassword = helpers.hash(password);

      if (hashedPassword) {
        const user = {
          firstName,
          lastName,
          phone,
          hashedPassword,
          tosAgreement,
        };
        try {
          datam.create('users', phone, user);
          callback(200);
        } catch (err) {
          callback(500, { Error: 'Could not create the new user' });
        }
      } else {
        calback(500, { Error: "Could not create the user's password" });
      }
    }
  }
};
const usersGet = (data, callback) => {
  // Check the phone is valid
  const phone =
    typeof data.query.phone == 'string' && data.query.phone.trim().length == 10
      ? data.query.phone.trim()
      : false;

  if (phone) {
    try {
      const user = datam.read('users', phone);
      // Remove hashed password
      delete user.hashedPassword;
      callback(200, user);
    } catch (err) {
      callback(404);
    }
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};
const usersPut = (data, callback) => {
  const phone =
    typeof data.payload.phone == 'string' &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone
      : false;

  const firstName =
    typeof data.payload.firstName == 'string' &&
    data.payload.firstName.length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == 'string' && data.payload.lastName.length > 0
      ? data.payload.lastName.trim()
      : false;
  const password =
    typeof data.payload.password == 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      try {
        const user = datam.read('users', phone);
        user.firstName = firstName ? firstName : user.firstName;
        user.lastName = lastName ? lastName : user.lastName;
        user.password = password ? helpers.hash(password) : user.password;
        try {
          datam.update('users', phone, user);
          callback(200);
        } catch (err) {
          callback(500, { Error: 'There was an eror updating the user' });
        }
      } catch (err) {
        callback(404, { Error: 'The specified user does not exist' });
      }
    } else {
      callback(400, { Error: 'Missing fields to update' });
    }
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};
const usersDelete = (data, callback) => {
  // Check the phone is valid
  const phone =
    typeof data.query.phone == 'string' && data.query.phone.trim().length == 10
      ? data.query.phone.trim()
      : false;

  if (phone) {
    try {
      const user = datam.read('users', phone);
      try {
        datam.del('users', phone);
        callback(200);
      } catch (err) {
        callback(400, { Error: 'Could not delete the specified user' });
      }

      callback(200, user);
    } catch (err) {
      callback(404);
    }
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

const users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

const tokens = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

const tokensPost = (data, callback) => {
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

  if (phone && password) {
    try {
      const user = datam.read('users', phone);
      const hashedPassword = helpers.hash(password);
      if (hashedPassword == user.hashedPassword) {
        const tokenId = helpers.createRandomString(20);
        const expires = Date.now() + 1000 * 60 * 60;
        const tokenObj = {
          phone,
          id: tokenId,
          expires,
        };
        try {
          datam.create('tokens', tokenId, tokenObj);
          callback(200, tokenObj);
        } catch (err) {
          callback(500, { Error: 'Unable to save the token' });
        }
      } else {
        callback(400, {
          Error: "Password did not match the specidifed user's stored",
        });
      }
    } catch (err) {
      callback(400, { Error: 'No user was found' });
    }
  } else {
    callback(400, { Error: 'Missing required field(s)' });
  }
};

const tokensGet = (data, callback) => {
  const id =
    typeof data.query.id == 'string' && data.query.id.trim().length == 20
      ? data.query.id.trim()
      : false;

  if (id) {
    try {
      const token = datam.read('tokens', id);
      callback(200, token);
    } catch (err) {
      callback(404);
    }
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

const tokensPut = (data, callback) => {};

const tokensDelete = (data, callback) => {};

const handlers = {
  ping,
  notFound,
  users,
  _users: {
    post: usersPost,
    get: usersGet,
    put: usersPut,
    delete: usersDelete,
  },
  tokens,
  _tokens: {
    post: tokensPost,
    get: tokensGet,
    put: tokensPut,
    delete: tokensDelete,
  },
};

export { handlers };
