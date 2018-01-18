// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        this.btnSkin = 'res/btn_upload.png';
        Laya.init(750, 1000);
        Laya.loader.load([this.btnSkin], Laya.Handler.create(this, this.assetsLoaded));
    }
    GameMain.prototype.assetsLoaded = function () {
        this.btn = new Laya.Button(this.btnSkin);
        this.btn.stateNum = 1;
        this.btn.label = '';
        this.btn.pos(200, 200);
        Laya.stage.addChild(this.btn);
        this.uploader = new Uploader(this.btn);
    };
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map