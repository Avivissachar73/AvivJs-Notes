
var _io;

const setIo = (io) => _io = io;
const getIO = () => _io;

const getUserFromSession = (socket) => getSession(socket).userData?.user;
const getSession = (socket) => socket.request.session;
const emitToSocket = (socketId) => _io.to(socketId);  // get specific client to emit
const getSocket = (socketId) => _io.sockets.sockets.get(socketId);

const requireAuth = (socket, next) => {
  // console.log('TESTING AUTH');
  const user = getUserFromSession(socket);
  if (!user) return;
  socket.user = user;
  next();
}

module.exports = {
  setIo,
  getIO,
  getSession,
  getUserFromSession,
  emitToSocket,
  requireAuth,
  getSocket
}