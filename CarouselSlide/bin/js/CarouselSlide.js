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
var CarouselDirection;
(function (CarouselDirection) {
    CarouselDirection[CarouselDirection["left"] = 0] = "left";
    CarouselDirection[CarouselDirection["right"] = 1] = "right";
})(CarouselDirection || (CarouselDirection = {}));
var CarouselWidget = /** @class */ (function (_super) {
    __extends(CarouselWidget, _super);
    function CarouselWidget(images, option) {
        var _this = _super.call(this) || this;
        _this.images = images;
        // slides
        _this.slides = [];
        _this.defaultImgUrl = 'images/banner_default.png';
        //动画中
        _this.isAnimate = false;
        _this.index = 0;
        if (option) {
            _this.option = __assign({}, CarouselWidget.DEFAULTS_OPTIONS, option);
        }
        else {
            _this.option = CarouselWidget.DEFAULTS_OPTIONS;
        }
        _this.init();
        _this.defaultImg = _this.setDefaultImg();
        Laya.loader.load(_this.images, Laya.Handler.create(_this, _this.onUIAssetsLoaded));
        return _this;
    }
    /**
     * 设置默认图片
     * @returns {Laya.Image}
     */
    CarouselWidget.prototype.setDefaultImg = function () {
        var defaultImg = new Laya.Image(this.defaultImgUrl);
        defaultImg.pos((Laya.stage.width - this.option.slideWidth) / 2, 0);
        this.carouselWrap.addChild(defaultImg);
        return defaultImg;
    };
    /**
     * init
     */
    CarouselWidget.prototype.init = function () {
        this.size(this.option.containerWidth, this.option.containerHeight);
        this.carouselWrap = new Laya.Panel();
        this.carouselWrap.size(this.option.containerWidth, this.option.containerHeight);
        this.addChild(this.carouselWrap);
    };
    /**
     * 资源加载完成
     */
    CarouselWidget.prototype.onUIAssetsLoaded = function () {
        var _this = this;
        var loaded = true;
        //laya loader没接口？，用这种方式判断图片是否加载
        for (var _i = 0, _a = this.images; _i < _a.length; _i++) {
            var skin = _a[_i];
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
        var img, len = this.images.length;
        this.images.forEach(function (item, i) {
            img = _this.createSlideImage(item, i);
            _this.carouselWrap.addChild(img);
        });
        //如果是偶数就多插入一项
        if (len % 2 === 0) {
            var lastSlide = this.createSlideImage(this.images[0], this.images.length);
            this.carouselWrap.addChild(lastSlide);
        }
        for (var i = 0; i < this.carouselWrap.numChildren; i++) {
            this.slides.push(this.carouselWrap.getChildAt(i));
        }
        //初始化位置
        this.initSlidesPosition();
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
    };
    /**
     * 创建图片
     * @param skin
     * @param itemIndex
     * @returns {Laya.Image}
     */
    CarouselWidget.prototype.createSlideImage = function (skin, itemIndex) {
        var image = new Laya.Image(skin);
        image.name = 'item' + itemIndex;
        var hitArea = new Laya.HitArea();
        hitArea.hit.drawRect(0, 0, this.option.hitAreaWidth, this.option.hitAreaHeight, "#000000");
        image.hitArea = hitArea;
        image.mouseEnabled = true;
        return image;
    };
    /**
     * 设置位置
     */
    CarouselWidget.prototype.initSlidesPosition = function () {
        var _this = this;
        //第一项的位置
        var firstSlide = this.carouselWrap.getChildAt(0);
        firstSlide.width = this.option.slideWidth;
        firstSlide.height = this.option.slideHeight;
        firstSlide.x = (this.option.containerWidth - this.option.slideWidth) / 2;
        firstSlide.y = (this.option.containerHeight - this.option.slideHeight) / 2;
        firstSlide.zOrder = Math.floor(this.slides.length / 2);
        if (this.slides.length <= 1) {
            return;
        }
        //左右的位置
        var sliceSlides = this.slides.slice(1), sliceSize = sliceSlides.length / 2, rightSlice = sliceSlides.slice(0, sliceSize), leftSlide = sliceSlides.slice(sliceSize), level = Math.floor(this.slides.length / 2);
        var rw = this.option.slideWidth, rh = this.option.slideHeight, gap = (this.option.containerWidth - this.option.slideWidth) / 2 / level;
        var firstX = (this.option.containerWidth - this.option.slideWidth) / 2, fixOffsetLeft = firstX + rw;
        //右边的
        rightSlice.forEach(function (item, i) {
            level--;
            rw = rw * _this.option.scaleRatio;
            rh = rh * _this.option.scaleRatio;
            var j = i;
            var slide = item;
            slide.zOrder = level;
            slide.width = rw;
            slide.height = rh;
            slide.alpha = 1 / (++j);
            slide.x = fixOffsetLeft + (++i) * gap - rw;
            slide.y = (_this.option.containerHeight - rh) / 2;
        });
        var rLast = rightSlice[rightSlice.length - 1], lw = rLast.width, lh = rLast.height, alphaLoop = Math.floor(this.slides.length / 2);
        // 左边的
        leftSlide.forEach(function (item, i) {
            var slide = item;
            slide.zOrder = i;
            slide.width = lw;
            slide.height = lh;
            slide.alpha = 1 / alphaLoop;
            slide.x = i * gap;
            slide.y = (_this.option.containerHeight - lh) / 2;
            lw = lw / _this.option.scaleRatio;
            lh = lh / _this.option.scaleRatio;
            alphaLoop--;
        });
    };
    /**
     * 绑定按下事件
     * @param e
     */
    CarouselWidget.prototype.onMouseDown = function (e) {
        e.stopPropagation();
        if (this.isAnimate) {
            return;
        }
        this.touchStartX = e.stageX;
        this.touchStartY = e.stageY;
        this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    };
    /**
     * onMouseUp
     * @param e
     */
    CarouselWidget.prototype.onMouseUp = function (e) {
        if (this.isAnimate) {
            return;
        }
        var touchEndX = e.stageX, touchEndY = e.stageY, distX = touchEndX - this.touchStartX, distY = touchEndY - this.touchStartY;
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
            }
            else {
                //右滑
                this.move(CarouselDirection.right);
            }
        }
        this.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    };
    /**
     * 计算上一张
     * @param index
     * @returns {any}
     */
    CarouselWidget.prototype.getPrevFromIndex = function (index) {
        var prevIndex = index - 1, len = this.slides.length;
        prevIndex = prevIndex < 0 ? len - 1 : prevIndex;
        return this.slides[prevIndex];
    };
    /**
     * 计算下一张
     * @param index
     * @returns {any}
     */
    CarouselWidget.prototype.getNextFromIndex = function (index) {
        var nextIndex = index + 1, len = this.slides.length;
        nextIndex = nextIndex >= len ? 0 : nextIndex;
        return this.slides[nextIndex];
    };
    /**
     * 执行移动
     * @param dir
     */
    CarouselWidget.prototype.move = function (dir) {
        var _this = this;
        this.computeIndex(dir);
        var zOrderArr = [];
        //左移动
        if (dir === CarouselDirection.left) {
            this.slides.forEach(function (item, i) {
                var me = item;
                var prev = _this.getPrevFromIndex(i);
                zOrderArr.push(prev.zOrder);
                _this.isAnimate = true;
                Laya.Tween.to(me, {
                    width: prev.width,
                    height: prev.height,
                    alpha: prev.alpha,
                    x: prev.x,
                    y: prev.y,
                }, _this.option.moveSpeed, null, Laya.Handler.create(_this, function () {
                    //动画后清空
                    _this.isAnimate = false;
                    _this.touchStartX = null;
                    _this.touchStartY = null;
                }));
            });
            //调整层级
            this.slides.forEach(function (item, i) {
                var me = item;
                me.zOrder = zOrderArr[i];
            });
        }
        else if (dir === CarouselDirection.right) {
            this.slides.forEach(function (item, i) {
                var me = item;
                var next = _this.getNextFromIndex(i);
                zOrderArr.push(next.zOrder);
                _this.isAnimate = true;
                Laya.Tween.to(me, {
                    width: next.width,
                    height: next.height,
                    alpha: next.alpha,
                    x: next.x,
                    y: next.y,
                }, _this.option.moveSpeed, null, Laya.Handler.create(_this, function () {
                    //动画后清空
                    _this.isAnimate = false;
                    _this.touchStartX = null;
                    _this.touchStartY = null;
                }));
            });
            //调整层级
            this.slides.forEach(function (item, i) {
                var me = item;
                me.zOrder = zOrderArr[i];
            });
        }
    };
    /**
     * 计算下标
     * @param dir
     */
    CarouselWidget.prototype.computeIndex = function (dir) {
        var len = this.images.length;
        if (dir === CarouselDirection.right) {
            this.index -= 1;
            if (this.index < 0) {
                this.index = len - 1;
            }
        }
        else {
            this.index += 1;
            if (this.index > len - 1) {
                this.index = 0;
            }
        }
    };
    CarouselWidget.DEFAULTS_OPTIONS = {
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
    return CarouselWidget;
}(Laya.Sprite));
//# sourceMappingURL=CarouselSlide.js.map