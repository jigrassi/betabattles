define(function() {
    var canvas = document.getElementById("game");
    var ctx  = canvas.getContext("2d");

    var painter = {

        drawBG: function() {
            ctx.save();
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        },

        drawMatrices: function(ctrl) {
            ctx.save();
            for(var i = 0; i < ctrl.matrices.length; i++) {
                ctrl.matrices[i].draw(ctx);
            }
            ctx.restore();
        },

        drawPlayerData: function(ctrl) {
            ctx.save();
            ctx.fillStyle = '#cce6ff';
            ctx.fillRect(210,400,40,40);
            ctx.fillRect(440,400,40,40);
            ctx.fillRect(250,440,40,40);
            ctx.fillRect(480,440,40,40);

            ctx.fillStyle = '#66b3ff';
            ctx.fillText("Trace ", 250, 520);
            ctx.fillText(ctrl.players[0].matrix.trace(), 250, 550);
            ctx.fillText("Trace ", 485, 520);
            ctx.fillText(ctrl.players[1].matrix.trace(), 485, 550);
            ctx.fillStyle = '#000000';

            ctrl.players[0].matrix.draw(ctx);
            ctrl.players[1].matrix.draw(ctx);
            ctx.fillText(ctrl.players[0].name, 250, 350);
            ctx.fillText(ctrl.players[1].name, 480, 350);

            ctx.font = "50px Helvetica";
            ctx.fillText(ctrl.players[1].score, 410, 600);
            ctx.fillText(ctrl.players[0].score, 320, 600);
            ctx.fillText("-", 365, 600);
            ctx.restore();
        },

        drawHover: function(x, y, size) {
            ctx.save();
            ctx.fillStyle = '#ffcc99';
            ctx.fillRect(x,y,size,size);
            ctx.restore();
        },

        drawPlayerWin: function(result) {
            if(result == 0) {
                ctx.fillText("You Win!", 370, 313);
            } else if(result == 1) {
                ctx.fillText("You Lose!", 366, 313);
            } else {
                ctx.fillText("It's a Tie!", 380, 313);
            }
        },

        drawWaiting: function() {
            ctx.save();
            ctx.font = "40px Helvetica";
            ctx.fillText('Looking for opponent...', canvas.width/2, canvas.height/2);
            ctx.restore();
        },

        drawTurn: function(id) {
            ctx.save();
            if(id == 0) {
                ctx.fillText('Your Turn', 370, 313);
            } else {
                ctx.fillText('Opponent\'s Turn', 366, 313);
            }
            ctx.restore();
        },

        drawDisconnect: function() {
            ctx.save();
            ctx.font = "40px Helvetica";
            ctx.fillText('Your opponent has left the game.', canvas.width/2, canvas.height/2);
            ctx.restore();
        },

        defaultStyles: function() {
            ctx.fillStyle = "#000000";
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
        }
    };

    return painter;
});