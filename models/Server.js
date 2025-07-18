const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.databaseConnection();

    //middleware
    this.middlwares();
    //Routes
    this.routes();
  }
  async databaseConnection() {
    await dbConnection();
  }
  middlwares() {
    const allowedOrigins = ["https://saeseg.app", "http://localhost:5173"];

    this.app.use(
      cors({
        origin: function (origin, callback) {
          // Permitir solicitudes sin origen (como Postman o curl)
          console.log(origin)
          if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
          } else {
            return callback(new Error("CORS policy: Origin not allowed"));
          }
        },
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT","OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    const express = require("express");
    this.app.use(express.json());

    this.app.use(express.static("public"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }
  routes() {
    this.app.use("/api/products/", require("../routes/products"));
    this.app.use("/api/users/", require("../routes/users"));
    this.app.use("/api/auth/", require("../routes/auth"));
    this.app.use("/api/categories/", require("../routes/categories"));
    this.app.use("/images/", require("../routes/images"));
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log("server running in port " + this.port);
    });
  }
}

module.exports = Server;
