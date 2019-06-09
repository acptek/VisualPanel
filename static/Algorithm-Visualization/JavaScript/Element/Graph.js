const INF = 99999999;

function Node() {
    this.Val = null;
    this.Ide = null;
    this.NextEdges = new Array(10);
    this.EdgesNum = 0;
    Circle.call(this);
}
Node.prototype = new Circle();
Node.prototype.constructor = Node;

function Edge(){
    this.Val = null;
    this.preNode = null; //int
    this.nextNode = null; //int
    Line.call(this);
}
Edge.prototype = new Line();
Edge.prototype.constructor = Edge;

function Graph() {
    this.edgeNum = null;
    this.vertexNum = null;
    this.st = null;
    this.graph = new Array(); // matrix of a graph
    this.edges = new Array(); // array of Edge
    this.vertexs = new Array(); // array of vertex
}


// Arrn : array of Node (PosX, PosY, Radius)
// Arre : array of Edge (preNode, nextNode, Val)
// Init graph, edges, vertexs
Graph.prototype.Inite = function(Arrn, Arre){
    this.vertexNum = Arrn.length;
    this.edgeNum = Arre.length;

    //Init this.graph
    for(let i = 0; i < Arrn.length; i++){
        this.graph[i] = new Array(Arrn.length);
        for(let j = 0; j < Arrn.length; j++){
            this.graph[i][j] = INF;
        }
        this.graph[i][i] = 0;
    }

    // Arrn
    for(let i = 0; i < Arrn.length; i++){
        this.vertexs[i] = new Node();
        this.vertexs[i] = Arrn[i];
        this.vertexs[i].Val = 0;
        this.vertexs[i].Ide = i;
    }

    // Arre
    for(let i = 0; i < Arre.length; i++){
        this.edges[i] = new Edge();
        this.edges[i] = Arre[i];
    }

    // Process this.vertexs
    for(let i = 0; i < Arre.length; i++){
        let x = this.edges[i].preNode, y = this.edges[i].nextNode;
        this.graph[x][y] = this.graph[y][x] = this.edges[i].Val;
        this.vertexs[x].NextEdges[this.vertexs[x].EdgesNum++] = i;
        this.vertexs[y].NextEdges[this.vertexs[y].EdgesNum++] = i;
    }

   // Process this.edges
    for(let i = 0; i < Arre.length; i++){
        this.edges[i].StartX = Arrn[Arre[i].preNode].PosX;
        this.edges[i].StartY = Arrn[Arre[i].preNode].PosY;
        this.edges[i].EndX = Arrn[Arre[i].nextNode].PosX;
        this.edges[i].EndY = Arrn[Arre[i].nextNode].PosY;
    }
};

Graph.prototype.DrawGraph = function(Context, NodeColor, NodeWidth, EdgeColor, EdgeWidth){

    for(let i = 0; i < this.edgeNum; i++){
        this.edges[i].DrawLine(Context, EdgeColor, EdgeWidth);
    }

    for(let i = 0; i < this.vertexNum; i++){
        this.vertexs[i].DrawHollowCircle(Context, NodeColor, NodeWidth);
        let ft = Context.font;
        Context.font = "bold 14pt Microsoft JhengHei";
        Context.fillText(i, this.vertexs[i].PosX - 3, this.vertexs[i].PosY - 5);
        Context.font = ft;
    }

    for(let i = 0; i < this.edgeNum; i++){
        let x = (this.edges[i].StartX*0.2 + this.edges[i].EndX*0.8)-5;
        let y = (this.edges[i].StartY*0.2 + this.edges[i].EndY*0.8)-5;
        let tmptext = new Text();
        let msft = "bold 14pt Microsoft JhengHei";
        tmptext.Inite(x, y, "green", msft, this.edges[i].Val);
        tmptext.DrawText(Context);
        //Context.fillText(this.edges[i].Val, x-5, y-5);
    }
};

function polygon(n,x,y,r,angle,counterclockwise){
    var angle = angle || 0;
    var counterclockwise = counterclockwise || false;
    let arr = new Array();
    let posx = x + r*Math.sin(angle), posy = y - r*Math.cos(angle);
    let delta = 2*Math.PI/n;
    for(let i=0;i<n;i++){
        angle += counterclockwise ? -delta : delta;
        posx = x + r*Math.sin(angle), posy = y - r*Math.cos(angle);
        arr[i]= new Node();
        arr[i].Inite(posx, posy, 25);
    }
    return arr;
}

function randomArray(st, n, m) {
    let a = [];
    for(var i = st; i < st + n; i++){
        a.push(i);
    }
    a.sort(function(){return 0.5 - Math.random()});
    a.length = m;
    return a;
}

function genGraph(){
    let tmpgraph = new Graph();
    let n = parseInt(Math.random()*5+4);
    let m = parseInt(Math.random()*(n*(n-1)/2-3)+3);
    console.log(n, m);
    let arrn = polygon(n, 600, 250, 200);
    let tmp = randomArray(0, n*(n-1)/2, m);
    let arre = new Array(m);
    for(let i = 0; i < m; i++){
        arre[i] = new Edge();
        arre[i].Val = parseInt(Math.random()*6)+1;
        let st = 0;
        while ((n*(n-1)/2 - (n-st-1)*(n-st)/2) <= tmp[i]){
            st++;
        }
        st--;
        arre[i].preNode = st;
        arre[i].nextNode = st + (tmp[i] + (n-st-1)*(n-st)/2 - n*(n-1)/2)+1;
        //console.log('-->', n, tmp[i], st);
    }
    //console.log(arrn, arre);
    tmpgraph.Inite(arrn, arre);
    return tmpgraph;
}

// initCanvas = function() {
//     //randomArray(10, 21, 10);
//     let canvas = document.getElementById("myCanvas");
//     let ctx = canvas.getContext("2d");
//     //let gg = new Graph();
//     let gg = genGraph();
//     // let arrn = new Array();
//     // arrn = polygon(5, 600, 250, 200);
//     // let arre = new Array();
//     // arre[0] = new Edge();
//     // arre[0].Val = 10; arre[0].preNode = 0; arre[0].nextNode = 1;
//     // arre[1] = new Edge();
//     // arre[1].Val = 20; arre[1].preNode = 2; arre[1].nextNode = 3;
//     // let gg = new Graph();
//     // gg.Inite(arrn, arre);
//     gg.DrawGraph(ctx, "red", 2, "blue", 2);
//     console.log(gg);
// };
