/**
 * 轮播组件
 */
interface SlideOptions {
    //容器
    container?: Laya.Sprite,
    width?: number,
    height?: number,
    //循环滑动
    loop?: boolean,
    x?: number,
    y?: number,
    defaultImageUrl?: string,
    showDots?: boolean,
    showPager?: boolean,
    autoPlay?: boolean,
    speed?: number,
    delay?: number,
    //无限循环滑动
    infinite?: boolean,
    swipeThreshold?: number,
    clickHandler?: (index: number) => void
}

class SlideWidget extends Laya.Sprite {

    // 默认参数
    public static DEFAULTS_OPTIONS: SlideOptions = {
        container: null,
        width: 750,
        height: 300,
        infinite: true,
        x: 0,
        y: 0,
        //默认图片一定要预先加载,用来占位
        defaultImageUrl: 'images/banner_default.png',
        autoPlay: true,
        showDots: false,
        showPager: true,
        speed: 300,
        delay: 4000,
        swipeThreshold: 0.3
    };

    protected options: SlideOptions;

    private touchStartX: number = 0;

    private touchStartY: number = 0;

    private slideContainer: Laya.Sprite;

    private current: number = 0;

    private total: number = 0;

    private tween: Laya.Tween = new Laya.Tween();

    private pager: Laya.Label;

    private isAnimate: boolean = false;

    private isTouching: boolean = false;

    /**
     *
     * @param options
     */
    constructor(private images: string[], options?: SlideOptions) {
        super();
        if (options) {
            this.options = { ...SlideWidget.DEFAULTS_OPTIONS, ...options };
        } else {
            this.options = SlideWidget.DEFAULTS_OPTIONS;
        }
        this.init();
        // if (!images || images.length === 0) {
        //直接设置，不然加载图片过程中会空白
        this.setDefaultImage();
        // return;
        // }
        Laya.loader.load(this.images, Laya.Handler.create(this, this.onAssetsLoaded));

    }

    protected init() {

        let {width, height, x, y} = this.options;
        this.pos(x, y);
        this.size(width, height);
        if (this.options.container) {
            this.options.container.addChild(this);
        }

        this.slideContainer = new Laya.Sprite();

        this.slideContainer.size(width, height);
        this.slideContainer.pos(0, 0);
        this.addChild(this.slideContainer);
    }

    /**
     * 设置图片源
     * @param images
     */
    public setImages(images: string[]) {
        this.images = images;
        if (!this.images || this.images.length === 0) {
            this.setDefaultImage();
            return;
        }
        Laya.loader.load(this.images, Laya.Handler.create(this, this.onAssetsLoaded));
    }

    /**
     * 资源加载完成后初始化
     */
    private onAssetsLoaded() {

        this.images = this.images.filter(item => Laya.loader.getRes(item) !== undefined);

        this.total = this.images.length;

        //如果所有的图片都没下载成功，使用一张默认图，中断执行
        if (this.total === 0) {
            this.setDefaultImage();
            return;
        }

        //如果设置无限循环滑动
        if (this.options.infinite && this.total > 1) {
            this.initInfinite();
        }

        //清除掉默订的图
        this.slideContainer.removeChildren();

        this.slideContainer.width = this.options.width * this.total;

        this.createImages();

        if (this.total > 1) {
            if (this.options.showDots) {
                this.initDots();
            }

            if (this.options.showPager) {
                this.initPager();
            }

            this.bindEvents();

            if (this.options.autoPlay) {
                this.start();
            }
        }

    }

    //设置默认图片
    private setDefaultImage() {
        let defaultImg: Laya.Image = new Laya.Image(this.options.defaultImageUrl);
        defaultImg.size(this.options.width, this.options.height);
        defaultImg.pos((this.width - defaultImg.width) / 2, (this.height - defaultImg.height) / 2);
        this.slideContainer.removeChildren();
        this.slideContainer.addChild(defaultImg);
    }

    /**
     * 创建图片
     */
    private createImages() {

        this.images.forEach((skin, index) => {
            let image = new Laya.Image(skin);
            image.size(this.options.width, this.options.height);
            image.pos(index * this.options.width, 0);
            this.slideContainer.addChild(image);
        });

    }

    /**
     * 分页点点
     */
    private initDots() {

    }

    /**
     * 分页指示
     */
    private initPager() {
        if (!this.pager) {
            this.pager = new Laya.Label();
        }
        let width = 72, height = 40,
            right = 30, bottom = 20;

        this.pager.size(width, height);
        this.pager.valign = 'middle';
        this.pager.align = 'center';
        this.pager.color = '#fff';
        this.pager.fontSize = 26;
        this.pager.right = right;
        this.pager.bottom = bottom;

        let bg = new Laya.Box();
        bg.size(width, height);
        bg.graphics.drawRect(0, 0, width, height, '#000');
        bg.alpha = 0.4;
        bg.right = right;
        bg.bottom = bottom;

        this.addChild(bg);
        this.addChild(this.pager);
        this.setPagerNumber();
    }

    /**
     * 设置页面指示
     */
    private setPagerNumber() {
        if (this.pager) {
            //限循环滑动时的处理
            if (this.options.infinite) {
                let total = this.total - 2;
                let current = this.current;
                if (this.current > total) {
                    current = 1;
                }
                if (this.current < 1) {
                    current = total;
                }
                this.pager.changeText(current + '/' + total);
            } else {
                this.pager.changeText(this.current + 1 + '/' + this.total);
            }
        }
    }

    /**
     * 无限循环滑动时，多创建两项
     */
    private initInfinite() {
        let first = this.images.slice(0, 1);
        let last = this.images.slice(this.images.length - 1);
        this.images = [...last, ...this.images, ...first];

        //重设置一些值
        this.total = this.images.length;
        //应该是从第2张开始了
        this.current = 1;
        this.slideContainer.x = -(this.options.width * this.current);
    }

    /**
     * 绑定事件
     */
    private bindEvents() {
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        // Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    }

    private unbindEvents() {
        this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        // Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    }

    /**
     * touch down
     * @param e
     */
    private onMouseDown(e: Laya.Event) {
        //动画中啥也不做
        if (this.isAnimate) {
            return;
        }
        this.isTouching = true;
        if (this.options.autoPlay) {
            this.stop();
        }
        e.stopPropagation();

        //有touches就用touches里的
        let touches: any[] = e.touches;
        if (touches && touches.length) {
            this.touchStartX = touches[0].stageX;
            this.touchStartY = touches[0].stageY;
        } else {
            this.touchStartX = e.stageX;
            this.touchStartY = e.stageY;
        }
    }

    /**
     * touch move
     * @param e
     */
    private onMouseMove(e: Laya.Event) {
        //动画中啥也不做
        if (this.isAnimate || !this.isTouching) {
            return;
        }
        e.stopPropagation();

        let touchEndX = e.stageX,
            touchEndY = e.stageY,
            distX = touchEndX - this.touchStartX,
            distY = touchEndY - this.touchStartY;
        //不是左右滑直接return
        if ((distX > distY && distX < distY) || (distX < distY && distX > -distY)) {
            return;
        }
        //移动位置
        this.slideContainer.x = -(this.options.width * this.current) + distX;

    }

    /**
     * touch up
     * @param e
     */
    private onMouseUp(e: Laya.Event) {
        //动画中啥也不做
        if (this.isAnimate || !this.isTouching) {
            return;
        }
        this.isTouching = false;
        e.stopPropagation();

        let touchEndX = e.stageX,
            distX = touchEndX - this.touchStartX;

        //点击
        if (Math.abs(distX) < 10 && this.options.clickHandler) {
            this.options.clickHandler(this.current - 1);
        }

        //滑动范围大于预设值
        if (Math.abs(distX / this.options.width) > this.options.swipeThreshold) {
            if (distX < 0) {
                //右滑
                this.next();
            } else {
                //右滑
                this.prev();
            }
        } else {
            //动画回到最初
            let dist = this.options.width * this.current;
            //do animate
            this.animate(dist);
        }

    }

    /**
     * 执行移动
     * @param to
     */
    private move(to: number) {

        this.current = to;

        //如果自动轮播，先stop
        if (this.options.autoPlay) {
            this.stop();
        }

        if (!this.tween) {
            this.tween = new Laya.Tween();
        }
        let dist = this.options.width * this.current;
        this.animate(dist);

        //有分页指示，更新
        this.setPagerNumber();

    }

    /**
     * 执行动画
     * @param dist
     */
    private animate(dist: number) {
        this.isAnimate = true;
        //立即完成当前动画开始新的
        if (this.tween) {
            this.tween.complete();
            this.tween.to(this.slideContainer, {
                x: -dist
            }, this.options.speed, null, Laya.Handler.create(this, () => {
                this.isAnimate = false;
                //无限循环滑动处理
                if (this.options.infinite) {
                    //第0张，实际上是最后一张
                    if (this.current <= 0) {
                        this.slideContainer.x = -(this.options.width * (this.total - 2));
                        this.current = this.total - 2;
                    } else if (this.current >= this.total - 1) {
                        //最后一张实际上是最后一张
                        this.slideContainer.x = -(this.options.width * 1);
                        this.current = 1;
                    }
                }
                //完成动画开启自动播放
                if (this.options.autoPlay) {
                    this.start();
                }
            }));
        }
    }

    /**
     * 自动开始
     */
    private start() {
        Laya.timer.loop(this.options.delay, this, this.next);
    }

    /**
     * 停止定时器
     */
    private stop() {
        Laya.timer.clear(this, this.next);
    }

    /**
     * 下一张
     */
    public next() {
        let target = this.current + 1;
        //不是循环滑动，保持当前current
        if (target >= this.total) {
            if (this.options.loop || this.options.infinite) {
                target = 0;
            } else {
                target = this.total - 1;
            }
        }
        this.move(target);
    }

    /**
     * 上一张
     */
    public prev() {
        let target = this.current - 1;
        //不是循环滑动，保持当前current
        if (target < 0) {
            if (this.options.loop || this.options.infinite) {
                target = this.total - 1;
            } else {
                target = 0;
            }
        }
        this.move(target);
    }

    public dispose() {
        this.unbindEvents();
        this.slideContainer.destroy();
        this.destroy();
    }


}

