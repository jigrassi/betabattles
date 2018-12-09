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

        },

        drawPlayerData: function(ctrl) {
            ctx.save();
            ctx.save();

            ctx.font = "10pt sans-serif";

            ctx.beginPath();
            ctx.rect(135,30,125,40);
            ctx.fillText("Funds: ", 170, 50);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(200,150,50,0,2*Math.PI);
            ctx.fillText("Income: ", 200, 125);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(200,325,75,0,2*Math.PI);
            ctx.fillText("Army: ", 200, 275);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(200,500,50,0,2*Math.PI);
            ctx.fillText("Base: ", 200, 475);
            ctx.stroke();
            ctx.restore();
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