module.exports = {
    p1: null,
    p2: null,

    init_players: function(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    },

    fuck: function(x) {
        this.p1.emit('fuck', x - 1);
        this.p2.emit('fuck', x);
    },

    disconnect_all: function() {
        console.log('disconnected both');
        this.p1.emit('dc');
        this.p2.emit('dc');
    }
}