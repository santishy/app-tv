
const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT

        this.databaseConnection();

        //middleware
        this.middlwares();
        //Routes
        this.routes();
    }
    async databaseConnection(){
        await dbConnection()
    }
    middlwares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'))
    }
    routes() {
        this.app.use('/api/products',require('../routes/products'));
        this.app.use('/api/users/',require('../routes/users'));
    }

    listen(){
        this.app.listen(process.env.PORT,() => {
            console.log('server running in port ' + this.port)
        })
    }
}

module.exports = Server;