class ReadyCheck {
  constructor() {
    this.playerReadyStateByUsername = new Map();
    // where game options would live too
  }

  addUsers(usernames) {
    usernames.forEach((username) => {
      this.playerReadyStateByUsername.set(username, false);
    });
  }

  setReadyState(username, isReady) {
    this.playerReadyStateByUsername.set(username, isReady);
  }

  allReady() {
    const allReadyStates = Array.from(this.playerReadyStateByUsername.values());
    return allReadyStates.every(isReady => isReady);
  }

  getUsernames() {
    return Array.from(this.playerReadyStateByUsername.keys());
  }
}

module.exports = ReadyCheck;