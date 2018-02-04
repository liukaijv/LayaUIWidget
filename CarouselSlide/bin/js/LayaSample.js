// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.init(750, 1000);
        var images = [
            'images/1.jpg',
            'images/2.jpg',
            'images/3.jpg',
            'images/4.jpg',
            'images/5.jpg',
            'images/6.jpg',
            'images/7.jpg',
        ];
        var slide = new CarouselWidget(images, {
            clickHandler: function (index) {
                console.log('clicked: ' + index);
            }
        });
        slide.pos(0, 0);
        Laya.stage.addChild(slide);
    }
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map