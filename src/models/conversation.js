"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      conversations.belongsTo(models.users, {
        foreignKey: "memberTwoId",
        targetKey: "id",
        as: "userSendData",
      });
    }
  }
  conversations.init(
    {
      memberOneId: DataTypes.INTEGER,
      memberTwoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "conversations",
    }
  );
  return conversations;
};
