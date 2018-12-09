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

        drawText: function(text) {
            ctx.save();
            ctx.font = "40px Helvetica";
            ctx.fillText(text, canvas.width/2, canvas.height/2);
            ctx.restore();
        },
    };

    return painter;
});