// 程序入口
class GameMain {
    constructor() {
        Laya.init(750, 1000);

        let images: string[] = [
            'images/1.jpg',
            'images/2.jpg',
            'images/3.jpg',
            'images/4.jpg',
            'images/5.jpg',
            'images/6.jpg',
            'images/7.jpg',
        ];
        let slide: CarouselWidget = new CarouselWidget(images, {
            clickHandler: (index) => {
                console.log('clicked: ' + index);
            }
        });

        slide.pos(0, 0);
        Laya.stage.addChild(slide);
    }
}
new GameMain();