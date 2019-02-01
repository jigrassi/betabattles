let connectionHubInstance = null;

class ConnectionHub {
  static Instance(){
    if(connectionHubInstance === null){
      connectionHubInstance = new ConnectionHub();
    }

    return connectionHubInstance;
  }

  constructor() {
    this.socketById = new Map();
  }

  registerConnection(socket) {
    console.log(`Registered ${socket.id}`);
    this.socketById.set(socket.id, socket);
  }

  clearConnection(socketId) {
    this.socketById.delete(socket.id);
  }

  emit(socketId, message, data = null) {
    if (!this.socketById.has(socketId)) {
      console.error(`${socketId} is not registered!`);
      return;
    }

    console.log(`Emitting ${message} to ${socketId}`);
    const socket = this.socketById.get(socketId);

    if (data === null) {
      socket.emit(message);
    } else {
      socket.emit(message, data);
    }
  }
}

module.exports = ConnectionHub;