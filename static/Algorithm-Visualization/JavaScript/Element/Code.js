function Code() {
    this.PosX = 0;
    this.PosY = 0;
    this.LineInterval = 0;
    this.Name = "Null";
    this.Context = "Null";
    this.Line = new Array();
}

Code.prototype.Inite = function(PosX, PosY, Context, Name, LineInterval){
    this.PosX = PosX;
    this.PosY = PosY;
    this.Context = Context;
    this.Name = Name;
    this.LineInterval = LineInterval;
};

Code.prototype.ProcessCode = function(){
    let len = this.Context.length;
    let index = 0;
    let str = "";
    for(let i = 0; i < len; i++){
        if(this.Context[i] != '\n'){
            if(this.Context[i] == '\t') str += "    ";
            else str += this.Context[i];
        }else{
            this.Line[index++] = str;
            str = "";
        }
    }
};

Code.prototype.DrawCode = function(Context, Color, CodeWidth){
    var originWidth = Context.lineWidth;
    var originStyle = Context.fillStyle;
    Context.lineWidth = CodeWidth;
    Context.fillStyle = Color;

    for(let i = 0; i < this.Line.length; i++){
        let str = (i+1).toString() + ((i+1) >= 10 ? "":" ") + "    " + this.Line[i];
        Context.fillText(str, this.PosX, this.PosY+i*this.LineInterval);
    }
    Context.lineWidth = originWidth;
    Context.fillStyle = originStyle;
};

Code.prototype.StressLine = function(Context, Color, CodeWidth, LineIndex){
    var originWidth = Context.lineWidth;
    var originStyle = Context.fillStyle;
    Context.lineWidth = CodeWidth;
    Context.fillStyle = Color;
    let str = (LineIndex+1).toString() + (LineIndex+1 > 10 ? "":" ") + "    " + this.Line[LineIndex];
    Context.fillText(str, this.PosX, this.PosY+LineIndex*this.LineInterval);
    Context.lineWidth = originWidth;
    Context.fillStyle = originStyle;
};