const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
const { setIO } = require('../sockets/bus');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    //creación del servidor de express y socket.io
    this.server = require('http').createServer(this.app);
    //configuración de sockets
    this.io = require('socket.io')(this.server, {
      cors: {
        origin: ['http://localhost:5173', 'https://saeseg.app'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    //Conectar a base de datos
    this.databaseConnection();

    //middleware
    this.middlwares();
    //Routes
    this.routes();
    //Sockets
    setIO(this.io);
    this.sockets();
  }
  async databaseConnection() {
    await dbConnection();
  }
  middlwares() {
    const allowedOrigins = ['https://saeseg.app', 'http://localhost:5173'];
    this.app.use(
      cors({
        origin: function (origin, callback) {
          // Permitir solicitudes sin origen (como Postman o curl)

          if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
          } else {
            return callback(new Error('CORS policy: Origin not allowed'));
          }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );
    //const express = require("express");
    this.app.use(express.json());

    this.app.use(express.static('public'));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
        limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
      }),
    );
  }
  routes() {
    this.app.use('/api/products/', require('../routes/products'));
    this.app.use('/api/users/', require('../routes/users'));
    this.app.use('/api/auth/', require('../routes/auth'));
    this.app.use('/api/categories/', require('../routes/categories'));
    this.app.use('/images/', require('../routes/images'));
    this.app.use('/api/store-settings/', require('../routes/store-settings'));
  }

  sockets() {
    //importar sockets
    require('../sockets')(this.io);
  }

  listen() {
    this.server.listen(process.env.PORT, () => {
      console.log('server running in port ' + this.port);
    });
  }
}

module.exports = Server;
