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

