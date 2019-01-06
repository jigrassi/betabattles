class Painter {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        // a component has a `render`, a `collides`, and an `onClick` method
        this.components = [];
        this.setDefaultStyles();
    }

    createRectComponent(fillText, left, top, width, height, onClickEvent) {
        let ctx = this.ctx; // needed because `this` inside the dict doesn't escape dict scope
        return {
            render: function() {
                ctx.beginPath();
                ctx.rect(left, top, width, height);
                ctx.textAlign = "start";
                ctx.fillText(fillText, left + 10, top + (height / 2));
                ctx.stroke();
            },
            collides: function(x, y) {
                return (x >= left && x <= (left + width) && y >= top && y <= (top + height));
            },
            onClick: onClickEvent
        }
    }

    createCircleComponent(title, fillText, centerX, centerY, radius, onClickEvent) {
        let ctx = this.ctx; // needed because `this` inside the dict doesn't escape dict scope
        return {
            render: function() {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.textAlign = "center";
                ctx.fillText(title, centerX, centerY - 10);
                ctx.fillText(fillText, centerX, centerY + 10);
                ctx.stroke();
            },
            collides: function(x, y) {
                return Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2) <= radius * radius;
            },
            onClick: onClickEvent
        }
    }

    drawBG() {
        this.ctx.save();
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.restore();
    }

    drawGameState(clientState) {
        this.components = [];

        // player data
        this.components.push(this.createRectComponent(
            "Funds: " + clientState.funds, 135, 30, 125, 40, ""));
        this.components.push(this.createCircleComponent(
            "Income:", clientState.income, 200, 150, Math.log(clientState.income + 1) * 10 + 30, "increaseIncome"));
        this.components.push(this.createCircleComponent(
            "Army:", clientState.myArmy, 200, 325, Math.log(clientState.myArmy + 1) * 10 + 30, "increaseArmy"));
        this.components.push(this.createRectComponent(
            clientState.myArmyStance, 300, 325, 100, 40, "toggleArmyStance"));
        this.components.push(this.createCircleComponent(
            "Base:", clientState.myBase, 200, 500, Math.log(clientState.myBase + 1) * 10 + 30, ""));

        // opponent data
        this.components.push(this.createRectComponent(
            "Funds: unknown", 560, 30, 125, 40, ""));
        this.components.push(this.createRectComponent(
            clientState.oppArmyStance, 425, 325, 100, 40, ""));
        this.components.push(this.createCircleComponent(
            "Income:", "unknown", 625, 150, 50, ""));
        this.components.push(this.createCircleComponent(
            "Army:", clientState.oppArmy, 625, 325, 75, ""));
        this.components.push(this.createCircleComponent(
            "Base:", clientState.oppBase, 625, 500, Math.log(clientState.oppBase + 1) * 10 + 30, ""));

        this.ctx.save();
        this.ctx.font = "10pt sans-serif";

        for (const i in this.components) {
            this.components[i].render();
        }

        this.ctx.font = "20pt sans-serif";
        this.ctx.beginPath();
        this.ctx.fillText("Score: " + clientState.myWins + " - " + clientState.oppWins, 400, 550);
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawText(text) {
        this.ctx.save();
        this.ctx.font = "40px Helvetica";
        this.ctx.fillText(text, this.canvasWidth/2, this.canvasHeight/2);
        this.ctx.restore();
    }

    setDefaultStyles() {
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
    }
};

// painter.components.push(some stuff)
export default Painter;