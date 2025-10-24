var _users = require("./users");

function initModels(sequelize) {
  // Require DataTypes from the sequelize package at runtime (server-side)
  var DataTypes = require('sequelize').DataTypes;
  var Users = _users(sequelize, DataTypes);

  return {
    Users,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
