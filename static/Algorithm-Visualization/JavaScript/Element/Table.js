//implement from Text()

function Table() {
    this.PosX = 0;
    this.PosY = 0;
    this.row = 0;
    this.col = 0;
    this.cellHeight = 0;
    this.cellWidth = 0;
    this.body = new Array();
}

Table.prototype.Inite = function (PosX, PosY, row, col, cellHeight, cellWidth) {
    this.PosX = PosX;
    this.PosY = PosY;
    this.row = row;
    this.col = col;
    this.cellHeight = cellHeight;
    this.cellWidth = cellWidth;

    for(let i = 0; i < row; i++){
        this.body[i] = new Array(col);
        for(let j = 0; j < col; j++){
            this.body[i][j] = null;
        }
    }
};

Table.prototype.DrawTable = function (Context, lineColor, lineWidth, valColor, valFont) {
    for(let i = 0; i < this.row; i++){
        let originWidth = Context.lineWidth;
        let originStyle = Context.strokeStyle;
        Context.lineWidth = lineWidth;
        Context.strokeStyle = lineColor;
        for(let j = 0; j < this.col; j++){
            Context.strokeRect(this.PosX + j*this.cellWidth, this.PosY + i*this.cellHeight, this.cellWidth, this.cellHeight);
        }
        Context.lineWidth = originWidth;
        Context.strokeStyle = originStyle;

        for(let j = 0; j < this.col; j++) {
            if (this.body[i][j] != null) {
                let tmptext = new Text();
                let str = this.body[i][j];
                if(this.body[i][j] == 99999999) str = "∞";
                tmptext.Inite(this.PosX + j * this.cellWidth, this.PosY + (i+0.5) * this.cellHeight+5, valColor, valFont, str);
                tmptext.DrawCenterText(Context, this.cellWidth);
                //tmptext.DrawText(Context);
            }
        }
    }
};

Table.prototype.DrawTableElement = function (Context, row, col, lineColor, lineWidth, valColor, valFont) {
    let originWidth = Context.lineWidth;
    let originStyle = Context.strokeStyle;
    Context.lineWidth = lineWidth;
    Context.strokeStyle = lineColor;
    Context.strokeRect(this.PosX + col*this.cellWidth, this.PosY + row*this.cellHeight, this.cellWidth, this.cellHeight);
    Context.lineWidth = originWidth;
    Context.strokeStyle = originStyle;
    let tmptext = new Text();
    let str = this.body[row][col];
    if(this.body[row][col] == 99999999) str = "∞";
    tmptext.Inite(this.PosX + col * this.cellWidth, this.PosY + (row+0.5) * this.cellHeight+5, valColor, valFont, str);
    tmptext.DrawCenterText(Context, this.cellWidth);
};