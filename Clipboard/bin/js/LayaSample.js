// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        var _this = this;
        Laya.init(750, 1334, Laya.WebGL);
        Laya.stage.scaleMode = "showall";
        //设置剧中对齐
        Laya.stage.alignV = "middle";
        Laya.stage.alignH = "center";
        this.createElement();
        //加一点延迟，不然位置不对
        setTimeout(function () {
            _this.clipboard = new Clipboard(_this.clipBtn, function () { return _this.textLabel.text; });
            _this.clipboard.on(Clipboard.EVENT_SUCCESS, _this, function () {
                console.log("复制成功");
            });
            _this.clipboard.on(Clipboard.EVENT_ERROR, _this, function () {
                console.log("复制失败");
            });
        }, 1000);
    }
    GameMain.prototype.createElement = function () {
        this.textLabel = new Laya.Label();
        this.textLabel.fontSize = 30;
        this.textLabel.left = 0;
        this.textLabel.right = 0;
        this.textLabel.top = 100;
        this.textLabel.color = "#ff0000";
        this.textLabel.align = "center";
        this.textLabel.text = "我是要被复制的文字，点按钮后粘贴试试";
        Laya.stage.addChild(this.textLabel);
        this.clipBtn = new Laya.Button();
        this.clipBtn.y = 160;
        this.clipBtn.x = 200;
        this.clipBtn.label = "点我复制";
        this.clipBtn.labelSize = 30;
        this.clipBtn.labelColors = "#fff,#fff,#fff";
        this.clipBtn.stateNum = 1;
        this.clipBtn.size(180, 40);
        this.clipBtn.graphics.drawRect(0, 0, 180, 40, "#ff0000");
        Laya.stage.addChild(this.clipBtn);
    };
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map