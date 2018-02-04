# LayaUIWidget
Laya的一些UI小组件

## 轮播图

### 演示地址

 [演示地址](http://www.noteliu.com/LayaUIWidget/SlideWidget/bin/index.html)

### 使用说明

``` typescript
let images:string[] = [
            'images/1.jpg',
            'images/2.jpg',
            'images/3.jpg',
            'images/4.jpg',
        ];
let slide:SlideWidget = new SlideWidget(images, {
            width: 750,
            height: 400
        });
Laya.stage.addChild(slide);
```

## 旋转木马效果

### 演示地址

 [演示地址](http://www.noteliu.com/LayaUIWidget/CarouselSlide/bin/index.html)

### 使用说明

``` typescript
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
```

## 图片上传

微信浏览器或者PC浏览器上打开看一下

### 演示地址

 [演示地址](http://www.noteliu.com/LayaUIWidget/Uploader/bin/index.html)

### 使用说明

``` typescript
this.btn = new Laya.Button(this.btnSkin);
        this.btn.stateNum = 1;
        this.btn.label = '';
        this.btn.pos(200, 200);
        Laya.stage.addChild(this.btn);

        this.uploader = new Uploader(this.btn);

        this.uploader.on(Uploader.FILE_UPLOADED, this, result => {
            console.log(result);
        });
```

