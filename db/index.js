import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const sequelize = initializeDatabase();
const modelFiles = findModelFiles();
const db = buildDatabaseObject(modelFiles, sequelize);
establishModelAssociations();

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;

function initializeDatabase() {
  const { DATABASE, USERNAME, PASSWORD, CONFIG } = process.env;
  return new Sequelize(
    config.database, config.username, config.password, config
  );
}

function findModelFiles() {
  const basename = path.basename(module.filename);

  return fs.readdirSync(__dirname).filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js')
  );
}

function buildDatabaseObject(modelFiles, databaseConnection) {
  const databaseObject = {};

  modelFiles.forEach(modelFile => {
    const modelFilePath = path.join(__dirname, modelFile);
    const model = databaseConnection.import(modelFilePath);
    databaseObject[model.name] = model;
  });

  return databaseObject;
}

function establishModelAssociations() {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}
