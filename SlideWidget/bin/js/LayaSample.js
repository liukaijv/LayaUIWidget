// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.init(750, 1000);
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignV = "middle";
        Laya.stage.alignH = "middle";
        var images = [
            'images/1.jpg',
            'images/2.jpg',
            'images/3.jpg',
            'images/4.jpg',
        ];
        var slide = new SlideWidget(images, {
            width: 750,
            height: 400
        });
        Laya.stage.addChild(slide);
        // laya.debug.DebugTool.init();
        // laya.debug.DebugPanel.init();
    }
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map