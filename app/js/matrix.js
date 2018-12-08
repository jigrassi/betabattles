define([], function(){
    var PADDING = 20;
    var BORDER_WIDTH = 3;

    function Matrix(rows, cols, vals, posx, posy) {
        this.rows = rows;
        this.cols = cols;
        this.vals = vals;
        this.posx = posx;
        this.posy = posy;
    };

    Matrix.prototype.mult = function(other) {
        if (this.cols != other.rows) {
            throw "error: incompatible sizes";
        }

        var result = [];
        for (var i = 0; i < this.rows; i++) {
            result[i] = [];
            for (var j = 0; j < other.cols; j++) {
                var sum = 0;
                for (var k = 0; k < this.cols; k++) {
                    sum += this.vals[i][k] * other.vals[k][j];
                }
                result[i][j] = sum;
            }
        }
        this.vals = result;
    }

    Matrix.prototype.trace = function() {
        var result = 0;
        for (var i = 0; i < this.rows; i++) {
            result += this.vals[i][i];
        }
        return result;
    }

    Matrix.prototype.draw = function(ctx) {
        // draw numbers
        for(var i = 0; i < this.rows; i++) {
            ctx.fillRect(this.posx, this.posy + i * PADDING * 2, this.cols * PADDING * 2, BORDER_WIDTH);
            for(var j = 0; j < this.cols; j++) {
                ctx.fillRect(this.posx + j * PADDING * 2, this.posy, BORDER_WIDTH, this.rows * PADDING * 2);
                ctx.fillText(this.vals[i][j], this.posx + i * PADDING * 2 + PADDING, this.posy + j * PADDING * 2 + PADDING);
            }
        }
        // + extra BORDER_WIDTH is needed to fill out the corner
        ctx.fillRect(this.posx, this.posy + this.rows * PADDING * 2, this.cols * PADDING * 2 + BORDER_WIDTH, BORDER_WIDTH);
        ctx.fillRect(this.posx + this.rows * PADDING * 2, this.posy, BORDER_WIDTH, this.cols * PADDING * 2);
    };

    Matrix.WIDTH = PADDING*2;

    return Matrix;
});