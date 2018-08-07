class Clipboard extends Laya.EventDispatcher {

    private clipboardJS: ClipboardJS;

    private fakeBtn: HTMLButtonElement;

    public static readonly EVENT_SUCCESS: string = "success";

    public static readonly EVENT_ERROR: string = "error";

    constructor(private triggerNode: any, private textHandler: () => string) {
        super();
        this.initBtn();
        this.initClipboardJS();
    }

    private initBtn() {

        this.fakeBtn = Laya.Browser.document.createElement('button');
        this.fakeBtn.style.position = 'absolute';
        this.fakeBtn.style.zIndex = Laya.Render.canvas.zIndex + 1;
        this.fakeBtn.style.opacity = '0';
        //设置位置和大小
        Laya.Utils.fitDOMElementInArea(this.fakeBtn, this.triggerNode, 0, 0, this.triggerNode.width, this.triggerNode.height);
        Laya.Browser.document.body.appendChild(this.fakeBtn);
    }

    private initClipboardJS() {
        this.clipboardJS = new ClipboardJS(this.fakeBtn, {
            text: this.textHandler
        }).on("success", (data) => {
            this.event(Clipboard.EVENT_SUCCESS, data.text);
        }).on("error", (data) => {
            this.event(Clipboard.EVENT_ERROR, data.text);
        });
    }

    public destroy() {
        if (this.fakeBtn) {
            Laya.Browser.document.body.removeChild(this.fakeBtn);
        }
        if (this.clipboardJS) {
            this.clipboardJS.destroy();
        }
    }

    public setTextHandler(handler: () => string) {
        this.textHandler = handler;
    }


}