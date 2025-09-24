let _io;
module.exports.setIO = (io) => (_io = io);
module.exports.emitPrivate = (event, payload) => _io.of('/private').emit(event, payload);
module.exports.emitPublic = (event, payload) => _io.of('/public').emit(event, payload);
