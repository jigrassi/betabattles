class Painter {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        // a component has a `render`, a `collides`, and an `onClick` method
        this.components = [];
    }

    drawBG() {
        this.ctx.save();
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.restore();
    }

    drawPlayerData(clientState) {
        this.ctx.save();
        this.ctx.font = "10pt sans-serif";

        this.ctx.beginPath();
        this.ctx.rect(135,30,125,40);
        this.ctx.fillText("Funds: " + clientState.funds, 170, 50);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.rect(300, 325, 75, 40);
        this.ctx.fillText(clientState.myArmyStance, 335, 345);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(200,150,Math.log(clientState.income+1)*10 + 30,0,2*Math.PI);
        this.ctx.fillText("Income: ", 200, 125);
        this.ctx.fillText(clientState.income, 200, 150);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(200,325,Math.log(clientState.myArmy+1)*10 + 30,0,2*Math.PI);
        this.ctx.fillText("Army: ", 200, 325);
        this.ctx.fillText(Math.floor(clientState.myArmy), 200, 350);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(200,500,Math.log(clientState.myBase+1)*10 + 30,0,2*Math.PI);
        this.ctx.fillText("Base: ", 200, 475);
        this.ctx.fillText(Math.floor(clientState.myBase * 10) / 10, 200, 500);
        this.ctx.stroke();

        this.ctx.font = "20pt sans-serif";
        this.ctx.beginPath();
        this.ctx.fillText("Score: " + clientState.myWins + " - " + clientState.oppWins, 400, 550);
        this.ctx.stroke();

        for (i in this.components) {
            this.components[i].render();
        }

        this.ctx.restore();
    }

    drawOpponentData(clientState) {
        this.ctx.save();
        this.ctx.font = "10pt sans-serif";

        this.ctx.beginPath();
        this.ctx.rect(560,30,125,40);
        this.ctx.fillText("Funds:", 595, 50);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.rect(450, 325, 75, 40);
        this.ctx.fillText(clientState.oppArmyStance, 485, 345);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(625,150,50,0,2*Math.PI);
        this.ctx.fillText("Income: ", 625, 125);
        this.ctx.fillText("Unknown", 625, 150);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(625,325,75,0,2*Math.PI);
        this.ctx.fillText("Army: ", 625, 275);
        this.ctx.fillText(clientState.oppArmy, 625, 300);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(625,500,Math.log(clientState.oppBase+1)*10 + 30,0,2*Math.PI);
        this.ctx.fillText("Base: ", 625, 475);
        this.ctx.fillText(Math.floor(clientState.oppBase * 10) / 10, 625, 500);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawText(text) {
        this.ctx.save();
        this.ctx.font = "40px Helvetica";
        this.ctx.fillText(text, this.canvasWidth/2, this.canvasHeight/2);
        this.ctx.restore();
    }

    defaultStyles() {
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
    }
};

// painter.components.push(some stuff)
export default Painter;