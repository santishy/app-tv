const { verify } = require('jsonwebtoken');
const productSocket = require('./product.socket');

module.exports = (io) => {
  const publicSocket = io.of('/public');
  publicSocket.on('connection', (socket) => {
    productSocket(publicSocket, socket);
  });

  const privateSocket = io.of('/private');

  privateSocket.use(async (socket, next) => {
    let token = socket.handshake.auth.token;
    if (!token || token.length < 10) {
      console.log('Cliente desconectado por falta de token', socket.id);
      return next(new Error('No token provided'));
    }
    token = token.trim().replace(/^Bearer\s+/i, '');

    const resp = await verifyToken(token);
    if (!resp) {
      console.log('Cliente desconectado por token inválido', socket.id);
      return next(new Error('Invalid token'));
    }
    socket.data.userId = resp;
    next();
  });

  const verifyToken = async (token) => {
    try {
      const { uuid } = verify(token, process.env.SECRET_OR_PRIVATE_KEY);
      return uuid;
    } catch (error) {
      console.log('Token verification failed:', error.message);
      return null;
    }
  };

  privateSocket.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
  });
};
