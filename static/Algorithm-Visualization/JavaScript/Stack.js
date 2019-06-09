var SQUAREWIDTH = 50;
var TIMEINTERVAL = 10;
var LINEWIDTH = 2;
var MICROSOFTFONT = "bold 10pt Microsoft JhengHei";
var MAXN = 10;
var topIndex;
var canvasWidth;
var canvasHeight;
var Stack = new Array(MAXN);

function Square() {
    this.Id = 0;
    this.Value = null;
    Rectangle.call(this);
}
Square.prototype = new Rectangle();
Square.prototype.constructor = Square;

function Text() {
    this.PosX = 0;
    this.PosY = 0;
    this.String = null;
}

Text.prototype.Inite = function (PosX, PosY, String) {
    this.PosX = PosX;
    this.PosY = PosY;
    this.String = String;
};

var topText = new Text();

function drawTop(ctx) {
    DrawText(ctx, topText.String, topText.PosX+SQUAREWIDTH/2-ctx.measureText(topText).width/2,
        3*SQUAREWIDTH, "black", MICROSOFTFONT);
    DrawArrow(ctx, topText.PosX + SQUAREWIDTH/2, topText.PosY-SQUAREWIDTH+10,
        topText.PosX+SQUAREWIDTH/2, topText.PosY, "red", 2);
}

function clearTop() {
    
}

function drawStack(ctx){
     for(var i = 1; i < Stack.length; i++){
         Stack[i].DrawHollowRectangle(ctx, "black", LINEWIDTH);
         ctx.fillText(i-1, TextCenter(ctx, i-1, Stack[i].PosX, SQUAREWIDTH), Stack[i].PosY + SQUAREWIDTH + 20);
         if(Stack[i].Value != null){
             ctx.fillText(Stack[i].Value, Stack[i].PosX+SQUAREWIDTH/2 - ctx.measureText(Stack[i].Value).width/2, Stack[i].PosY+SQUAREWIDTH/2+5);
         }
     }
     ctx.beginPath();
     var tmp = new Line();
     tmp.Inite_Point(Stack[MAXN-1].PosX, Stack[MAXN-1].PosY+1, Stack[MAXN-1].PosX, Stack[MAXN-1].PosY+SQUAREWIDTH-1);
     tmp.DrawLine(ctx, "white", 2);
}

function clearStack() {
    
}

function drawAll(ctx) {
    clearAll(ctx);
    drawStack(ctx);
    drawTop(ctx);
}

function clearAll(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function initCanvas() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = LINEWIDTH;
    ctx.font = MICROSOFTFONT;

    for(var i = 0; i < MAXN; i++){
        Stack[i] = new Square();
        Stack[i].Inite((5+9-i)*SQUAREWIDTH, 4*SQUAREWIDTH, SQUAREWIDTH, SQUAREWIDTH);
        Stack[i].Id = i;
    }
    topIndex = Stack[0].Id;
    var tmpString = "TopIndex : " + (topIndex-1).toString();
    topText.Inite(Stack[topIndex].PosX, Stack[topIndex].PosY, "TopIndex : "+(topIndex-1).toString());
    TextMaxLength(document.getElementById("enstack"), 5);
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    drawAll(ctx);
}

Push = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var inputText = document.getElementById("enstack").value;
    if(inputText != ""){
        if(topIndex >= MAXN-1){
            DrawLayerWindow("The Stack is Full ...",
                $("#myCanvas").position().top + SQUAREWIDTH,
                $("#myCanvas").position().left + 7.5*SQUAREWIDTH, 3000, 0, 0, 6);
        }else{
            $("#push").attr("disabled", true);
            $("#pop").attr("disabled", true);
            $("#clear").attr("disabled", true);
            $("#fill").attr("disabled", true);
            topText.String = "TopIndex : ";
            var tmpties = 0;
            var tmpText = new Text();
            var tmpTextValue = new Text();
            var tmpcircle = new Circle();
            var tmpwidth = ctx.measureText(inputText).width;
            tmpText.Inite(SQUAREWIDTH, SQUAREWIDTH, "The Push Value is : ");
            tmpTextValue.Inite(4*SQUAREWIDTH, SQUAREWIDTH, inputText);
            tmpcircle.Inite(4*SQUAREWIDTH+tmpwidth/2, SQUAREWIDTH-5, tmpwidth/2+10);
            var moveArrow = setInterval(function () {
                topText.PosX -= 1;
                tmpties += 1;
                drawAll(ctx);
                if(tmpties == SQUAREWIDTH){
                    clearTimeout(moveArrow);
                    topIndex++;
                    topText.String = "TopIndex : " + (topIndex-1).toString();
                    drawAll(ctx);
                    DrawText(ctx, tmpText.String, tmpText.PosX, tmpText.PosY, "green", MICROSOFTFONT);
                    DrawText(ctx, tmpTextValue.String, tmpTextValue.PosX, tmpTextValue.PosY, "black", MICROSOFTFONT);
                }
            }, TIMEINTERVAL);
            setTimeout(function () {
                tmpcircle.DrawHollowCircle(ctx, "blue", 3);
            }, 80*TIMEINTERVAL);
            setTimeout(function () {
                var endx = Stack[topIndex].PosX + SQUAREWIDTH/2;
                var endy = Stack[topIndex].PosY + SQUAREWIDTH/2;
                //赋值
                var moveValue = setInterval(function () {
                    if(tmpcircle.PosY < endy){
                        tmpcircle.PosY += 5;
                        tmpTextValue.PosY += 5;
                        if(tmpcircle.PosY > endy){
                            tmpTextValue.PosY -= tmpcircle.PosY - endy;
                            tmpcircle.PosY = endy;
                        }
                    }else if(tmpcircle.PosX < endx){
                        tmpcircle.PosX  += 5;
                        tmpTextValue.PosX += 5;
                        if(tmpcircle.PosX > endx){
                            tmpTextValue.PosX -= tmpcircle.PosX - endx;
                            tmpcircle.PosX = endx;
                        }
                    }else{
                        clearTimeout(moveValue);
                        Stack[topIndex].Value = inputText;
                        DrawText(ctx, tmpText.String, tmpText.PosX, tmpText.PosY, "black", MICROSOFTFONT);
                        setTimeout(function () {
                            drawAll(ctx);
                            DrawLayerWindow("Push Success !",
                                ($("#myCanvas").position().top + SQUAREWIDTH).toString()+"px",
                                ($("#myCanvas").position().left + SQUAREWIDTH).toString()+"px",
                                1000, 1, 0, 0
                            );
                            $("#push").attr("disabled", false);
                            $("#pop").attr("disabled", false);
                            $("#clear").attr("disabled", false);
                            $("#fill").attr("disabled", false);
                        }, 50*TIMEINTERVAL);
                    }
                    drawAll(ctx);
                    DrawText(ctx, tmpText.String, tmpText.PosX, tmpText.PosY, "black", MICROSOFTFONT);
                    DrawText(ctx, tmpTextValue.String, tmpTextValue.PosX, tmpTextValue.PosY, "black", MICROSOFTFONT);
                    //tmpTextValue.DrawText(ctx, "black", MICROSOFTFONT);
                    tmpcircle.DrawHollowCircle(ctx, "blue", 3);
                },TIMEINTERVAL);
            }, 100*TIMEINTERVAL);
        }
    }else{
        DrawLayerWindow("Please Input ...",
            $("#myCanvas").position().top + SQUAREWIDTH,
            $("#myCanvas").position().left + 7.5*SQUAREWIDTH, 1500, 0, 0, 6);
    }
};

Pop = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    if(topIndex == 0){
        DrawLayerWindow("The Stack is Empty ...",
            $("#myCanvas").position().top + SQUAREWIDTH,
            $("#myCanvas").position().left + 7.5*SQUAREWIDTH, 3000, 0, 0, 6);
    }else{
        $("#push").attr("disabled", true);
        $("#pop").attr("disabled", true);
        $("#clear").attr("disabled", true);
        $("#fill").attr("disabled", true);
        topText.String = "TopIndex : ";
        var inputText = Stack[topIndex].Value;
        var tmpties = 0;
        var tmpText = new Text();;
        var tmpcircle = new Circle();
        var tmpwidth = ctx.measureText(inputText).width;
        tmpText.Inite(SQUAREWIDTH, 7*SQUAREWIDTH, "The Pop Value is : ");
        var tmpTextValue = new Text()
        tmpTextValue.Inite(Stack[topIndex].PosX+SQUAREWIDTH/2-tmpwidth/2, Stack[topIndex].PosY+SQUAREWIDTH/2+5, inputText);
        tmpcircle.Inite(Stack[topIndex].PosX+SQUAREWIDTH/2, Stack[topIndex].PosY+SQUAREWIDTH/2, tmpwidth/2+10);
        //tmpcircle.Inite(4*SQUAREWIDTH+tmpwidth/2, 7*SQUAREWIDTH-5, tmpwidth/2+10);

        var endx = 4*SQUAREWIDTH+tmpwidth/2;
        var endy = 7*SQUAREWIDTH-5;
        Stack[topIndex].Value = null;
        //赋值
        var moveValue = setInterval(function () {
            if(tmpcircle.PosX > endx){
                tmpcircle.PosX -= 5;
                tmpTextValue.PosX -= 5;
                if(tmpcircle.PosX < endx){
                    tmpTextValue.PosX += endx - tmpcircle.PosX;
                    tmpcircle.PosX = endx;
                }
            }else if(tmpcircle.PosY < endy){
                tmpcircle.PosY += 5;
                tmpTextValue.PosY += 5;
                if(tmpcircle.PosY > endy){
                    tmpTextValue.PosY -= tmpcircle.PosY - endy;
                    tmpcircle.PosY = endy;
                }
            }else{
                clearTimeout(moveValue);
                DrawText(ctx, tmpText.String, tmpText.PosX, tmpText.PosY, "black", MICROSOFTFONT);
                setTimeout(function () {
                    var moveArrow = setInterval(function () {
                        topText.PosX += 1;
                        tmpties += 1;
                        drawAll(ctx);
                        DrawText(ctx, tmpText.String, tmpText.PosX, tmpText.PosY, "black", MICROSOFTFONT);
                        DrawText(ctx, tmpTextValue.String, tmpTextValue.PosX, tmpTextValue.PosY, "black", MICROSOFTFONT);
                        if(tmpties == SQUAREWIDTH){
                            clearTimeout(moveArrow);
                            Stack[topIndex].Value = null;
                            topIndex--;
                            topText.String = "TopIndex : " + (topIndex-1).toString();
                            drawAll(ctx);
                            DrawText(ctx, tmpText.String, tmpText.PosX, tmpText.PosY, "black", MICROSOFTFONT);
                            DrawText(ctx, tmpTextValue.String, tmpTextValue.PosX, tmpTextValue.PosY, "black", MICROSOFTFONT);

                            drawAll(ctx);
                            DrawLayerWindow("Pop Success !",
                                ($("#myCanvas").position().top + 7*SQUAREWIDTH).toString()+"px",
                                ($("#myCanvas").position().left + SQUAREWIDTH).toString()+"px",
                                1000, 1, 0, 0
                            );
                            $("#push").attr("disabled", false);
                            $("#pop").attr("disabled", false);
                            $("#clear").attr("disabled", false);
                            $("#fill").attr("disabled", false);
                        }
                    }, TIMEINTERVAL);
                }, 50*TIMEINTERVAL);
            }
            drawAll(ctx);
            DrawText(ctx, tmpText.String, tmpText.PosX, tmpText.PosY, "black", MICROSOFTFONT);
            //console.log(tmpTextValue);
            DrawText(ctx, tmpTextValue.String, tmpTextValue.PosX, tmpTextValue.PosY, "black", MICROSOFTFONT);
            tmpcircle.DrawHollowCircle(ctx, "blue", 3);
        },TIMEINTERVAL);
        //tmpcircle.DrawHollowCircle(ctx, "blue", 3);
    }
};

Clear = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    for(var i = 0; i < MAXN; i++){
        Stack[i].Value = null;
    }
    topIndex = Stack[0].Id;
    var tmpString = "TopIndex : " + (topIndex-1).toString();
    topText.Inite(Stack[topIndex].PosX, Stack[topIndex].PosY, "TopIndex : "+(topIndex-1).toString());
    drawAll(ctx);
};

Fill = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var inputText = document.getElementById("enstack").value;
    if(inputText != ""){
        for(var i = 0; i < MAXN; i++){
            Stack[i].Value = inputText;
        }
        topIndex = Stack[MAXN-1].Id;
        var tmpString = "TopIndex : " + (topIndex-1).toString();
        topText.Inite(Stack[topIndex].PosX, Stack[topIndex].PosY, "TopIndex : "+(topIndex-1).toString());
        drawAll(ctx);
    }
};