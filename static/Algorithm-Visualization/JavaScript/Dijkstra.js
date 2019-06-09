let BASEWIDTH = 50;
let MAXN = 32;
let TIMEINTERVAL = 20;
let LINEWIDTH = 2;
let MICROSOFTFONT = "bold 10pt Microsoft JhengHei";
let cellWidth = 30;
let canvasWidth;
let canvasHeight;
let dist = new Array(); //
let vis = new Array();
let path = new Array();
let primGraph = new Graph(); //
let graphTable = new Table(); // update with primGraph.graph
let distTable = new Table(); // update with dist
let visTable = new Table(); // update with vis


///////////////////////////////////Draw/////////////////////////////////////
function clearAll(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawPath(ctx){
    for(let i = 0; i < primGraph.vertexNum; i++){
        if(path[i] != null){
            let l = new Line();
            l.Inite_Point(primGraph.vertexs[i].PosX, primGraph.vertexs[i].PosY,
                primGraph.vertexs[path[i]].PosX, primGraph.vertexs[path[i]].PosY);
            l.DrawLine(ctx, "purple", 5);
        }
    }
}

function drawAll(ctx) {
    clearAll(ctx);
    primGraph.DrawGraph(ctx, "red", 3, "#B0C4DE", 3);
    drawPath(ctx);
    for(let i = 0; i < primGraph.vertexNum; i++){
        ctx.fillText("Graph", 0, 20);
        ctx.fillText("Distance", 0, (2+primGraph.vertexNum)*cellWidth+10);
        ctx.fillText("Visited", 0, (5+primGraph.vertexNum)*cellWidth+10);
        ctx.fillText(i, 20+(i+0.5)*cellWidth-5, 20+15+(2+primGraph.vertexNum)*cellWidth);
        ctx.fillText(i, 20+(i+0.5)*50-5, 20+15+(5+primGraph.vertexNum)*cellWidth);
        ctx.fillText(i, 20+(i+0.5)*cellWidth-5, 20+15);
        ctx.fillText(i, 10, 20+20+(i+0.5)*cellWidth+5);
    }
    graphTable.DrawTable(ctx, "black", 2, "black", MICROSOFTFONT);
    distTable.DrawTable(ctx, "black", 2, "black", MICROSOFTFONT);
    visTable.DrawTable(ctx, "black", 2, "black", MICROSOFTFONT);
}

///////////////////////////////////Move/////////////////////////////////////

function checkConnected(g){
    let checkvis = new Array(g.vertexNum);
    for(let i = 0; i < g.vertexNum; i++){
        checkvis[i] = 0;
    }

    function isConnected(i){
        checkvis[i] = 1;
        let nod = g.vertexs[i];
        //console.log("--->", nod);
        for(let j = 0; j < nod.EdgesNum; j++){
            let t = nod.NextEdges[j];
            let x = (i == g.edges[t].preNode ? g.edges[t].nextNode : g.edges[t].preNode);
            if(!checkvis[x])
                isConnected(x);
        }
    }

    isConnected(0);

    for(let i = 0; i < g.vertexNum; i++){
        if(!checkvis[i]) return false;
    }
    return true;
}

findEdgeInMatrix = function(ctx, i, j){
    return new Promise((resolve, reject) => {
        console.log(i, j);
        graphTable.DrawTableElement(ctx, i, j, "yellow", 3, "black", MICROSOFTFONT);
        graphTable.DrawTableElement(ctx, j, i, "yellow", 3, "black", MICROSOFTFONT);
        setTimeout(()=>{
            drawAll(ctx);
            resolve("MatrixFind");
        }, 30*TIMEINTERVAL);
    })
};

findInDistance = function(ctx, j){
    return new Promise((resolve, reject) => {
        drawAll(ctx);
        distTable.DrawTableElement(ctx, 0, j, "red", 3, "black", MICROSOFTFONT);
        visTable.DrawTableElement(ctx, 0, j, "green", 3, "black", MICROSOFTFONT);
        setTimeout(()=>{
            drawAll(ctx);
            visTable.DrawTableElement(ctx, 0, j, "green", 3, "black", MICROSOFTFONT);
            resolve("DistanceFind");
        }, 30*TIMEINTERVAL);
    })
};

findInVisited = function(ctx, j){
    return new Promise((resolve, reject) => {
        visTable.DrawTableElement(ctx, 0, j, "red", 3, "black", MICROSOFTFONT);
        setTimeout(()=>{
            drawAll(ctx);
            resolve("VisitedFind");
        }, 30*TIMEINTERVAL);
    })
};

drawNode = function(ctx, i){
    return new Promise((resolve, reject) => {
        primGraph.vertexs[i].DrawHollowCircle(ctx, "green", 3);
        distTable.DrawTableElement(ctx, 0, i, "green", 3, "red", MICROSOFTFONT);
        visTable.DrawTableElement(ctx, 0, i, "green", 3, "red", MICROSOFTFONT);
        setTimeout(()=>{
            drawAll(ctx);
            resolve("drawNode");
        }, 30*TIMEINTERVAL);
    })
};

// find the pos in Prim()
findPos = async function (ctx) {
    return new Promise(async (resolve, reject) => {

        let Min = INF, pos = -1;
        for(let i = 0; i < primGraph.vertexNum; i++){
            await findInVisited(ctx, i);
            if(!vis[i]){
                await findInDistance(ctx, i);
                if(dist[i] < Min){
                    Min = dist[i];
                    pos = i;
                    await drawNode(ctx, pos);
                    //alert(pos);
                }
            }
        }
        if(pos >= 0) primGraph.vertexs[pos].DrawHollowCircle(ctx, "purple", 3);
        resolve(pos);
    })
};

function getEdgeNum(i, j){
    let x = Math.min(i, j), y = Math.max(i, j), n = primGraph.vertexNum;
    let t = (n*(n-1)/2 - (n-x-1)*(n-x)/2);
    let num = t + (y - x) - 1;
    return num;
}

compareTwoPoint = function(ctx, pos, i, j){
    return new Promise((resolve, reject) => {
        let l1 = new Line();
        l1.Inite_Point(primGraph.vertexs[pos].PosX, primGraph.vertexs[pos].PosY,
            primGraph.vertexs[i].PosX, primGraph.vertexs[i].PosY);
        let l2 = new Line();
        l2.Inite_Point(primGraph.vertexs[pos].PosX, primGraph.vertexs[pos].PosY,
            primGraph.vertexs[j].PosX, primGraph.vertexs[j].PosY);
        l1.DrawLine(ctx, "orange", 3);
        l2.DrawLine(ctx, "pink", 3);
        distTable.DrawTableElement(ctx, 0, pos, "green", 3, "red", MICROSOFTFONT);
        visTable.DrawTableElement(ctx, 0, pos, "green", 3, "red", MICROSOFTFONT);
        setTimeout(()=>{
            drawAll(ctx);
            l1.DrawLine(ctx, "orange", 3);
            l2.DrawLine(ctx, "pink", 3);
            distTable.DrawTableElement(ctx, 0, pos, "green", 3, "red", MICROSOFTFONT);
            visTable.DrawTableElement(ctx, 0, pos, "green", 3, "red", MICROSOFTFONT);
            resolve("Compare Finish");
        }, 10*TIMEINTERVAL);
    });
};

moveIndexToDist = function(ctx, pos, i){
    return new Promise((resolve, reject) => {

        // let move = setInterval(()=>{
        //
        // }, TIMEINTERVAL);
        dist[i] = primGraph.graph[pos][i];
        distTable.body[0][i] = primGraph.graph[pos][i];
        path[i] = pos;
        distTable.DrawTableElement(ctx, 0, pos, "green", 3, "red", MICROSOFTFONT);
        visTable.DrawTableElement(ctx, 0, pos, "green", 3, "red", MICROSOFTFONT);
        setTimeout(()=>{
            drawAll(ctx);
            distTable.DrawTableElement(ctx, 0, pos, "green", 3, "red", MICROSOFTFONT);
            visTable.DrawTableElement(ctx, 0, pos, "green", 3, "red", MICROSOFTFONT);
            // pass
            resolve("move index to dist");
        }, 10*TIMEINTERVAL);
    })
};

// update dist[i]
updateDist = async function(ctx, pos){
    drawAll(ctx);
    for(let i = 0; i < primGraph.vertexNum; i++) {
        await findInVisited(ctx, i);
        if (!vis[i] && primGraph.graph[pos][i] < dist[i]) {
            //await compareTwoPoint(ctx, pos, i, j);
            await moveIndexToDist(ctx, pos, i); //realize dist[i] = pos
        }
    }
};

Prim = function * (ctx) {

    dist[primGraph.st] = 0;
    distTable.body[0][primGraph.st] = 0;
    let flag = 0;

    for(let k = 0; k < primGraph.vertexNum; k++){
        let pos = -1;
        if(!flag){
            pos = primGraph.st;
            flag = 1;
        }else{
            yield pos = findPos(ctx);
        }
        if(pos != -1){
            vis[pos] = true;
            visTable.body[0][pos] = true;
        }else{
            vis[primGraph.st] = true;
            visTable.body[0][primGraph.st] = true;
        }
        yield updateDist(ctx, pos);
    }
};

Prim1 = async function(ctx) {
    dist[primGraph.st] = 0;
    distTable.body[0][primGraph.st] = 0;
    path[primGraph.st] = primGraph.st;

    // at most n times
    for(let k = 0; k < primGraph.vertexNum; k++){
        let pos;
        pos = await findPos(ctx);
        console.log("Pos-->", pos);
        if(pos != -1){
            vis[pos] = true;
            visTable.body[0][pos] = true;
            await updateDist(ctx, pos);
        }else{
            console.log("fail");
        }
    }
};


///////////////////////////////////Click Events/////////////////////////////////////

function changeSpeed() {
    var value = $('#range_speed').val();
    var valStr = value + "% 100%";
    $('#value1').html((value / 10).toFixed(1));
    $('#range_speed').css({
        "background-size": valStr
    });
    $("input[name='animat_speed']").val((value / 10).toFixed(1));
    TIMEINTERVAL = 40 - 20*value/50;
}

initCanvas = function () {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    while(true){
        primGraph = genGraph();
        if(checkConnected(primGraph))
            break;
    }
    graphTable.Inite(20, 20+20, primGraph.vertexNum, primGraph.vertexNum, cellWidth, cellWidth);
    graphTable.body = primGraph.graph;
    distTable.Inite(20, 20+20+primGraph.vertexNum*cellWidth+2*cellWidth, 1, primGraph.vertexNum, cellWidth, cellWidth);
    for(let i = 0; i < primGraph.vertexNum; i++){
        dist[i] = INF;
        distTable.body[0][i] = dist[i];
    }
    visTable.Inite(20, 20+20+primGraph.vertexNum*cellWidth+5*cellWidth, 1, primGraph.vertexNum, cellWidth, 50);
    for(let i = 0; i < primGraph.vertexNum; i++){
        vis[i] = false;
        visTable.body[0][i] = vis[i];
    }
    for(let i = 0; i < primGraph.vertexNum; i++){
        path[i] = null;
    }
    drawAll(ctx);
    primGraph.st = 0;
    //drawNode(ctx, 3);
    //findInVisited(ctx, 3);
    Prim1(ctx);
    //findEdgeInMatrix(ctx, 1, 3);
};

