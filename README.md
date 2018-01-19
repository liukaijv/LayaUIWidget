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

## 图片上传

### 演示地址

 [演示地址](http://www.noteliu.com/Uploader/bin/index.html)

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
Laya.stage.addChild(slide);
```

