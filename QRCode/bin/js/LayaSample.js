// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.init(750, 1334);
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignV = "middle";
        Laya.stage.alignH = "center";
        var image = new Laya.Image();
        image.centerX = 0;
        image.centerY = 0;
        Laya.stage.addChild(image);
        QRCode.toDataURL('http://www.baidu.com/', { width: 200, height: 200 }, function (err, url) {
            if (err) {
                console.log(err);
                return;
            }
            image.loadImage(url);
        });
    }
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map