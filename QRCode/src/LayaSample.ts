// 程序入口
class GameMain {
    constructor() {
        Laya.init(750, 1334);

        Laya.stage.scaleMode = "showall";
        Laya.stage.alignV = "middle";
        Laya.stage.alignH = "center";

        let image = new Laya.Image();
        image.centerX = 0;
        image.centerY = 0;
        Laya.stage.addChild(image);

        QRCode.toDataURL('http://www.baidu.com/', {width: 200, height: 200},
            (err, url) => {
                if (err) {
                    console.log(err);
                    return;
                }
                image.loadImage(url);
            }
        )
    }
}
new GameMain();