var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var SlideWidget = /** @class */ (function (_super) {
    __extends(SlideWidget, _super);
    /**
     *
     * @param options
     */
    function SlideWidget(images, options) {
        var _this = _super.call(this) || this;
        _this.images = images;
        _this.touchStartX = 0;
        _this.touchStartY = 0;
        _this.current = 0;
        _this.total = 0;
        _this.tween = new Laya.Tween();
        _this.isAnimate = false;
        _this.isTouching = false;
        if (options) {
            _this.options = __assign({}, SlideWidget.DEFAULTS_OPTIONS, options);
        }
        else {
            _this.options = SlideWidget.DEFAULTS_OPTIONS;
        }
        _this.init();
        // if (!images || images.length === 0) {
        //直接设置，不然加载图片过程中会空白
        _this.setDefaultImage();
        // return;
        // }
        Laya.loader.load(_this.images, Laya.Handler.create(_this, _this.onAssetsLoaded));
        return _this;
    }
    SlideWidget.prototype.init = function () {
        var _a = this.options, width = _a.width, height = _a.height, x = _a.x, y = _a.y;
        this.pos(x, y);
        this.size(width, height);
        if (this.options.container) {
            this.options.container.addChild(this);
        }
        this.slideContainer = new Laya.Sprite();
        this.slideContainer.size(width, height);
        this.slideContainer.pos(0, 0);
        this.addChild(this.slideContainer);
    };
    /**
     * 设置图片源
     * @param images
     */
    SlideWidget.prototype.setImages = function (images) {
        this.images = images;
        if (!this.images || this.images.length === 0) {
            this.setDefaultImage();
            return;
        }
        Laya.loader.load(this.images, Laya.Handler.create(this, this.onAssetsLoaded));
    };
    /**
     * 资源加载完成后初始化
     */
    SlideWidget.prototype.onAssetsLoaded = function () {
        this.images = this.images.filter(function (item) { return Laya.loader.getRes(item) !== undefined; });
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
    };
    //设置默认图片
    SlideWidget.prototype.setDefaultImage = function () {
        var defaultImg = new Laya.Image(this.options.defaultImageUrl);
        defaultImg.size(this.options.width, this.options.height);
        defaultImg.pos((this.width - defaultImg.width) / 2, (this.height - defaultImg.height) / 2);
        this.slideContainer.removeChildren();
        this.slideContainer.addChild(defaultImg);
    };
    /**
     * 创建图片
     */
    SlideWidget.prototype.createImages = function () {
        var _this = this;
        this.images.forEach(function (skin, index) {
            var image = new Laya.Image(skin);
            image.size(_this.options.width, _this.options.height);
            image.pos(index * _this.options.width, 0);
            _this.slideContainer.addChild(image);
        });
    };
    /**
     * 分页点点
     */
    SlideWidget.prototype.initDots = function () {
    };
    /**
     * 分页指示
     */
    SlideWidget.prototype.initPager = function () {
        if (!this.pager) {
            this.pager = new Laya.Label();
        }
        var width = 72, height = 40, right = 30, bottom = 20;
        this.pager.size(width, height);
        this.pager.valign = 'middle';
        this.pager.align = 'center';
        this.pager.color = '#fff';
        this.pager.fontSize = 26;
        this.pager.right = right;
        this.pager.bottom = bottom;
        var bg = new Laya.Box();
        bg.size(width, height);
        bg.graphics.drawRect(0, 0, width, height, '#000');
        bg.alpha = 0.4;
        bg.right = right;
        bg.bottom = bottom;
        this.addChild(bg);
        this.addChild(this.pager);
        this.setPagerNumber();
    };
    /**
     * 设置页面指示
     */
    SlideWidget.prototype.setPagerNumber = function () {
        if (this.pager) {
            //限循环滑动时的处理
            if (this.options.infinite) {
                var total = this.total - 2;
                var current = this.current;
                if (this.current > total) {
                    current = 1;
                }
                if (this.current < 1) {
                    current = total;
                }
                this.pager.changeText(current + '/' + total);
            }
            else {
                this.pager.changeText(this.current + 1 + '/' + this.total);
            }
        }
    };
    /**
     * 无限循环滑动时，多创建两项
     */
    SlideWidget.prototype.initInfinite = function () {
        var first = this.images.slice(0, 1);
        var last = this.images.slice(this.images.length - 1);
        this.images = last.concat(this.images, first);
        //重设置一些值
        this.total = this.images.length;
        //应该是从第2张开始了
        this.current = 1;
        this.slideContainer.x = -(this.options.width * this.current);
    };
    /**
     * 绑定事件
     */
    SlideWidget.prototype.bindEvents = function () {
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        // Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    };
    SlideWidget.prototype.unbindEvents = function () {
        this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        // Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    };
    /**
     * touch down
     * @param e
     */
    SlideWidget.prototype.onMouseDown = function (e) {
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
        var touches = e.touches;
        if (touches && touches.length) {
            this.touchStartX = touches[0].stageX;
            this.touchStartY = touches[0].stageY;
        }
        else {
            this.touchStartX = e.stageX;
            this.touchStartY = e.stageY;
        }
    };
    /**
     * touch move
     * @param e
     */
    SlideWidget.prototype.onMouseMove = function (e) {
        //动画中啥也不做
        if (this.isAnimate || !this.isTouching) {
            return;
        }
        e.stopPropagation();
        var touchEndX = e.stageX, touchEndY = e.stageY, distX = touchEndX - this.touchStartX, distY = touchEndY - this.touchStartY;
        //不是左右滑直接return
        if ((distX > distY && distX < distY) || (distX < distY && distX > -distY)) {
            return;
        }
        //移动位置
        this.slideContainer.x = -(this.options.width * this.current) + distX;
    };
    /**
     * touch up
     * @param e
     */
    SlideWidget.prototype.onMouseUp = function (e) {
        //动画中啥也不做
        if (this.isAnimate || !this.isTouching) {
            return;
        }
        this.isTouching = false;
        e.stopPropagation();
        var touchEndX = e.stageX, distX = touchEndX - this.touchStartX;
        //滑动范围大于预设值
        if (Math.abs(distX / this.options.width) > this.options.swipeThreshold) {
            if (distX < 0) {
                //右滑
                this.next();
            }
            else {
                //右滑
                this.prev();
            }
        }
        else {
            //动画回到最初
            var dist = this.options.width * this.current;
            //do animate
            this.animate(dist);
        }
    };
    /**
     * 执行移动
     * @param to
     */
    SlideWidget.prototype.move = function (to) {
        this.current = to;
        //如果自动轮播，先stop
        if (this.options.autoPlay) {
            this.stop();
        }
        if (!this.tween) {
            this.tween = new Laya.Tween();
        }
        var dist = this.options.width * this.current;
        this.animate(dist);
        //有分页指示，更新
        this.setPagerNumber();
    };
    /**
     * 执行动画
     * @param dist
     */
    SlideWidget.prototype.animate = function (dist) {
        var _this = this;
        this.isAnimate = true;
        //立即完成当前动画开始新的
        if (this.tween) {
            this.tween.complete();
            this.tween.to(this.slideContainer, {
                x: -dist
            }, this.options.speed, null, Laya.Handler.create(this, function () {
                _this.isAnimate = false;
                //无限循环滑动处理
                if (_this.options.infinite) {
                    //第0张，实际上是最后一张
                    if (_this.current <= 0) {
                        _this.slideContainer.x = -(_this.options.width * (_this.total - 2));
                        _this.current = _this.total - 2;
                    }
                    else if (_this.current >= _this.total - 1) {
                        //最后一张实际上是最后一张
                        _this.slideContainer.x = -(_this.options.width * 1);
                        _this.current = 1;
                    }
                }
                //完成动画开启自动播放
                if (_this.options.autoPlay) {
                    _this.start();
                }
            }));
        }
    };
    /**
     * 自动开始
     */
    SlideWidget.prototype.start = function () {
        Laya.timer.loop(this.options.delay, this, this.next);
    };
    /**
     * 停止定时器
     */
    SlideWidget.prototype.stop = function () {
        Laya.timer.clear(this, this.next);
    };
    /**
     * 下一张
     */
    SlideWidget.prototype.next = function () {
        var target = this.current + 1;
        //不是循环滑动，保持当前current
        if (target >= this.total) {
            if (this.options.loop || this.options.infinite) {
                target = 0;
            }
            else {
                target = this.total - 1;
            }
        }
        this.move(target);
    };
    /**
     * 上一张
     */
    SlideWidget.prototype.prev = function () {
        var target = this.current - 1;
        //不是循环滑动，保持当前current
        if (target < 0) {
            if (this.options.loop || this.options.infinite) {
                target = this.total - 1;
            }
            else {
                target = 0;
            }
        }
        this.move(target);
    };
    SlideWidget.prototype.dispose = function () {
        this.unbindEvents();
        this.slideContainer.destroy();
        this.destroy();
    };
    // 默认参数
    SlideWidget.DEFAULTS_OPTIONS = {
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
    return SlideWidget;
}(Laya.Sprite));
//# sourceMappingURL=SlideWidget.js.map