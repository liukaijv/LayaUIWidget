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
var Clipboard = /** @class */ (function (_super) {
    __extends(Clipboard, _super);
    function Clipboard(triggerNode, textHandler) {
        var _this = _super.call(this) || this;
        _this.triggerNode = triggerNode;
        _this.textHandler = textHandler;
        _this.initBtn();
        _this.initClipboardJS();
        return _this;
    }
    Clipboard.prototype.initBtn = function () {
        this.fakeBtn = Laya.Browser.document.createElement('button');
        this.fakeBtn.style.position = 'absolute';
        this.fakeBtn.style.zIndex = Laya.Render.canvas.zIndex + 1;
        this.fakeBtn.style.opacity = '0';
        //设置位置和大小
        Laya.Utils.fitDOMElementInArea(this.fakeBtn, this.triggerNode, 0, 0, this.triggerNode.width, this.triggerNode.height);
        Laya.Browser.document.body.appendChild(this.fakeBtn);
    };
    Clipboard.prototype.initClipboardJS = function () {
        var _this = this;
        this.clipboardJS = new ClipboardJS(this.fakeBtn, {
            text: this.textHandler
        }).on("success", function (data) {
            _this.event(Clipboard.EVENT_SUCCESS, data.text);
        }).on("error", function (data) {
            _this.event(Clipboard.EVENT_ERROR, data.text);
        });
    };
    Clipboard.prototype.destroy = function () {
        if (this.fakeBtn) {
            Laya.Browser.document.body.removeChild(this.fakeBtn);
        }
        if (this.clipboardJS) {
            this.clipboardJS.destroy();
        }
    };
    Clipboard.prototype.setTextHandler = function (handler) {
        this.textHandler = handler;
    };
    Clipboard.EVENT_SUCCESS = "success";
    Clipboard.EVENT_ERROR = "error";
    return Clipboard;
}(Laya.EventDispatcher));
//# sourceMappingURL=Clipboard.js.map