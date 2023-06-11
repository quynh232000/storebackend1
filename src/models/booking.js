"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bookings.belongsTo(models.products, {
        foreignKey: "idProduct",
        targetKey: "id",
        as: "productData",
      });
    }
  }
  bookings.init(
    {
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      idProduct: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "bookings",
    }
  );
  return bookings;
};
