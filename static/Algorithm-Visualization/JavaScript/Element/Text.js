function Text() {
    this.PosX = 0;
    this.PosY = 0;
    this.Color = null;
    this.Font = null;
    this.Str = null;
}

Text.prototype.Inite = function (PosX, PosY, Color, Font, Str) {
    this.PosX = PosX;
    this.PosY = PosY;
    this.Color = Color;
    this.Font = Font;
    this.Str = Str;
};

Text.prototype.DrawText = function (Context) {
    let fs = Context.fillStyle;
    Context.fillStyle = this.Color;
    let ft = Context.font;
    Context.font = this.Font;
    Context.fillText(this.Str, this.PosX, this.PosY);
    Context.fillStyle = fs;
    Context.font = ft;
};

Text.prototype.DrawCenterText = function (Context, TotalWidth) {
    let fs = Context.fillStyle;
    Context.fillStyle = this.Color;
    let ft = Context.font;
    let wid = Context.measureText(this.Str).width;
    Context.font = this.Font;
    Context.fillText(this.Str, this.PosX+TotalWidth/2-wid/2, this.PosY);
    Context.fillStyle = fs;
    Context.font = ft;
};