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
            ctx.rect(300, 325, 75, 40);
            ctx.fillText(clientState.myArmyStance, 335, 345);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(200,150,Math.log(clientState.income+1)*10 + 30,0,2*Math.PI);
            ctx.fillText("Income: ", 200, 125);
            ctx.fillText(clientState.income, 200, 150);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(200,325,Math.log(clientState.myArmy+1)*10 + 30,0,2*Math.PI);
            ctx.fillText("Army: ", 200, 325);
            ctx.fillText(Math.floor(clientState.myArmy), 200, 350);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(200,500,Math.log(clientState.myBase+1)*10 + 30,0,2*Math.PI);
            ctx.fillText("Base: ", 200, 475);
            ctx.fillText(Math.floor(clientState.myBase * 10) / 10, 200, 500);
            ctx.stroke();

            ctx.font = "20pt sans-serif";
            ctx.beginPath();
            ctx.fillText("Score: " + clientState.myWins + " - " + clientState.oppWins, 400, 550);
            ctx.stroke();

            ctx.restore();
        },

        drawOpponentData: function(clientState) {
            ctx.save();
            ctx.font = "10pt sans-serif";

            ctx.beginPath();
            ctx.rect(560,30,125,40);
            ctx.fillText("Funds:", 595, 50);
            ctx.stroke();

            ctx.beginPath();
            ctx.rect(450, 325, 75, 40);
            ctx.fillText(clientState.oppArmyStance, 485, 345);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(625,150,50,0,2*Math.PI);
            ctx.fillText("Income: ", 625, 125);
            ctx.fillText("Unknown", 625, 150);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(625,325,75,0,2*Math.PI);
            ctx.fillText("Army: ", 625, 275);
            ctx.fillText(clientState.oppArmy, 625, 300);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(625,500,Math.log(clientState.oppBase+1)*10 + 30,0,2*Math.PI);
            ctx.fillText("Base: ", 625, 475);
            ctx.fillText(Math.floor(clientState.oppBase * 10) / 10, 625, 500);
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