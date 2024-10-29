
const express = require('express')
const cors = require('cors')
class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT
        //middleware
        this.middlwares();
        //Routes
        this.routes();
    }
    middlwares(){
        this.app.use(cors());
        this.app.use(express.static('public'))
    }
    routes() {
        this.app.use('/api/products',require('../routes/products'));
    }

    listen(){
        this.app.listen(process.env.PORT,() => {
            console.log('server running in port ' + this.port)
        })
    }
}

module.exports = Server;