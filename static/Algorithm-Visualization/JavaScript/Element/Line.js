/*
Line
    StartX, StartY, EndX, EndY, Length, Theta

    +Inite_Point(StartX, StartY, EndX, EndY)
    +Inite_Theta(StartX, StartY, Theta, Length)
    +DrawLine(Context, Color, LineWidth)
*/

function Line() {
    this.StartX = 0;
    this.StartY = 0;
    this.EndX = 0;
    this.EndY = 0;
    this.Length = 0;
    this.Theta = 0;
}

Line.prototype.Inite_Point = function(StartX, StartY, EndX, EndY){
    this.StartX = StartX;
    this.StartY = StartY;
    this.EndX = EndX;
    this.EndY = EndY;
    this.Length = Math.sqrt(Math.pow(StartX-EndX, 2)+Math.pow(StartY - EndY, 2));
    //逆时针方向与x轴的夹角
    this.Theta = (180/Math.PI)*Math.atan2((StartY - EndY), (StartX - EndX));
};

Line.prototype.Inite_Theta = function (StartX, StartY, Theta, Length) {
    this.StartX = StartX;
    this.StartY = StartY;
    this.Theta = Theta;
    this.Length = Length;
    this.EndX = StartX + Length*Math.cos(Theta);
    this.EndY = StartY + Length*Math.sin(Theta);
};

Line.prototype.DrawLine = function(Context, Color, LineWidth){
    var originWidth = Context.lineWidth;
    var originStyle = Context.strokeStyle;
    Context.lineWidth = LineWidth;
    Context.strokeStyle = Color;
    Context.beginPath();
    Context.moveTo(this.StartX, this.StartY);
    Context.lineTo(this.EndX, this.EndY);
    Context.stroke();
    Context.closePath();
    Context.lineWidth = originWidth;
    Context.strokeStyle = originStyle;
};