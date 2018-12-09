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

        defaultStyles: function() {
            ctx.fillStyle = "#000000";
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
        }
    };

    return painter;
});