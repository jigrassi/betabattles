define(['matrix','painter'], function (Matrix, painter) {

      // Create the canvas
    var w = window;
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    canvas.width = 760;
    canvas.height = 650;
    painter.defaultStyles();
    var ctrl;   // main game object

    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    if (document.readyState === "complete") { prepareEventHandlers(); }

    // SOCKETS ##################################################

    var socket = io();

    socket.on('matched', function(data) {
        // matched... initialize everything
        if(data.rematch != true) {
            initObjects();
        }
        setObjects(data);
        setState("playing");
        overSent = false;
    });

    socket.on('move', function(move) {
        ctrl.hover = -1;
        ctrl.update(move);
    });

    socket.on('dc', function() {
        setState("dc");
    })

    // MATRIX CONTROL ##################################################
    function Player(name) {
        this.name = name;
        this.matrix = new Matrix(ctrl.m_size, ctrl.m_size, [[1, 0], [0, 1]], 0, 0);
        this.score = 0;
    };

    function initObjects() {
        ctrl = new Ctrl([], 0, 0);
        var players = [new Player("You"), new Player("Opponent")];
        players[0].matrix.posx = 210;
        players[0].matrix.posy = 400;
        players[1].matrix.posx = 440;
        players[1].matrix.posy = 400;
        ctrl.players = players;
    }

    function setObjects(data) {
        ctrl.matrices = genMatrices(data.matrices, data.m_size);
        ctrl.m_size = data.m_size;
        ctrl.turn = data.turn;
        ctrl.players[0].matrix.rows = data.m_size;
        ctrl.players[0].matrix.cols = data.m_size;
        ctrl.players[1].matrix.rows = data.m_size;
        ctrl.players[1].matrix.cols = data.m_size;
        ctrl.players[0].matrix.vals = [[1, 0], [0, 1]];
        ctrl.players[1].matrix.vals = [[1, 0], [0, 1]];
    }

    function Ctrl(matrices, size, turn) {
        this.matrices = matrices;
        this.m_size = size;
        this.turn = turn; // alternates between 0 and 1
        this.players = [];
        this.result = 0;
        this.hover = -1;
    };

    Ctrl.prototype.push = function(matrix) {
        this.matrices.push(matrix);
    };

    Ctrl.prototype.pop = function(index) {
        index = index || 0
        this.matrices.splice(index,1)
    };

    Ctrl.prototype.select = function(x,y) {
        for(var i = 0; i < this.matrices.length; i++) {
            if(x >= this.matrices[i].posx
                && x <= this.matrices[i].posx + Matrix.WIDTH * this.m_size
                && y >= this.matrices[i].posy
                && y <= this.matrices[i].posy + Matrix.WIDTH * this.m_size) {
                return i;
            }
        }
    };

    Ctrl.prototype.update = function(m_id) {
        this.players[this.turn].matrix.mult(this.matrices[m_id]);
        this.pop(m_id);
        this.turn = (this.turn + 1) % this.players.length
    };

    // CLICKING #######################################################

    // called by window.onload, to make sure canvas is loaded before attaching listener
    function prepareEventHandlers() {
        var canvasPosition = {
            x: canvas.offsetLeft,
            y: canvas.offsetTop
        };

        canvas.addEventListener('click', function(e) {
            var mouse = {
                x: e.pageX - canvasPosition.x,
                y: e.pageY - canvasPosition.y
            };
            if(gstate == "playing" && ctrl.turn == 0) {
                m_id = ctrl.select(mouse.x, mouse.y);

                if(m_id || m_id == 0) { //interprets 0 as null
                    ctrl.hover = -1;
                    ctrl.update(m_id);
                }
                socket.emit('move', m_id);
            }
        }, false);

        canvas.addEventListener('mousemove', function(e) {
            var mouse = {
                x: e.pageX - canvasPosition.x,
                y: e.pageY - canvasPosition.y
            };
            
            if(gstate == "playing" && ctrl.turn == 0) {
                m_id = ctrl.select(mouse.x, mouse.y);
                if(m_id || m_id == 0) {
                    ctrl.hover = m_id;
                } else {
                    ctrl.hover = -1;
                }
            }
        });
    }

    // MAIN LOOP STUFF ##############################################
    var gstate = "waiting";

    function setState(state) {
        gstate = state;
    }

    // Draw everything
    var render = function () {
        painter.drawBG();
        switch(gstate) {
            case "waiting":
                painter.drawWaiting();
                break;
            case "playing":
                if(ctrl.hover >= 0) {
                    painter.drawHover(ctrl.matrices[m_id].posx, ctrl.matrices[m_id].posy,80);
                }
                painter.drawMatrices(ctrl);
                painter.drawPlayerData(ctrl);
                if(overSent == false) {
                    painter.drawTurn(ctrl.turn);
                } else {
                    painter.drawPlayerWin(ctrl.result);
                }
                break;
            case "dc":
                painter.drawDisconnect();
                break;
        }
        
    };

    function genMatrices(matrices, m_size) {
        var rowSize = Math.ceil(matrices.length / 2);
        for(var i = 0; i < matrices.length; i++) {
            matrices[i] = new Matrix(m_size, m_size, matrices[i],
                          100 + 150 * (i % rowSize), 50 + 150 * Math.floor(i / rowSize));
        }
        return matrices;
    }

    function gameOver() {
        if(ctrl.players[0].matrix.trace() > ctrl.players[1].matrix.trace()) {
            ctrl.players[0].score += 1;
            ctrl.result = 0;
        } else if (ctrl.players[0].matrix.trace() < ctrl.players[1].matrix.trace()) {
            ctrl.players[1].score += 1;
            ctrl.result = 1;
        } else {
            ctrl.players[0].score += 0.5;
            ctrl.players[1].score += 0.5;
            ctrl.result = 0.5;
        }
        socket.emit('over', {});
    }
    // The main game loop
    var overSent = false;
    var main = function () {
        if(gstate === "playing" && overSent == false && ctrl.matrices.length == 0) {
            overSent = true;
            gameOver();
        }
        render();
        requestAnimationFrame(main);
    };

    // var then = Date.now();

    function run() {
        main();
    }

    return {
        run: run
    };
});