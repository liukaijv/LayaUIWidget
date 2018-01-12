// 程序入口
class GameMain {
    constructor() {
        Laya.init(750, 1000);

        Laya.stage.scaleMode = "showall";

        Laya.stage.alignV = "middle";
        Laya.stage.alignH = "middle";

        let images: string[] = [
            'images/1.jpg',
            'images/2.jpg',
            'images/3.jpg',
            'images/4.jpg',
        ];
        let slide: SlideWidget = new SlideWidget(images, {
            width: 750,
            height: 400
        });
        Laya.stage.addChild(slide);
        // laya.debug.DebugTool.init();
        // laya.debug.DebugPanel.init();
    }
}
new GameMain();