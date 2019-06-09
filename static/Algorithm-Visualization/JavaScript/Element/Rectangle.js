/*
Rectangle
    PosX, PosY, Width, Height

    +Inite(PosX, PosY, Width, Height)
    +DrawHollowRectangle(Context, Color, LineWidth)
    +DrawSolidRect(Context, Color, LineWidth, Fillcolor)
*/

function Rectangle() {
    this.PosX = 0;
    this.PosY = 0;
    this.Width = 0;
    this.Height = 0;
}

Rectangle.prototype.Inite = function(PosX, PosY, Width, Height){
    this.PosX = PosX;
    this.PosY = PosY;
    this.Width = Width;
    this.Height = Height;
};

Rectangle.prototype.DrawHollowRectangle = function(Context, Color, LineWidth){
    var originWidth = Context.lineWidth;
    var originStyle = Context.strokeStyle;
    Context.lineWidth = LineWidth;
    Context.strokeStyle = Color;
    Context.strokeRect(this.PosX, this.PosY, this.Width, this.Height);
    Context.lineWidth = originWidth;
    Context.strokeStyle = originStyle;
};

Rectangle.prototype.DrawSolidRect = function (Context, Color, LineWidth, Fillcolor) {
    var originWidth = Context.lineWidth;
    var originStyle = Context.strokeStyle;
    var originFillstyle = Context.fillStyle;
    Context.lineWidth = LineWidth;
    Context.strokeStyle = Color;
    Context.fillStyle = Fillcolor;
    Context.fillRect(this.PosX, this.PosY, this.Width, this.Height);
    Context.strokeRect(this.PosX, this.PosY, this.Width, this.Height);
    Context.lineWidth = originWidth;
    Context.strokeStyle = originStyle;
    Context.fillStyle = originFillstyle;
};