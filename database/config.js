const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const uri =
      process.env.MONGODB_CNN ??
      "mongodb+srv://santishy:Sm10.Mg10@cluster0.c30jf.mongodb.net/app_tv";
    await mongoose.connect(uri);
    console.log("Online database");
  } catch (error) {
    console.log(error);
    throw new Error("Error starting database");
  }
};

module.exports = {
  dbConnection,
};
