/*
TextCenter(x, y, h, w, context)

TextMaxLength(Id, Number)

DrawLayerWindow(String, PosX, PosY, Time, Icon, Type, Anim)

DrawStressRect(Context, PosX, PosY, Width, Heigth, BorderWidth, Color)

DrawStressCircle(Context, PosX, PosY, Radius, BorderWidth)

SleepTime(Time)

DrawArrow(Context,PosX1,PosY1,PosX2,PosY2, Color, LineWidth)
*/



//Center the context
var TextCenter = function (Context, String, PosX, Width) {
    return (PosX + Width/2 - (Context.measureText(String).width)/2);
};

//Limit the length of input text
function TextMaxLength(Id, Number) {
    $(Id).bind("input propertychange", function () {
        var a = $(Id).val();
        //Select Character of Number In Sequence
        if(a.length > Number){
            $(Id).val($(Id).val().substr(0, Number));
        }
    });
}

//
function DrawLayerWindow(String, PosX, PosY, Time, Icon, Type, Anim) {
    layui.use(['layer', 'form'], function(){
        var layer = layui.layer
            ,form = layui.form;
        layer.msg(String, {
            offset:[PosX, PosY],
            time: Time,
            icon: Icon,
            type: Type,
            anim: Anim
        });
    });
}

//Stress The Rectangle
function DrawStressRect(Context, PosX, PosY, Width, Heigth, BorderWidth, Color){
    var currentWidth = Context.lineWidth;
    var currentStyle = Context.strokeStyle;
    Context.lineWidth = BorderWidth;
    Context.strokeStyle = Color;
    Context.strokeRect(PosX, PosY, Width, Heigth);
    Context.lineWidth = currentWidth;
    Context.strokeStyle = currentStyle;
}

//
function DrawStressCircle(Context, PosX, PosY, Radius, BorderWidth) {
    var currentWidth = Context.lineWidth;
    var currentStyle = Context.strokeStyle;
    Context.lineWidth = BorderWidth;
    Context.strokeStyle = Color;
    Context.strokeRect(PosX, PosY, Width, Heigth);
    Context.lineWidth = currentWidth;
    Context.strokeStyle = currentStyle;
}

function SleepTime(Time) {
    var start = new Date().getTime();
    while (true) if (new Date().getTime() - start > Time) break;
}

function DrawArrow(Context,PosX1,PosY1,PosX2,PosY2, Color, LineWidth)
{
    var sta = new Array(PosX1,PosY1);
    var end = new Array(PosX2,PosY2);
    var curColor = Context.strokeStyle, curLWidth = Context.lineWidth, curFStyle = Context.fillStyle;
    Context.lineWidth = LineWidth;
    Context.strokeStyle = Color;
    //画线
    Context.beginPath();
    Context.translate(0,0,0); //坐标源点
    Context.moveTo(sta[0],sta[1]);
    Context.lineTo(end[0],end[1]);
    Context.fill();
    Context.stroke();
    Context.save();

    //画箭头
    Context.translate(end[0],end[1]);
    //我的箭头本垂直向下，算出直线偏离Y的角，然后旋转 ,rotate是顺时针旋转的，所以加个负号
    var ang=(end[0]-sta[0])/(end[1]-sta[1]);
    ang=Math.atan(ang);
    if(end[1]-sta[1] >= 0){
        Context.rotate(-ang);
    }else{
        Context.rotate(Math.PI-ang);//加个180度，反过来
    }
    Context.fillStyle = Color;
    Context.lineTo(-5,-10);
    Context.lineTo(0,-5);
    Context.lineTo(5,-10);
    Context.lineTo(0,0);
    Context.fill(); //箭头是个封闭图形
    Context.restore();   //恢复到堆的上一个状态
    Context.closePath();

    Context.strokeStyle = curColor;
    Context.lineWidth = curLWidth;
    Context.fillStyle = curFStyle
}

function DrawText(Context, String, PosX, PosY, Color, Font) {
    var originFont = Context.font;
    var originColor = Context.strokeStyle;
    Context.font = Font;
    Context.strokeStyle = Color;
    Context.fillText(String, PosX, PosY);
    Context.font = originFont;
    Context.strokeStyle = originColor;
}