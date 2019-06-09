let BASEWIDTH = 50;
let MAXN = 32;
let TIMEINTERVAL = 20;
let LINEWIDTH = 2;
let MICROSOFTFONT = "bold 10pt Microsoft JhengHei";
let canvasWidth;
let canvasHeight;
let Tree = new Array(MAXN);
let Extra = new Node();

function Node() {
    this.lch = null;
    this.rch = null;
    this.par = null;
    this.Val = null;
    this.Ide = null;
    this.pre = null;
    this.nex = null;
    Circle.call(this);
}
Node.prototype = new Circle();
Node.prototype.constructor = Node;

Node.prototype.Inite = function (posx, posy, radius, par, id) {
    this.PosX = posx;
    this.PosY = posy;
    this.Radius = radius;
    this.par = par;
    this.Ide = id;
};

Node.prototype.DrawValue = function (context, id, color) {
    let fs = context.fillStyle;
    context.fillStyle = color;
    let width = context.measureText(this.Val).width;
    context.fillText(this.Val, this.PosX-(width/2), this.PosY-5);
    context.fillStyle = fs;
};

Node.prototype.DrawLine = function (context, id, color, linewidth) {
    let line = new Line();
    line.Inite_Point(this.PosX, this.PosY, Tree[this.par].PosX, Tree[this.par].PosY);
    line.DrawLine(context, color, linewidth);
};

///////////////////////////////////Draw/////////////////////////////////////
function drawTree(ctx, colorc, colorv, colorl){
    for(let i = 0; i < MAXN-1; i++){
        if(Tree[i].Val != null){
            if(Tree[i].Ide != 0) Tree[i].DrawLine(ctx, i, colorl, 2);
            Tree[i].DrawValue(ctx, i, colorv);
            Tree[i].DrawHollowCircle(ctx, colorc, 2);
        }
    }
}

function drawExtra(ctx, colorc, colorv) {
    Tree[31].DrawValue(ctx, 32, colorv);
    Tree[31].DrawHollowCircle(ctx, colorc, 2);
}

function clearAll(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawAll(ctx) {
    clearAll(ctx);
    if(Tree[31].Val != null)drawExtra(ctx, "black", "black");
    drawTree(ctx, "black", "black", "gray");
}

const drawFinish = (String)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            DrawLayerWindow(String,
                $("#myCanvas").position().top + BASEWIDTH,
                $("#myCanvas").position().left + BASEWIDTH, 1500, 0, 0, 6);
            resolve(String);
        }, 10*TIMEINTERVAL);
    })
};

///////////////////////////////////Move/////////////////////////////////////

//move node1 to the position of node2
function MoveNode(ctx, node1, node2){
    const posx = node1.PosX, posy = node1.PosY, vv = node1.Val, rr = node1.Radius;
    return new Promise((resolve, reject)=>{
        let tmp = new Node();

        tmp.PosX = posx; tmp.PosY = posy; tmp.Val = vv; tmp.Radius = rr;
        tmp.lch = node2.lch; tmp.rch = node2.rch;
        tmp.par = node2.par;
        // if(node2.lch != null) Tree[node2.lch].pre = tmp.Ide;
        // if(node2.rch != null) Tree[node2.rch].pre = tmp.Ide;
        node1.Val = null;
        console.log(tmp, Tree[node1.Ide], Tree[node2.Ide]);
        console.log(tmp);

        //setTimeout(()=>{
        node1.Val = null;
        node2.Val = null;
        //}, 20*TIMEINTERVAL);
        tmp.par = node2.par;
        let length = Math.sqrt((node1.PosX-node2.PosX)*(node1.PosX-node2.PosX) + (node1.PosY-node2.PosY)*(node1.PosY-node2.PosY));
        let deta = length/50;
        let mark = 0
        let movenode = setInterval(function(){
            if(mark < length){
                tmp.PosX += deta*(node2.PosX - node1.PosX)/length;
                tmp.PosY += deta*(node2.PosY - node1.PosY)/length;
                mark += deta;
                drawAll(ctx);
                tmp.DrawLine(ctx, node1.Ide, "gray", 2);
                tmp.DrawValue(ctx, node1.Ide, "blue");
                tmp.DrawHollowCircle(ctx, "red", 2);
            }else{
                clearTimeout(movenode);
                drawAll(ctx);
                tmp.PosX = node2.PosX;
                tmp.PosY = node2.PosY;
                tmp.DrawLine(ctx, node1.Ide, "gray", 2);
                tmp.DrawValue(ctx, node1.Ide, "blue");
                tmp.DrawHollowCircle(ctx, "red", 2);
                node2.Val = tmp.Val;
                // if(node2.lch != null) Tree[node2.lch].pre = node1.Ide;
                // if(node2.rch != null) Tree[node2.rch].pre = node1.Ide;
                resolve("Move Node Success");
            }
        }, TIMEINTERVAL)
    })
}

let Path = new Array();
let Pathlen = 0;
function FindNode(ctx, val){
    return new Promise(async (resolve, reject)=>{
        await Close();
        Pathlen = 0;
        let root = 0;
        while(true){
            Path[Pathlen++] = root;
            if(root > MAXN-1 || Tree[root].Val == null) break;
            if(Tree[root].Val > val){
                root = root*2+1;
            }else if(Tree[root].Val < val){
                root = root*2+2;
            }else {
                break;
            }
        }

        console.log(Path);

        let index = 0;
        let drawpath = setInterval(async ()=>{
            if(index <= Pathlen-2){
                Tree[Path[index]].DrawLine(ctx, Path[index].Ide, "red", 2);
                Tree[Path[index]].DrawValue(ctx, Path[index].Ide, "red");
                Tree[Path[index]].DrawHollowCircle(ctx, "blue", 3);
                index++;
            }else{
                clearTimeout(drawpath);
                if(Path[index] > MAXN-2){
                    await drawFinish("Beyond the Range of Canvas !");
                    setTimeout( ()=>{
                        Open();
                        drawAll(ctx);
                        resolve(-1);
                    }, TIMEINTERVAL*50);
                }else{
                    if(Tree[Path[index]].Val == null){
                        Tree[Path[index]].DrawLine(ctx, Path[index].Ide, "red", 2);
                        //await DrawLayerWindow("Node is not in Tree!");
                        setTimeout(()=>{
                             Open();
                            drawAll(ctx);
                            resolve(Path[index]);
                        }, TIMEINTERVAL*50);
                    }else{
                        Tree[Path[index]].DrawLine(ctx, Path[index].Ide, "red", 2);
                        Tree[Path[index]].DrawValue(ctx, Path[index].Ide, "red");
                        Tree[Path[index]].DrawHollowCircle(ctx, "yellow", 3);
                        setTimeout(()=>{
                            Open();
                            drawAll(ctx);
                            resolve(Path[index]+MAXN);
                        }, TIMEINTERVAL*50);
                    }
                }
            }
        }, TIMEINTERVAL*30);
    })
}

function InsertNode(ctx, val) {
    return new Promise(async (resolve, reject) => {
        let tmp = await FindNode(ctx, val);
        tmp = parseInt(tmp);
        Tree[31].Val = val;
        //alert(tmp);
        if(tmp == -1){
            Tree[31].Val = null;
            drawAll(ctx);
        } else if(tmp >= MAXN){
            await drawFinish("The value is in Tree !");
            Tree[31].Val = null;
            resolve("Has Insert");
        }else{
            await MoveNode(ctx, Tree[31], Tree[tmp]);
            await DrawLayerWindow("Insert success !",
                $("#myCanvas").position().top + BASEWIDTH,
                $("#myCanvas").position().left + BASEWIDTH, 1500, 1, 0, 0);
            setTimeout(()=>{
                //MoveNode
                //Tree[tmp].Val = val;
                Tree[31].Val = null;
                drawAll(ctx);
                resolve("Insert Success");
            }, 30*TIMEINTERVAL);
        }
    })
}

DeleteNode = async function(ctx, val, index) {
    return new Promise(async (resolve, reject) => {
        // 这里是第一次找val的index，最终分三种情况：
        // 1 超出范围(index = -1)  2 找到且有值(index < MAXN - 1)  3 没找到但又在范围之内(index >= MAXN)
        if(index == -2){
            index = await FindNode(ctx, val);
            index = parseInt(index);
        }
        // 前两个if仅仅针对找不到或者不合理的情况
        if(index == -1){
            resolve("index = -1");
        } else if(index < MAXN-1){
            await drawFinish("Cannot Find the Value !");
            Open();
            resolve("index >= MAXN")
        } else {
            //index是要删点的位标
            index -= MAXN;
            if(index*2+1 >= MAXN-1 || (Tree[Tree[index].lch].Val == null && Tree[Tree[index].rch].Val == null)){
                Tree[index].Val = null;
                drawAll(ctx);
                Open();
                resolve("Finish !");
            }else{
                let tmpindex = index;
                let post = null, pre = null;
                //找他的后继
                let minlarge = 9999;
                function findpost(tmpind) {
                    if(tmpind <= MAXN-2 && Tree[tmpind].Val != null){
                        if(Tree[tmpind].Val > Tree[index].Val && Tree[tmpind].Val < minlarge){
                            minlarge = Tree[tmpind].Val;
                            post = tmpind;
                        }
                        findpost(tmpind*2+1);
                        findpost(tmpind*2+2);
                    }
                }
                findpost(tmpindex);

                //找他的前驱
                let maxsmall = -9999;
                function findpre(tmpind) {
                    if(tmpind <= MAXN-2 && Tree[tmpind].Val != null){
                        if(Tree[tmpind].Val < Tree[index].Val && Tree[tmpind].Val > maxsmall){
                            maxsmall = Tree[tmpind].Val;
                            pre = tmpind;
                        }
                        findpre(tmpind*2+1);
                        findpre(tmpind*2+2);
                    }
                }
                findpre(tmpindex);
                console.log("--->", pre, post);
                if(post != null){
                    await MoveNode(ctx, Tree[post], Tree[index]);
                    Tree[post].Val = val;
                    await DeleteNode(ctx, val, post+MAXN);
                }else{
                    await MoveNode(ctx, Tree[pre], Tree[index]);
                    Tree[pre].Val = val;
                    await DeleteNode(ctx, val, pre+MAXN);
                }
            }
        }
    });
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

initCanvas = async function () {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    ctx.lineWidth = LINEWIDTH;
    ctx.font = MICROSOFTFONT;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    let root = 0;
    Tree[root] = new Node();
    Tree[root].Inite(8*BASEWIDTH, 2.5*BASEWIDTH, 0.5*BASEWIDTH, 0, 0);
    let rad = 0.5*BASEWIDTH;

    function genTree(posx, posy, root, width) {
        let tmp = root;
        if(root*2+1 <= MAXN-2){
            tmp = root*2+1;
            Tree[root].lch = tmp;
            Tree[tmp] = new Node();
            Tree[tmp].Inite(posx-width/2, posy + 2*BASEWIDTH, rad, root, tmp);
            genTree(Tree[tmp].PosX, Tree[tmp].PosY, tmp, width/2);
        }
        if(root*2+2 <= MAXN-2){
            tmp = root*2+2;
            Tree[root].rch = tmp;
            Tree[tmp] = new Node();
            Tree[tmp].Inite(posx+width/2, posy + 2*BASEWIDTH, rad, root, tmp);
            genTree(Tree[tmp].PosX, Tree[tmp].PosY, tmp, width/2);
        }
    }
    genTree(8*BASEWIDTH, 2.5*BASEWIDTH, 0, 8*BASEWIDTH);
    Tree[31] = new Node();
    Tree[31].Inite(1.25*BASEWIDTH, 1.25*BASEWIDTH, BASEWIDTH/2, 31, 31);

    TextMaxLength(document.getElementById("insertbox"), 3);
    TextMaxLength(document.getElementById("deletebox"), 3);
    TextMaxLength(document.getElementById("findbox"), 3);



};

function Interval(ctx, time){
    return new Promise((resolve, reject)=>{
        drawAll(ctx);
        setTimeout(()=>{
            resolve("interval");
        }, time);
    })
}

Insert = async function () {
    Close();
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let inputText = document.getElementById("insertbox").value;
    let flag = 0;
    for(let i = 0; i < inputText.length; i++){
        if(inputText[i] > '9' || inputText[i] < '0'){
            flag = 1;
        }
    }
    if(inputText != "" && !flag){
        let tmpval = parseInt(inputText);
        Tree[31].Val = tmpval;
        await Interval(ctx,TIMEINTERVAL*20);
        await InsertNode(ctx, tmpval);
        drawAll(ctx);
    }else{
        DrawLayerWindow("Please Insert Correctly ...",
            $("#myCanvas").position().top + BASEWIDTH,
            $("#myCanvas").position().left + BASEWIDTH, 1500, 0, 0, 6);
    }
    await Open();
};

Delete = async function () {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let inputText = document.getElementById("deletebox").value;
    let flag = 0;
    for(let i = 0; i < inputText.length; i++){
        if(inputText[i] > '9' || inputText[i] < '0'){
            flag = 1;
        }
    }
    if(inputText != "" && !flag){
        Close();
        let tmpval = parseInt(inputText);
        await DeleteNode(ctx, tmpval, -2);
        await Open();
    }else{
        DrawLayerWindow("Please Delete Correctly ...",
            $("#myCanvas").position().top + BASEWIDTH,
            $("#myCanvas").position().left + BASEWIDTH, 1500, 0, 0, 6);
    }
};

Find = async function () {
    Close();
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let inputText = document.getElementById("findbox").value;
    let flag = 0;
    for(let i = 0; i < inputText.length; i++){
        if(inputText[i] > '9' || inputText[i] < '0'){
            flag = 1;
        }
    }
    if(inputText != "" && !flag){
        let tmpval = parseInt(inputText);
        let val = await FindNode(ctx, tmpval);
        if(val >= MAXN){
            let xx = await DrawLayerWindow("Find it !",
                $("#myCanvas").position().top + BASEWIDTH,
                $("#myCanvas").position().left + BASEWIDTH, 1500, 1, 0, 0);
        }
    }else{
        let xx = await DrawLayerWindow("Please Find Correctly ...",
            $("#myCanvas").position().top + BASEWIDTH,
            $("#myCanvas").position().left + BASEWIDTH, 1500, 0, 0, 6);
    }
    await Open();
};

Clear = function () {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    for(let i = 0; i < MAXN; i++)
        Tree[i].Val = null;
    drawAll(ctx);
};

Fill = function () {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let arr = [16, 8, 24, 4, 12, 20, 28, 2, 6, 10, 14, 18, 22, 26, 30,
    1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, null];
    for(let i = 0; i < MAXN; i++)
        Tree[i].Val = arr[i];
    drawAll(ctx);
};

///////////////////////////////////Four Orders/////////////////////////////////////
orderInterval = function(ctx, ordersting, string){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            drawAll(ctx);
            let title = new Text();
            title.Inite(0, 20, "red", "bold 13pt Microsoft JhengHei", ordersting);
            title.DrawText(ctx);
            let textval = new Text();
            textval.Inite(BASEWIDTH-10, BASEWIDTH+10, "green", "bold 13pt Microsoft JhengHei", string);
            textval.DrawText(ctx);
            resolve("preInterval");
        }, 20*TIMEINTERVAL);
    })
};

orderRun = async function(ctx, arr, orderStr){
    return new Promise(async (resolve, reject) => {
        let str = "";
        for(let i = 0; i < arr.length; i++){
            let tmpindex = arr[i];
            let pathcnt = 0;
            if(Tree[arr[i]].Val != null){
                str += Tree[arr[i]].Val.toString() + "  ";
                while (tmpindex > 0){
                    Tree[tmpindex].DrawLine(ctx, tmpindex, "red", 2);
                    Tree[tmpindex].DrawValue(ctx, tmpindex, "red");
                    Tree[tmpindex].DrawHollowCircle(ctx, "yellow", 3);
                    tmpindex = parseInt((tmpindex-1)/2);
                }
                Tree[0].DrawValue(ctx, tmpindex, "red");
                Tree[0].DrawHollowCircle(ctx, "yellow", 3);
                Tree[arr[i]].DrawHollowCircle(ctx, "green", 4);
                await orderInterval(ctx, orderStr, str);
            }
        }
        resolve("orderRun");
    })
};

Preorder = async function () {
    Close();
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let arr = [15, 7, 16, 3, 17, 8, 18, 1, 19, 9, 20, 4, 21, 10, 22, 0, 23, 11, 24, 5, 25, 12, 26,
    2, 27, 13, 28, 6, 29, 14, 30];
    await orderRun(ctx, arr, "The Preorder is :");
    await DrawLayerWindow("Preorder Finish !",
        $("#myCanvas").position().top + BASEWIDTH,
        $("#myCanvas").position().left + 2*BASEWIDTH, 1500, 1, 0, 0);
    await Open();
};

Inorder = async function () {
    Close();
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let arr = [0, 1, 3, 7, 15, 16, 8, 17, 18, 4, 9, 19, 20, 10, 21, 22, 2, 5, 11, 23, 24, 12, 25,
    26, 6, 13, 27, 28, 14, 29, 30];
    await orderRun(ctx, arr, "The Inorder is :");
    await DrawLayerWindow("Inorder Finish !",
        $("#myCanvas").position().top + BASEWIDTH,
        $("#myCanvas").position().left + 2*BASEWIDTH, 1500, 1, 0, 0);
    await Open();
};

Postorder = async function () {
    Close();
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let arr = [15, 16, 7, 17, 18, 8, 3, 19, 20, 9, 21, 22, 10, 4, 1, 23, 24, 11, 25, 26, 12, 5,
    27, 28, 13, 29, 30, 14, 6, 2, 0];
    await orderRun(ctx, arr, "The Postorder is :");
    await DrawLayerWindow("Postorder Finish !",
        $("#myCanvas").position().top + BASEWIDTH,
        $("#myCanvas").position().left + 2*BASEWIDTH, 1500, 1, 0, 0);
    await Open();
};

Levelorder = async function () {
    Close();
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let arr = new Array(MAXN-1);
    for(let i = 0; i < arr.length; i++){
        arr[i] = i;
    }
    await orderRun(ctx, arr, "The Levelorder is :");
    await DrawLayerWindow("Levelorder Finish !",
        $("#myCanvas").position().top + BASEWIDTH,
        $("#myCanvas").position().left + 2*BASEWIDTH, 1500, 1, 0, 0);
    await Open();
};

//按钮互斥事件

function Close() {
    return new Promise((resolve, reject) => {
        $("#preorder").attr("disabled", true);
        $("#inorder").attr("disabled", true);
        $("#postorder").attr("disabled", true);
        $("#levelorder").attr("disabled", true);
        $("#insert").attr("disabled", true);
        $("#delete").attr("disabled", true);
        $("#find").attr("disabled", true);
        $("#clear").attr("disabled", true);
        $("#fill").attr("disabled", true);
        resolve("open");
    })
}

function Open() {
    return new Promise((resolve, reject) => {
        $("#preorder").attr("disabled", false);
        $("#inorder").attr("disabled", false);
        $("#postorder").attr("disabled", false);
        $("#levelorder").attr("disabled", false);
        $("#insert").attr("disabled", false);
        $("#delete").attr("disabled", false);
        $("#find").attr("disabled", false);
        $("#clear").attr("disabled", false);
        $("#fill").attr("disabled", false);
        resolve("close");
    })
}