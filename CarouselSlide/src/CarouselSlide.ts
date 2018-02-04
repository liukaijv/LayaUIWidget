enum CarouselDirection {
    left,
    right,
}

interface CarouselWidgetOptions {

    slideWidth?: number,
    //slide高度
    slideHeight?: number,

    //容器宽度
    containerWidth?: number;
    //容器高度
    containerHeight?: number;

    //点击区域
    hitAreaWidth?: number;
    //点击区域
    hitAreaHeight?: number;

    //每张缩放比例
    scaleRatio?: number;

    //动画速度
    moveSpeed?: number;

    //最小滑动距离
    swipeThreshold?: number;

    clickHandler?: (index: number) => void;
}

class CarouselWidget extends Laya.Sprite {

    // slides
    private slides = [];

    //容器
    private carouselWrap;

    private touchStartX;
    private touchStartY;

    //默认图片
    private defaultImg: Laya.Image;
    private defaultImgUrl: string = 'images/banner_default.png';

    //动画中
    private isAnimate: boolean = false;

    private option: CarouselWidgetOptions;

    private index: number = 0;

    public static DEFAULTS_OPTIONS: CarouselWidgetOptions = {
        slideWidth: 600,
        //slide高度
        slideHeight: 300,
        //容器宽度
        containerWidth: 750,
        //容器高度
        containerHeight: 350,
        //点击区域
        hitAreaWidth: 727,
        //点击区域
        hitAreaHeight: 270,
        //每张缩放比例
        scaleRatio: 0.7,
        //动画速度
        moveSpeed: 300,
        //最小滑动距离
        swipeThreshold: 100
    };

    constructor(private images: string[], option?: CarouselWidgetOptions) {
        super();
        if (option) {
            this.option = {...CarouselWidget.DEFAULTS_OPTIONS, ...option};
        } else {
            this.option = CarouselWidget.DEFAULTS_OPTIONS;
        }
        this.init();
        this.defaultImg = this.setDefaultImg();

        Laya.loader.load(this.images, Laya.Handler.create(this, this.onUIAssetsLoaded));

    }

    /**
     * 设置默认图片
     * @returns {Laya.Image}
     */
    private setDefaultImg() {
        let defaultImg = new Laya.Image(this.defaultImgUrl);
        defaultImg.pos((Laya.stage.width - this.option.slideWidth) / 2, 0);
        this.carouselWrap.addChild(defaultImg);
        return defaultImg;
    }

    /**
     * init
     */
    public init() {

        this.size(this.option.containerWidth, this.option.containerHeight);

        this.carouselWrap = new Laya.Panel();
        this.carouselWrap.size(this.option.containerWidth, this.option.containerHeight);

        this.addChild(this.carouselWrap);

    }


    /**
     * 资源加载完成
     */
    onUIAssetsLoaded(): void {

        let loaded = true;
        //laya loader没接口？，用这种方式判断图片是否加载
        for (let skin of this.images) {
            if (Laya.loader.getRes(skin) === undefined) {
                loaded = false;
                break;
            }
        }

        if (!loaded) {
            return;
        }

        //清空所有子元素
        this.carouselWrap.removeChildren();

        let img: Laya.Image,
            len: number = this.images.length;

        this.images.forEach((item, i) => {
            img = this.createSlideImage(item, i);
            this.carouselWrap.addChild(img);
        });

        //如果是偶数就多插入一项
        if (len % 2 === 0) {
            let lastSlide = this.createSlideImage(this.images[0], this.images.length);
            this.carouselWrap.addChild(lastSlide);
        }

        for (let i = 0; i < this.carouselWrap.numChildren; i++) {
            this.slides.push(this.carouselWrap.getChildAt(i));
        }

        //初始化位置
        this.initSlidesPosition();

        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);

    }

    /**
     * 创建图片
     * @param skin
     * @param itemIndex
     * @returns {Laya.Image}
     */
    private createSlideImage(skin: string, itemIndex: number): Laya.Image {
        let image: Laya.Image = new Laya.Image(skin);
        image.name = 'item' + itemIndex;
        let hitArea = new Laya.HitArea();
        hitArea.hit.drawRect(0, 0, this.option.hitAreaWidth, this.option.hitAreaHeight, "#000000");
        image.hitArea = hitArea;
        image.mouseEnabled = true;
        return image;
    }

    /**
     * 设置位置
     */
    private initSlidesPosition() {

        //第一项的位置
        let firstSlide = this.carouselWrap.getChildAt(0) as Laya.Image;
        firstSlide.width = this.option.slideWidth;
        firstSlide.height = this.option.slideHeight;
        firstSlide.x = (this.option.containerWidth - this.option.slideWidth) / 2;
        firstSlide.y = (this.option.containerHeight - this.option.slideHeight) / 2;
        firstSlide.zOrder = Math.floor(this.slides.length / 2);

        if (this.slides.length <= 1) {
            return;
        }

        //左右的位置
        let sliceSlides = this.slides.slice(1),
            sliceSize = sliceSlides.length / 2,
            rightSlice = sliceSlides.slice(0, sliceSize),
            leftSlide = sliceSlides.slice(sliceSize),
            level = Math.floor(this.slides.length / 2);

        let rw = this.option.slideWidth,
            rh = this.option.slideHeight,
            gap = (this.option.containerWidth - this.option.slideWidth) / 2 / level;


        let firstX = (this.option.containerWidth - this.option.slideWidth) / 2,
            fixOffsetLeft = firstX + rw;

        //右边的
        rightSlice.forEach((item, i) => {

            level--;
            rw = rw * this.option.scaleRatio;
            rh = rh * this.option.scaleRatio;
            let j = i;
            let slide = item as Laya.Image;

            slide.zOrder = level;
            slide.width = rw;
            slide.height = rh;
            slide.alpha = 1 / (++j);
            slide.x = fixOffsetLeft + (++i) * gap - rw;
            slide.y = (this.option.containerHeight - rh) / 2;

        });

        let rLast = rightSlice[rightSlice.length - 1] as Laya.Image,
            lw = rLast.width,
            lh = rLast.height,
            alphaLoop = Math.floor(this.slides.length / 2);

        // 左边的
        leftSlide.forEach((item, i) => {

            let slide = item as Laya.Image;

            slide.zOrder = i;
            slide.width = lw;
            slide.height = lh;
            slide.alpha = 1 / alphaLoop;
            slide.x = i * gap;
            slide.y = (this.option.containerHeight - lh) / 2;

            lw = lw / this.option.scaleRatio;
            lh = lh / this.option.scaleRatio;
            alphaLoop--;

        });

    }

    /**
     * 绑定按下事件
     * @param e
     */
    private onMouseDown(e: Laya.Event) {
        e.stopPropagation();
        if (this.isAnimate) {
            return;
        }
        this.touchStartX = e.stageX;
        this.touchStartY = e.stageY;

        this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);

    }

    /**
     * onMouseUp
     * @param e
     */
    private onMouseUp(e) {

        if (this.isAnimate) {
            return;
        }

        let touchEndX = e.stageX,
            touchEndY = e.stageY,
            distX = touchEndX - this.touchStartX,
            distY = touchEndY - this.touchStartY;

        //不是左右滑直接return
        if ((distX > distY && distX < distY) || (distX < distY && distX > -distY)) {
            return;
        }

        //点击
        if (Math.abs(distX) < 10 && this.option.clickHandler) {
            this.option.clickHandler(this.index);
        }

        //滑动范围大于预设值
        if (Math.abs(distX) > this.option.swipeThreshold) {
            if (distX < 0) {
                //右滑
                this.move(CarouselDirection.left);
            } else {
                //右滑
                this.move(CarouselDirection.right);
            }
        }

        this.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);

    }

    /**
     * 计算上一张
     * @param index
     * @returns {any}
     */
    private getPrevFromIndex(index: number) {

        let prevIndex = index - 1,
            len = this.slides.length;
        prevIndex = prevIndex < 0 ? len - 1 : prevIndex;
        return this.slides[prevIndex];

    }

    /**
     * 计算下一张
     * @param index
     * @returns {any}
     */
    private getNextFromIndex(index: number) {

        let nextIndex = index + 1,
            len = this.slides.length;
        nextIndex = nextIndex >= len ? 0 : nextIndex;

        return this.slides[nextIndex];

    }

    /**
     * 执行移动
     * @param dir
     */
    public move(dir: CarouselDirection) {

        this.computeIndex(dir);

        let zOrderArr = [];

        //左移动
        if (dir === CarouselDirection.left) {

            this.slides.forEach((item, i) => {

                let me = item as Laya.Image;

                let prev = this.getPrevFromIndex(i) as Laya.Image;
                zOrderArr.push(prev.zOrder);

                this.isAnimate = true;

                Laya.Tween.to(me, {
                    width: prev.width,
                    height: prev.height,
                    alpha: prev.alpha,
                    x: prev.x,
                    y: prev.y,
                }, this.option.moveSpeed, null, Laya.Handler.create(this, () => {
                    //动画后清空
                    this.isAnimate = false;
                    this.touchStartX = null;
                    this.touchStartY = null;
                }));
            });

            //调整层级
            this.slides.forEach((item, i) => {
                let me = item as Laya.Image;
                me.zOrder = zOrderArr[i];
            });

        }
        else if (dir === CarouselDirection.right) {

            this.slides.forEach((item, i) => {

                let me = item as Laya.Image;

                let next = this.getNextFromIndex(i) as Laya.Image;
                zOrderArr.push(next.zOrder);

                this.isAnimate = true;
                Laya.Tween.to(me, {
                    width: next.width,
                    height: next.height,
                    alpha: next.alpha,
                    x: next.x,
                    y: next.y,
                }, this.option.moveSpeed, null, Laya.Handler.create(this, () => {
                    //动画后清空
                    this.isAnimate = false;
                    this.touchStartX = null;
                    this.touchStartY = null;
                }));
            });

            //调整层级
            this.slides.forEach((item, i) => {
                let me = item as Laya.Image;
                me.zOrder = zOrderArr[i];
            });

        }

    }

    /**
     * 计算下标
     * @param dir
     */
    private computeIndex(dir: CarouselDirection): void {
        let len: number = this.images.length;
        if (dir === CarouselDirection.right) {
            this.index -= 1;
            if (this.index < 0) {
                this.index = len - 1;
            }
        } else {
            this.index += 1;
            if (this.index > len - 1) {
                this.index = 0;
            }
        }
    }

}

