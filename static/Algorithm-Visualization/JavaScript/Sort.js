var BASEWIDTH = 50;
var MAXN = 13;
var TIMEINTERVAL = 10;
var LINEWIDTH = 2;
var MICROSOFTFONT = "bold 10pt Microsoft JhengHei";
var canvasWidth;
var canvasHeight;
var Arr = new Array(MAXN);

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

function clearAll(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

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

function drawArray(ctx) {
    for(let i = 0; i < MAXN; i++){
        ctx.fillText(i, (2.2+i)*BASEWIDTH, 4.5*BASEWIDTH-10);
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
}

const swap = (ctx, i, j)=> {
    return new Promise((resolve, reject) => {
        var iendX = Arr[j].PosX, iendY = Arr[i].PosY - 3 * BASEWIDTH - 20;
        var jendX = Arr[i].PosX, jendY = Arr[j].PosY + 3 * BASEWIDTH + 20;
        var ifinalY = Arr[j].PosY, jfinalY = Arr[i].PosY;
        var moveArr = setInterval(function () {
            if (Arr[i].PosY > iendY) {
                Arr[i].PosY -= 5;
                Arr[j].PosY += 5;
                if (Arr[i].PosY < iendY) {
                    Arr[i].PosY += iendY - Arr[i].PosY;
                }
                if (Arr[j].PosY > jendY) {
                    Arr[j].PosY -= Arr[j].PosY - jendY;
                }
            } else if (Arr[i].PosX < iendX) {
                Arr[i].PosX += 5;
                Arr[j].PosX -= 5;
                if (Arr[i].PosX > iendX) {
                    Arr[i].PosX -= Arr[i].PosX - iendX;
                }
                if (Arr[j].PosX < jendX) {
                    Arr[j].PosX += jendX - Arr[i].PosX;
                }
            } else {
                clearTimeout(moveArr);
                var moveArrNext = setInterval(function () {
                    if (Arr[i].PosY < ifinalY) {
                        Arr[i].PosY += 5;
                        Arr[j].PosY -= 5;
                        if (Arr[i].PosY > ifinalY) {
                            Arr[i].PosY -= ifinalY - Arr[i].PosY;
                        }
                        if (Arr[j].PosY < jfinalY) {
                            Arr[j].PosY += jfinalY - Arr[j].PosY;
                        }
                        drawAll(ctx);
                        Arr[i].DrawHollowRectangle(ctx, "black", 4);
                        Arr[j].DrawHollowRectangle(ctx, "red", 4);
                    } else {
                        clearTimeout(moveArrNext);
                        drawAll(ctx);
                        Arr[j].DrawHollowRectangle(ctx, "red", 4);
                        Arr[i].DrawHollowRectangle(ctx, "black", 4);
                        var tmp = Arr[i];
                        Arr[i] = Arr[j];
                        Arr[j] = tmp;
                        if($("#start_pause").val() == "Start")
                            $("#next").attr("disabled", false);
                        resolve("Move Finish !");
                    }
                }, TIMEINTERVAL);
            }
            drawAll(ctx);
            Arr[i].DrawHollowRectangle(ctx, "black", 4);
            Arr[j].DrawHollowRectangle(ctx, "red", 4);
        }, TIMEINTERVAL);
    })
};

const Stress = (ctx, i, j) =>{
    return new Promise((resolve, reject)=>{
        let tmp = [2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2, 3];
        let index = 0;
        let nter = setInterval(()=>{
            if(index >= Arr.length){
                clearTimeout(nter);
                drawAll(ctx);
                reject("Stress finish")
            }else{
                drawAll(ctx);
                Arr[i].DrawHollowRectangle(ctx, "black", tmp[index]);
                Arr[j].DrawHollowRectangle(ctx, "red", tmp[index]);
                index++;
                resolve("Stress i j");
            }
        }, 10*TIMEINTERVAL)
    })
};

initCanvas = function(){

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    ctx.lineWidth = LINEWIDTH;
    ctx.font = MICROSOFTFONT;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    var tmp = randomArrayText(MAXN);

    for(var i = 0; i < MAXN; i++){
        console.log(tmp[i]);
        Arr[i] = new Number();
        Arr[i].Value = tmp[i];
        Arr[i].Inite((2+i)*BASEWIDTH, 4.5*BASEWIDTH, BASEWIDTH/1.5, tmp[i]*(3*BASEWIDTH/MAXN));
        Arr[i].Id = i;
    }
    drawAll(ctx);
};

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

const Interval = (ctx) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if($("#start_pause").val() == "Start")
                $("#next").attr("disabled", false);
            drawAll(ctx);
            resolve("Interval");
        }, 50*TIMEINTERVAL);
    })
};

const drawCompareInfo = (ctx, i, j)=>{
    return new Promise((resolve, reject)=>{
        ctx.fillStyle = "red";
        ctx.fillText("a[" + i + "] = " + Arr[i].Value.toString(), BASEWIDTH, BASEWIDTH);
        ctx.fillText("a[" + j + "] = " + Arr[j].Value.toString(), BASEWIDTH, 1.5*BASEWIDTH);
        ctx.fillText("a[" + i + "] > a[" + j + "]", BASEWIDTH, 2*BASEWIDTH);
        ctx.fillText("Swap a[" + i + "] and a[" + j +"]", BASEWIDTH, 2.5*BASEWIDTH);
        ctx.fillStyle = "black";
        Arr[j].DrawHollowRectangle(ctx, "red", 2);
        setTimeout(()=>{
            if($("#start_pause").val() == "Start")
                $("#next").attr("disabled", false);
            //drawAll(ctx);
            resolve("Finish DrawCompareInfo");
        }, 100*TIMEINTERVAL);
    })
};

Randomize = () => {
    initCanvas();
};

// //async + await
// Insert = async function () {
//     let canvas = document.getElementById("myCanvas");
//     let ctx = canvas.getContext("2d");
//
//     for(let i = 0; i < MAXN; i++){
//         for(let j = i-1; j >= 0; j--){
//             if(Arr[j].Value > Arr[j+1].Value){
//                 let drawinfo = await drawCompareInfo(ctx, j, j+1);
//                 console.log(drawinfo);
//                 let res = await swap(ctx, j, j+1);
//                 console.log(res);
//                 let inval = await Interval(ctx);
//                 console.log(inval);
//             }
//         }
//     }
//     let drawfin = await drawFinish("Insertion Sort Finish !")
//     console.log(drawfin);
// };

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

//////////////////////////////////////////////Sort Generator////////////////////////////////////////////
var Sort_g;

Insertion_gen = function * (ctx){
    for(let i = 0; i < MAXN; i++){
        for(let j = i-1; j >= 0; j--){
            if(Arr[j].Value > Arr[j+1].Value){
                yield stressBeforeSort(ctx, j, j+1);
                yield drawCompareInfo(ctx, j, j+1);
                yield swap(ctx, j, j+1);
                yield Interval(ctx);
            }
        }
    }
};

Selection_gen = function * (ctx){
    for (let i = 0; i < MAXN; i++){
        let Min = i;
        for(let j = i+1; j < MAXN; j++){
            yield stressBeforeSort(ctx, i, j);
            if(Arr[j].Value < Arr[Min].Value){
                Min = j;
            }
        }
        if(Min > i){
            yield drawCompareInfo(ctx, i, Min);
            yield swap(ctx, i, Min);
            yield Interval(ctx);
        }
    }
};

Bubble_gen = function * (ctx) {
    for(let i = 0; i < MAXN; i++){
        for(let j = MAXN-1; j > i; j--){
            yield stressBeforeSort(ctx, j-1, j);
            if(Arr[j].Value < Arr[j-1].Value){
                yield drawCompareInfo(ctx, j-1, j);
                yield swap(ctx, j-1, j);
                yield Interval(ctx);
            }
        }
    }
};

/////////////////////////////////////////////Control///////////////////////////////////////////////////////

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

SortRun = async (Sort_gen, String)=>{
    $("#start_pause").val("Pause");
    $("#insert").attr("disabled", true);
    $("#select").attr("disabled", true);
    $("#bubble").attr("disabled", true);
    $("#quick").attr("disabled", true);
    $("#merge").attr("disabled", true);
    $("#shell").attr("disabled", true);
    $("#random").attr("disabled", true);
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    function run(Sort_gen){
        Sort_g = Sort_gen(ctx);
        function next(data){
            var result = Sort_g.next(data);
            if (result.done){
                drawFinish(String);
                $("#insert").attr("disabled", false);
                $("#select").attr("disabled", false);
                $("#bubble").attr("disabled", false);
                $("#quick").attr("disabled", false);
                $("#merge").attr("disabled", false);
                $("#shell").attr("disabled", false);
                $("#random").attr("disabled", false);
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

Start_Pause = ()=>{
    $("#random").attr("disabled", true);
    if($("#start_pause").val() == "Pause"){
        $("#next").attr("disabled", false);
        $("#start_pause").val("Start");
    }else{
        $("#next").attr("disabled", true);
        $("#start_pause").val("Pause");
        Insert();
    }
};

Next = () => {
    $("#next").attr("disabled", true);
    if(Sort_g.next().done) {
        Insert();
    }
};

//////////////////////////////////////////////Run///////////////////////////////////////////////
Insert = () => {
    SortRun(Insertion_gen, "Insertion Sort Finish !");
};

Select = () => {
    SortRun(Selection_gen, "Selection Sort Finish !");
};

Bubble = () => {
    SortRun(Bubble_gen, "Bubble Sort Finish !");
};