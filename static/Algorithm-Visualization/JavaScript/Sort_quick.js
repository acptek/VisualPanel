var BASEWIDTH = 50;
var MAXN = 11;
var TIMEINTERVAL = 10;
var LINEWIDTH = 2;
var MICROSOFTFONT = "bold 10pt Microsoft JhengHei";
var canvasWidth;
var canvasHeight;
var Arr = new Array(MAXN);
var QSCode = new Code();
var iIndex;
var jIndex;

function Number() {
    this.Id = 0;
    this.Value = null;
    Rectangle.call(this);
}

Number.prototype = new Rectangle();
Number.prototype.constructor = Number;

Number.prototype.FillColor = function (ctx, color) {
    var originFillcolor = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = originFillcolor;
};

///////////////////////////////////Draw/////////////////////////////////////

function drawArray(ctx) {
    for(let i = 0; i < MAXN; i++){
        ctx.fillText(i, (0.2+i)*BASEWIDTH+20, 4.5*BASEWIDTH-10);
    }

    for(let i = 0; i < MAXN; i++){
        Arr[i].DrawSolidRect(ctx, "blue", 2, "blue");
        ctx.fillText(Arr[i].Value, Arr[i].PosX + Arr[i].Width/2 - (Arr[i].Value/10+1)*3, Arr[i].PosY + Arr[i].Height + 15);
    }
}

function clearAll(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawAll(ctx){
    clearAll(ctx);
    drawArray(ctx);
    drawIndex(ctx);
    QSCode.DrawCode(ctx, "black", 2);
}

const drawFinish = (String)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            DrawLayerWindow(String,
                $("#myCanvas").position().top + BASEWIDTH,
                $("#myCanvas").position().left + BASEWIDTH, 1500, 1, 0, 0);
            resolve(String);
        }, 10*TIMEINTERVAL);
    })
};

const stressBeforeSort = (ctx, i, j) =>{
    return new Promise((resolve, reject)=>{
        Arr[i].DrawHollowRectangle(ctx, "yellow", 3);
        Arr[j].DrawHollowRectangle(ctx, "yellow", 3);
        setTimeout(()=>{
            drawAll(ctx);
            resolve("Success");
        }, 100*TIMEINTERVAL);
    });
};

const swap = async (ctx, i, j, midIndex, left, right) => {
    return new Promise((resolve, reject) => {
        const ied = Arr[j].PosX;
        const jed = Arr[i].PosX;
        let move = setInterval(()=>{
            if(Arr[i].PosX < ied){
                Arr[i].PosX += 5;
                Arr[j].PosX -= 5;
            }else{
                Arr[i].PosX -= Arr[i].PosX - ied;
                Arr[j].PosX += jed - Arr[j].PosX;
                clearTimeout(move);
                let tmp = Arr[j];
                Arr[j] = Arr[i];
                Arr[i] = tmp;
                drawAll(ctx);
                drawBaseLine(ctx, midIndex);
                if($("#display").val() == "Hide Range"){
                    sortRange(ctx, left, right);
                }
                QSCode.StressLine(ctx, "red", 5, 10);
                resolve("swap");
            }
            drawAll(ctx);
            drawBaseLine(ctx, midIndex);
            if($("#display").val() == "Hide Range"){
                sortRange(ctx, left, right);
            }
            QSCode.StressLine(ctx, "red", 5, 10);
        },2*TIMEINTERVAL);
    })
};

const drawBaseLine = (ctx, mid) => {
    let baseline = new Line();
    baseline.Inite_Point(10, Arr[mid].PosY+Arr[mid].Value*(3*BASEWIDTH/MAXN),
        MAXN*BASEWIDTH+10, Arr[mid].PosY+Arr[mid].Value*(3*BASEWIDTH/MAXN));
    baseline.DrawLine(ctx, "red", 3);
    ctx.fillStyle = "red";
    ctx.fillText("Base Value = "+Arr[mid].Value.toString(), (0.3+mid)*BASEWIDTH-20, 3*BASEWIDTH-10);
    ctx.fillStyle = "black";
    DrawArrow(ctx, (mid+0.3)*BASEWIDTH+20,3*BASEWIDTH,
        (0.3+mid)*BASEWIDTH+20, 4*BASEWIDTH, "orange", 2);
};

const drawIndex = (ctx) => {
    ctx.fillText("i", (0.3+iIndex)*BASEWIDTH + 20 - 2, 3.5*BASEWIDTH-10);
    DrawArrow(ctx, (iIndex+0.3)*BASEWIDTH+20,3.5*BASEWIDTH,
        (0.3+iIndex)*BASEWIDTH+20, 4*BASEWIDTH, "red", 2);
    ctx.fillText("j", (0.3+jIndex)*BASEWIDTH + 20 - 2, 3.5*BASEWIDTH-10);
    DrawArrow(ctx, (jIndex+0.3)*BASEWIDTH+20,3.5*BASEWIDTH,
        (0.3+jIndex)*BASEWIDTH+20, 4*BASEWIDTH, "red", 2);
};

moveiIndex = function(ctx, mid, left, right, flag){
    return new Promise((resolve, reject)=>{
        let ed = iIndex + 1;
        let movei = setInterval(()=>{
            if(iIndex < ed){
                iIndex += 0.05;
                drawAll(ctx);
                drawBaseLine(ctx, mid);
                if($("#display").val() == "Hide Range"){
                    sortRange(ctx, left, right);
                }
                if(flag) QSCode.StressLine(ctx, "red", 5, 11);
                else QSCode.StressLine(ctx, "red", 5, 6);
            }else{
                clearTimeout(movei);
                iIndex -= (iIndex-ed);
                drawAll(ctx);
                drawBaseLine(ctx, mid);
                if($("#display").val() == "Hide Range"){
                    sortRange(ctx, left, right);
                }
                if(flag) QSCode.StressLine(ctx, "red", 5, 11);
                else QSCode.StressLine(ctx, "red", 5, 6);
                resolve("i++");
            }
        }, 2*TIMEINTERVAL);
    })
};

//has change j
movejIndex = function(ctx, mid, left, right, flag){
    return new Promise((resolve, reject)=>{
        let ed = jIndex - 1;
        let movej = setInterval(()=>{
            if(jIndex > ed){
                jIndex -= 0.05;
                drawAll(ctx);
                drawBaseLine(ctx, mid);
                if($("#display").val() == "Hide Range"){
                    sortRange(ctx, left, right);
                }
                if(flag) QSCode.StressLine(ctx, "red", 5, 11);
                else QSCode.StressLine(ctx, "red", 5, 7);
            }else{
                clearTimeout(movej);
                jIndex += (ed - jIndex);
                drawAll(ctx);
                drawBaseLine(ctx, mid);
                if($("#display").val() == "Hide Range"){
                    sortRange(ctx, left, right);
                }
                if(flag) QSCode.StressLine(ctx, "red", 5, 11);
                else QSCode.StressLine(ctx, "red", 5, 7);
                resolve("j++");
            }
        }, 2*TIMEINTERVAL);
    })
};

const sortRange = (ctx, left, right) => {
    let tmp = new Rectangle();
    if(right < 0) right = 0;
    if(left >= MAXN) left = MAXN-1;
    if(right >= MAXN) right = MAXN-1;
    if(left < 0) left = 0;
    let width = (right-left)*BASEWIDTH + BASEWIDTH;
    width = Math.max(width, 0);
    tmp.Inite(BASEWIDTH*left + 10, Arr[left].PosY - 2.1*BASEWIDTH, width + 20, 6*BASEWIDTH);
    tmp.DrawHollowRectangle(ctx, "green", 3);
};
///////////////////////////////////Control/////////////////////////////////////

function randomArrayText( len ){
    len = len || MAXN;
    var arr = [];
    for(var i=1; i<=len;i++){
        arr.push( i );
    }
    arr.sort(function(){
        return Math.random() - 0.5;
    });
    return arr;
}

function changeSpeed() {
    var value = $('#range_speed').val();
    var valStr = value + "% 100%";
    $('#value1').html((value / 10).toFixed(1));
    $('#range_speed').css({
        "background-size": valStr
    });
    $("input[name='animat_speed']").val((value / 10).toFixed(1));
    TIMEINTERVAL = 20 - 10*value/50;
}

///////////////////////////////////Sort Generator/////////////////////////////////////

var Sort_g;

quick_sort = function * (ctx, left, right){
    iIndex = left;
    jIndex = right;
    console.log(left, right);
    let midIndex = (iIndex + jIndex) >> 1;
    drawAll(ctx);
    drawBaseLine(ctx, midIndex);
    if($("#display").val() == "Hide Range"){
        sortRange(ctx, left, right);
    }
    while (iIndex < jIndex)
    {
        while (Arr[iIndex].Value < Arr[midIndex].Value){
            console.log("1", iIndex);
            yield moveiIndex(ctx);
            console.log("1-1", iIndex);
        }
        while (Arr[jIndex].Value > Arr[midIndex].Value){
            console.log("2", jIndex);
            yield movejIndex(ctx);
            console.log("2-2", jIndex);
        }
        if (iIndex <= jIndex)
        {
            yield swap(ctx, iIndex, jIndex);
            yield moveiIndex(ctx);
            yield movejIndex(ctx);
            //i++; j--;
        }
    }
    if (left < jIndex)	quick_sort(ctx, left, jIndex);
    if (right > iIndex)	quick_sort(ctx, iIndex, right);
};

Stress14 = (ctx) => {
    return new Promise((resolve, reject)=>{
        QSCode.StressLine(ctx, "blue", 5, 14);
        setTimeout(()=>{
            resolve("stress14");
        },50*TIMEINTERVAL);
    })
};

Stress15 = (ctx) => {
    return new Promise((resolve, reject)=>{
        QSCode.StressLine(ctx, "blue", 5, 15);
        setTimeout(()=>{
            resolve("stress15");
        },50*TIMEINTERVAL);
    })
};

quick_sort1 = async (ctx, left, right)=>{
    return new Promise(async (resolve, reject) => {
        iIndex = left;
        jIndex = right;
        let midIndex = parseInt((iIndex + jIndex) >> 1);
        let mid = Arr[midIndex].Value;
        console.log('--->',left, right, midIndex);
        console.log(Arr);
        drawAll(ctx);
        drawBaseLine(ctx, midIndex);
        if($("#display").val() == "Hide Range"){
            sortRange(ctx, left, right);
        }
        while (iIndex < jIndex) {
            while (Arr[iIndex].Value < mid) await moveiIndex(ctx, midIndex, left, right, 0);
            while (Arr[jIndex].Value > mid) await movejIndex(ctx, midIndex, left, right, 0);

            if (iIndex <= jIndex) {
                await swap(ctx, iIndex, jIndex, midIndex, left, right);
                await moveiIndex(ctx, midIndex, left, right, 1);
                await movejIndex(ctx, midIndex, left, right, 1);
                //i++; j--;
            }
        }
        if (left < jIndex){
            await Stress14(ctx);
            await quick_sort1(ctx, left, jIndex);
        }
        if (right > iIndex){
            await Stress15(ctx);
            await quick_sort1(ctx, iIndex, right);
        }
        resolve("Success");
    });
};

///////////////////////////////////Click Event/////////////////////////////////////

initCanvas = function(){

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    iIndex = 0;
    jIndex = MAXN-1;

    ctx.lineWidth = LINEWIDTH;
    ctx.font = MICROSOFTFONT;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    var tmp = randomArrayText(MAXN);

    for(var i = 0; i < MAXN; i++){
        console.log(tmp[i]);
        Arr[i] = new Number();
        Arr[i].Value = tmp[i];
        Arr[i].Inite(i*BASEWIDTH+20, 4.5*BASEWIDTH, BASEWIDTH/1.5, tmp[i]*(3*BASEWIDTH/MAXN));
        Arr[i].Id = i;
    }

    let code_qs = "void quick_sort(int left, int right)\n" +
        "{\n" +
        "\tint i = left, j = right;\n" +
        "\tint mid = a[(i + j) >> 1];\n" +
        "\twhile (i < j)\n" +
        "\t{\n" +
        "\t\twhile (a[i] < mid)\ti++;\n" +
        "\t\twhile (a[j] > mid)\tj--;\n" +
        "\t\tif (i <= j)\n" +
        "\t\t{\n" +
        "\t\t\tswap(a[i], a[j]);\n" +
        "\t\t\ti++; j--;\n" +
        "\t\t}\n" +
        "\t}\n" +
        "\tif (left < j)\tquick_sort(left, j);\n" +
        "\tif (right > i)\tquick_sort(i, right);\n" +
        "}\n";
    QSCode.Inite(BASEWIDTH*(MAXN+1), BASEWIDTH, code_qs, "Quick Sort", BASEWIDTH/2);
    QSCode.ProcessCode();
    console.log(QSCode.Line);
    drawAll(ctx);
};

SortRun = async (Sort_gen, String)=>{
    $("#start_pause").val("Pause");
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    function run(Sort_gen){
        Sort_g = Sort_gen(ctx, iIndex, jIndex);
        function next(data){
            var result = Sort_g.next(data);
            if (result.done){
                drawFinish(String);
                $("#start_pause").val("Start");
                return result.value;
            }
            if ($("#start_pause").val() == "Start"){
                return result.value;
            }
            result.value.then(function(data){
                next(data);
            });
        }
        next();
    }
    run(Sort_gen);
};

Finish = (ctx) => {
    return new Promise((resolve, reject)=>{
        DrawLayerWindow("Quick Sort Finish !",
            $("#myCanvas").position().top + BASEWIDTH,
            $("#myCanvas").position().left + BASEWIDTH, 2000, 1, 0, 0);
        resolve(String);
        setTimeout(()=>{
            drawAll(ctx);
            $("#random").attr("disabled", false);
            $("#start_pause").attr("disabled", false);
            resolve("Finish");
        }, 1000);
    });
};

Start_Pause = async ()=>{
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    $("#random").attr("disabled", true);
    $("#start_pause").attr("disabled", true);
    await quick_sort1(ctx, 0, MAXN-1);
    await Finish(ctx);
};

Display = () => {
    if($("#display").val() == "Display Range"){
        $("#display").val("Hide Range");
    }else {
        $("#display").val("Display Range");
    }
};

Randomize = () => {
    initCanvas();
};

///////////////////////////////////Run////////////////////////////////////