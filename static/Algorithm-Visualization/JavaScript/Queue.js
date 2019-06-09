var SQUAREWIDTH = 50;
var PADDINGWIDTH = 50;
var HEADHEIGHT = 100;
var TAILHEIGHT = 100;
var QUEUEHEIGHT =250;
var LINEWIDTH = 2;
var HEADSTRING = "Head";
var TailSTRING = "Tail";
var QueueFull = "The Queue is Full ...";
var QueueEmpty = "The Queue is Empty ...";
var MICROSOFTFONT = "bold 10pt Microsoft JhengHei";
var MAXN = 15;
var Queue = new Array(MAXN);
var tailPoint = 0;
var headPoint = 0;
var canvasWidth;
var canvasHeight;

function Square() {
    this.EageLength = SQUAREWIDTH;
    this.PosX = 0;
    this.PosY = 0;
    this.Value = null;
}

Square.prototype.Inite = function (x, y, w) {
    this.EageLength = w;
    this.PosX = x;
    this.PosY = y;
    this.Value = null;
    //return this;
};

var Head = new Square();
Head.Inite(4 * SQUAREWIDTH, HEADHEIGHT, SQUAREWIDTH);
var Tail = new Square();
Tail.Inite(4 * SQUAREWIDTH + 2 * SQUAREWIDTH, TAILHEIGHT, SQUAREWIDTH);

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

//Clear the section of Empty / Full
function clearEmptyFull(ctx) {
    ctx.clearRect(0, 0, canvasWidth, 2*SQUAREWIDTH-10);
}


function clearHeadTail(ctx) {
    ctx.clearRect(0, 2*SQUAREWIDTH, canvasWidth, 2*SQUAREWIDTH-10);
}

function clearQueue(ctx) {
    ctx.clearRect(0, 5*SQUAREWIDTH, canvasWidth, 2*SQUAREWIDTH-10);
}

//Draw Head Point
function drawHead(ctx){
    ctx.strokeRect(Head.PosX, Head.PosY, Head.EageLength, Head.EageLength);
    ctx.fillText(HEADSTRING, Head.PosX + SQUAREWIDTH / 2 - (ctx.measureText(HEADSTRING).width) / 2, Head.PosY + SQUAREWIDTH + 20);
    ctx.fillText(headPoint, Head.PosX + SQUAREWIDTH / 2 - (ctx.measureText(headPoint).width) / 2, Head.PosY + SQUAREWIDTH / 2 + 5);
}

//Draw Tail Point
function drawTail(ctx) {
    ctx.strokeRect(Tail.PosX, Tail.PosY, Tail.EageLength, Tail.EageLength);
    ctx.fillText(TailSTRING, Tail.PosX + SQUAREWIDTH / 2 - (ctx.measureText(TailSTRING).width) / 2, Tail.PosY + SQUAREWIDTH + 20);
    ctx.fillText(tailPoint, Tail.PosX + SQUAREWIDTH / 2 - (ctx.measureText(headPoint).width) / 2, Tail.PosY + SQUAREWIDTH / 2 + 5);
}

//Draw Queue Array
function drawQueue(ctx) {
    clearQueue(ctx);
    for (var i = 0; i < MAXN; i++) {
        ctx.strokeRect(Queue[i].PosX, Queue[i].PosY, Queue[i].EageLength, Queue[i].EageLength);
        ctx.fillText(i, Queue[i].PosX + 15, Queue[i].PosY + SQUAREWIDTH + 20);
    }
    for (var i = 0; i < MAXN; i++) {
        if(Queue[i].Value != null && Queue[i].Value != ""){
            console.log(Queue[i], Queue[i].PosX + SQUAREWIDTH/2, Queue[i].PosY + 20);
            ctx.fillText(Queue[i].Value, Queue[i].PosX + SQUAREWIDTH/2 - (ctx.measureText(Queue[i].Value).width)/2, Queue[i].PosY + 30);
            //ctx.fillText(Queue[i].Value, i*SQUAREWIDTH, SQUAREWIDTH);
        }
    }
}


function drawEmptyLayer() {
    DrawLayerWindow(QueueEmpty,
        ($("#myCanvas").position().top + 100).toString()+"px",
        ($("#myCanvas").position().left + 500).toString()+"px",
        1500, 0, 0, 6
    );
}

function drawFullLayer() {
    DrawLayerWindow(QueueFull,
        ($("#myCanvas").position().top + 100).toString()+"px",
        ($("#myCanvas").position().left + 500).toString()+"px",
        1500, 0, 0, 6
    );
    // layui.use(['layer', 'form'], function(){
    //      var layer = layui.layer
    //          ,form = layui.form;
    //
    //      layer.config({
    //          extend: '../CSS/LayerStyle.css'
    //      });
    //
    //      layer.msg('The Queue is Full !', {
    //         offset:['120px', '500px'],
    //         time: 1500,
    //         icon: 0,
    //         type: 0,
    //         anim: 6
    //      });
    // });
}

function drawPushLayer() {
    DrawLayerWindow("Push Success !",
        ($("#myCanvas").position().top + 100).toString()+"px",
        ($("#myCanvas").position().left + 500).toString()+"px",
        1500, 1, 0, 0
    );
}

function drawPopLayer() {
    DrawLayerWindow("Pop Success !",
        ($("#myCanvas").position().top + 100).toString()+"px",
        ($("#myCanvas").position().left + 500).toString()+"px",
        1500, 1, 0, 0
    );
}

function drawAll(ctx){
    clearCanvas(ctx);
    drawQueue(ctx);
    drawHead(ctx);
    drawTail(ctx);
}

function initCanvas() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = LINEWIDTH;
    ctx.font = MICROSOFTFONT;

    for(var i = 0; i < MAXN; i++){
        Queue[i] = new Square();
        Queue[i].Inite(PADDINGWIDTH + i * SQUAREWIDTH, QUEUEHEIGHT, SQUAREWIDTH);
        console.log(Queue[i]);
    }
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    drawAll(ctx);
    TextMaxLength(document.getElementById("enque"), 5);
}

Push = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var inputText = document.getElementById("enque").value;
    if(inputText != ""){
        if((tailPoint + 1)%MAXN == headPoint){
            clearEmptyFull(ctx);
            drawFullLayer(ctx);
        } else{


            var TimeControl = [2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2];
            var i = 0;
            //
            var interval = setInterval(function () {
                $("#push").attr("disabled", true);
                $("#pop").attr("disabled", true);
                $("#clear").attr("disabled", true);
                $("#fill").attr("disabled", true);
                drawAll(ctx);
                ctx.fillText("Push Value is :  ", SQUAREWIDTH, SQUAREWIDTH, 2*SQUAREWIDTH);
                ctx.fillText(inputText, 3*SQUAREWIDTH, SQUAREWIDTH);
                DrawStressRect(ctx, Tail.PosX, Tail.PosY, SQUAREWIDTH, SQUAREWIDTH,
                    TimeControl[i], "red");
                DrawStressRect(ctx, Queue[tailPoint].PosX, Queue[tailPoint].PosY,
                    SQUAREWIDTH, SQUAREWIDTH, TimeControl[i++], "red");

                if(i == TimeControl.length){
                    clearTimeout(interval);
                    //DrawArrow(ctx, Tail.PosX+SQUAREWIDTH/2, Tail.PosY+SQUAREWIDTH,
                    //    Queue[tailPoint].PosX+SQUAREWIDTH/2, Queue[tailPoint].PosY, "blue", 2);

                    var Tmp = tailPoint;
                    setTimeout(function () {
                        var Length = ctx.measureText(inputText).width;

                        DrawArrow(ctx, 3*SQUAREWIDTH + Length/2, SQUAREWIDTH + 10,
                            Queue[Tmp].PosX+SQUAREWIDTH/2, Queue[Tmp].PosY+SQUAREWIDTH/2, "blue", 2)
                    }, 200);
                    Queue[tailPoint].Value = inputText;
                    tailPoint = (tailPoint + 1) % MAXN;
                    setTimeout(function () {
                        drawAll(ctx);
                        ctx.fillText("Push Value is :  ", SQUAREWIDTH, SQUAREWIDTH, 2*SQUAREWIDTH);
                        drawPushLayer();
                    }, 1200);
                    setTimeout(function () {
                        drawAll(ctx);
                        $("#push").attr("disabled", false);
                        $("#pop").attr("disabled", false);
                        $("#clear").attr("disabled", false);
                        $("#fill").attr("disabled", false);
                    }, 2000);
                }}, 80
            );
        }
    }else{
        DrawLayerWindow("Please Input ...",
            ($("#myCanvas").position().top + 100).toString()+"px",
            ($("#myCanvas").position().left + 500).toString()+"px",
            1500, 0, 0, 6
        );
    }
};

Pop = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    if(tailPoint == headPoint){
        clearEmptyFull(ctx);
        drawEmptyLayer(ctx);
    } else{
        var TimeControl = [2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2];
        var i = 0;
        var interval = setInterval(function () {
            $("#push").attr("disabled", true);
            $("#pop").attr("disabled", true);
            $("#clear").attr("disabled", true);
            $("#fill").attr("disabled", true);
            drawAll(ctx);
            DrawStressRect(ctx, Head.PosX, Head.PosY, SQUAREWIDTH, SQUAREWIDTH,
                TimeControl[i], "red");
            DrawStressRect(ctx, Queue[headPoint].PosX, Queue[headPoint].PosY,
                SQUAREWIDTH, SQUAREWIDTH, TimeControl[i++], "red");

            if(i == TimeControl.length){
                clearTimeout(interval);
                ctx.fillText("Pop Value is :  ", SQUAREWIDTH, SQUAREWIDTH, 2*SQUAREWIDTH);

                var Tmp = headPoint;
                setTimeout(function () {
                    var Length = ctx.measureText(Queue[headPoint].Value).width;
                    DrawArrow(ctx, Queue[Tmp].PosX+SQUAREWIDTH/2, Queue[Tmp].PosY+SQUAREWIDTH/2,
                        3*SQUAREWIDTH + Length/2, SQUAREWIDTH + 10, "purple", 2)
                }, 200);

                setTimeout(function () {
                    var text = Queue[headPoint].Value;
                    Queue[headPoint].Value = null;
                    headPoint = (headPoint + 1) % MAXN;
                    drawAll(ctx);
                    ctx.fillText("Pop Value is :  ", SQUAREWIDTH, SQUAREWIDTH, 2*SQUAREWIDTH);
                    ctx.fillText(text, 3*SQUAREWIDTH, SQUAREWIDTH);
                    drawPushLayer();
                }, 1200);

                setTimeout(function () {
                    drawAll(ctx);
                    $("#push").attr("disabled", false);
                    $("#pop").attr("disabled", false);
                    $("#clear").attr("disabled", false);
                    $("#fill").attr("disabled", false);
                }, 2000);
            }}, 80
        );

        // Queue[headPoint].Value = null;
        // headPoint = (headPoint + 1) % MAXN;
        // drawAll(ctx);
        // drawPopLayer();
    }
};

Clear = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    for(var i = 0; i < MAXN; i++){
        Queue[i].Value = null;
    }
    headPoint = tailPoint = 0;
    drawAll(ctx);
};

Fill = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    clearCanvas(ctx);
    var inputText = document.getElementById("enque").value;
    if(inputText != ""){
        while((tailPoint + 1)%MAXN != headPoint){
            Queue[tailPoint].Value = inputText;
            tailPoint = (tailPoint + 1)%MAXN;
            console.log("671");
        }
        drawAll(ctx);
    }
};