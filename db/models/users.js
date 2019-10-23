import bcrypt from 'bcrypt';
import {
  createErrorLogin,
  createErrorSignup,
} from 'src/services/error_manager';

const HASH_ROUNDS = 10;
const disallowedUiKeys = {
  createdAt: true,
  updatedAt: true,
  password: true,
};
const BASE_CLAIMS = {
  'end_user': true,
};

export default function (sequelize, DataTypes) {
  const UsersModel = sequelize.define('users', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
    },
    firstName: DataTypes.TEXT,
    lastName: DataTypes.TEXT,
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // - claims will be a js object stringified
    claims: DataTypes.TEXT,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {});

  UsersModel.associate = function(models) {
    // associations can be defined here
  };

  UsersModel.createStd = ({ user, transaction }) => {
    return UsersModel.findOne({
      where: { email: user.email },
    }).then(dupeUser => {
      if (!dupeUser) return bcrypt.hash(user.password, HASH_ROUNDS);
      throw(createErrorSignup({
        message: 'Email already in use',
        friendlyMessage: `We're sorry, but the email you selected is being used by another account, please try a different one.`,
      }));
    }).then(hash => {
      user.password = hash;
      user.claims = JSON.stringify(BASE_CLAIMS);
      return UsersModel.create(user, { transaction });
    }).then(newUser => {
      return UsersModel.prepForUi({ user: newUser });
    });
  };

  UsersModel.prepForUi = ({ user }) => {
    return Object.keys(user.dataValues).reduce((acc, key) => {
      if (disallowedUiKeys[key]) return acc;

      let value = user[key];
      if (key === 'claims') value = JSON.parse(value);

      acc[key] = value;
      return acc;
    }, {});
  };

  UsersModel.fetchWithCredentials = ({ email, password }) => {
    let user;
    return UsersModel.findOne({ where: { email } }).then(userRes => {
      user = userRes;
      return bcrypt.compare(password, user.dataValues.password);
    }).then(passCompareResult => {
      if (passCompareResult) return UsersModel.prepForUi({ user });
      throw(createErrorLogin({
        message: 'Invalid email or password',
        friendlyMessage: 'Invalid email or password',
      }));
    });
  };

  UsersModel.updatePassword = ({ passwords }) => {
    // not implemented
  };

  return UsersModel;
};
