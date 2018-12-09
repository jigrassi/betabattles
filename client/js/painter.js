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

        drawPlayerData: function(clientState) {
            ctx.save();
            ctx.font = "10pt sans-serif";

            ctx.beginPath();
            ctx.rect(135,30,125,40);
            ctx.fillText("Funds: " + clientState.funds, 170, 50);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(200,150,50,0,2*Math.PI);
            ctx.fillText("Income: ", 200, 125);
            ctx.fillText(clientState.income, 200, 150);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(200,325,75,0,2*Math.PI);
            ctx.fillText("Army: ", 200, 275);
            ctx.fillText(clientState.myArmy, 200, 300);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(200,500,50,0,2*Math.PI);
            ctx.fillText("Base: ", 200, 475);
            ctx.fillText(clientState.myBase, 200, 500);
            ctx.stroke();

            ctx.restore();
        },

        drawOpponentData: function(clientState) {
            ctx.save();
            ctx.font = "10pt sans-serif";

            ctx.beginPath();
            ctx.rect(435,30,125,40);
            ctx.fillText("Funds:", 470, 50);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(500,150,50,0,2*Math.PI);
            ctx.fillText("Income: ", 500, 125);
            ctx.fillText("Unknown", 500, 150);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(500,325,75,0,2*Math.PI);
            ctx.fillText("Army: ", 500, 275);
            ctx.fillText(clientState.oppArmy, 500, 300);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(500,500,50,0,2*Math.PI);
            ctx.fillText("Base: ", 500, 475);
            ctx.fillText(clientState.oppBase, 500, 500);
            ctx.stroke();
            
            ctx.restore();
        },
        
        drawText: function(text) {
            ctx.save();
            ctx.font = "40px Helvetica";
            ctx.fillText(text, canvas.width/2, canvas.height/2);
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