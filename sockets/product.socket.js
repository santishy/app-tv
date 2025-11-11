module.exports = (io, socket) => {
  socket.on('product:new', (data) => {
    io.emit('product:new', data); // Emitir a todos los clientes conectados
  });
  socket.on('product:update', (data) => {
    io.emit('product:update', data); // Emitir a todos los clientes conectados
  });

  socket.on('disconnect', () => {
    console.log('Producto socket desconectado', socket.id);
  });
};
