import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from 'src/db/config';
import notebooks from './notebooks';
import users from './users';

const modelInitializers = [
  notebooks,
  users,
];

const sequelize = initializeDatabase();
const models = initializeModels();
establishModelAssociations();

models.sequelize = sequelize;
models.Sequelize = Sequelize;
export default models;

function initializeDatabase() {
  const envConfig = config[process.env.NODE_ENV];
  const { database, username, password } = envConfig;
  return new Sequelize(database, username, password, envConfig);
}

function initializeModels() {
  return modelInitializers.reduce(function(allModels, modelInitializer) {
    const model = modelInitializer(sequelize, Sequelize);
    allModels[model.name] = model;
    return allModels;
  }, {});
}

function establishModelAssociations() {
  Object.keys(models).forEach(modelName => {
    const model = models[modelName];
    if (model.associate) model.associate(models);
  });
}
