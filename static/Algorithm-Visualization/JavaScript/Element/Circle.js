/*
Circle
    PosX, PosY, Radius

    +Inite(PosX, PosY, Radius)
    +DrawHollowCircle(Context, Color, LineWidth)
    +DrawSolidCircle(Context, Color, LineWidth, Fillcolor)
*/


function Circle() {
    this.PosX = 0;
    this.PosY = 0;
    this.Radius = 0;
}

Circle.prototype.Inite = function (PosX, PosY, Radius) {
    this.PosX = PosX;
    this.PosY = PosY;
    this.Radius = Radius;
};

Circle.prototype.DrawHollowCircle = function(Context, Color, LineWidth){
    var originWidth = Context.lineWidth;
    var originStyle = Context.strokeStyle;
    Context.lineWidth = LineWidth;
    Context.strokeStyle = Color;
    Context.beginPath();
    Context.arc(this.PosX, this.PosY, this.Radius, 0, 2*Math.PI, true);
    Context.stroke();
    Context.closePath();
    Context.lineWidth = originWidth;
    Context.strokeStyle = originStyle;
};

Circle.prototype.DrawSolidCircle = function (Context, Color, LineWidth, Fillcolor) {
    var originWidth = Context.lineWidth;
    var originStyle = Context.strokeStyle;
    var originFillstyle = Context.fillStyle;
    Context.lineWidth = LineWidth;
    Context.strokeStyle = Color;
    Context.fillStyle = Fillcolor;
    Context.beginPath();
    Context.arc(this.PosX, this.PosY, this.Radius, 0, 2*Math.PI, true);
    Context.fill();
    Context.stroke();
    Context.closePath();
    Context.lineWidth = originWidth;
    Context.strokeStyle = originStyle;
    Context.fillStyle = originFillstyle;
};