const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const Category = require("../models/Category")
const Product = require("../models/Product")
const { dbConnection } = require("./config");
const mongoose = require("mongoose");
const seedDatabase = async () => {
  try {
    await connect();
    await Product.deleteMany({})
    await User.deleteMany({});
    await Category.deleteMany({});
    const count = await User.countDocuments();
    if (count > 0) {
      console.log("Ya existe un o más usuarios");
      return;
    }
    const data = {
      name: "Usuario del sistema",
      username: "root",
      password: "secret",
      email: "santi_shy@hotmail.com",
      role: "admin",
    };
    const salt = bcryptjs.genSaltSync();
    data.password = bcryptjs.hashSync(data.password, salt);
    await User.create(data);
    mongoose.connection.close();
  } catch (error) {
    console.log(error);
    mongoose.connection.close();
  }
};

const connect = async () => {
  await dbConnection();
};

seedDatabase();
