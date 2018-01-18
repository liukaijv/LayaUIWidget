/**
 * 先吐槽一下，laya native不支持Blob,不支持FormData
 */

enum UploadType {
    Base64,
    Binary
}

/**
 * https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#sendAsBinary()
 */
if (!Laya.Browser.window.XMLHttpRequest.prototype.sendAsBinary) {
    Laya.Browser.window.XMLHttpRequest.prototype.sendAsBinary = function (sData) {
        var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
        for (var nIdx = 0; nIdx < nBytes; nIdx++) {
            ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
        }
        this.send(ui8Data);
    };
}

class Uploader extends Laya.EventDispatcher {

    private _serverUrl: string = 'http://211.159.155.205:8080/poker.gm/upload.do';

    private _fileInput: HTMLInputElement;

    public static FILE_INPUT_NAME: string = 'file';

    public static FILE_UPLOADED: string = 'FILE_UPLOADED';

    private isNative: boolean = Laya.Render.isConchApp;

    private uploading: boolean = false;

    constructor(private target: Laya.Button, private uploadType: UploadType = UploadType.Base64) {
        super();
        if (!this.isNative) {
            this.createFileInput();
        }
        this.bindEvents();
    }

    /**
     * createFileInput
     */
    private createFileInput() {

        if (!this._fileInput) {
            this._fileInput = Laya.Browser.document.createElement('input');
            this._fileInput.setAttribute('name', Uploader.FILE_INPUT_NAME);
            this._fileInput.setAttribute('id', String(Laya.Utils.getGID()));
            this._fileInput.setAttribute('type', 'file');
            this._fileInput.setAttribute('accept', 'image/*');
            this._fileInput.style.position = 'absolute';
            this._fileInput.style.zIndex = Laya.Render.canvas.zIndex + 1;
            this._fileInput.style.overflow = 'hidden';
            this._fileInput.style.opacity = '0';
            //设置位置和大小
            this.updateInputPosition(0, 0);
            Laya.Browser.document.body.appendChild(this._fileInput);
            this.inputDisable();
        }

    }

    /**
     * 根据laya元素调整input的位置
     */
    public updateInputPosition(offsetX: number = 0, offsetY: number = 0, target?: any, width?: number, height?: number) {
        if (!this._fileInput) {
            return;
        }
        if (!target) {
            target = this.target;
        }
        if (!width) {
            width = this.target.width;
        }
        if (!height) {
            height = this.target.height;
        }
        Laya.Utils.fitDOMElementInArea(this._fileInput, target, offsetX, offsetY, width, height);
    }

    /**
     * bindEvents
     */
    private bindEvents() {
        if (this.isNative) {
            this.target.on(Laya.Event.CLICK, this, this.nativeUpload);
        } else {
            this._fileInput.addEventListener('change', this.onChange.bind(this), true);
            /**
             * laya升级后用laya 的MOUSE_OVER和MOUSE_OUT不行
             */
            this._fileInput.addEventListener('mouseout', this.inputDisable.bind(this), true);
            this.target.on(Laya.Event.MOUSE_OVER, this, this.inputEnable);
        }
    }

    /**
     * unBindEvents
     */
    private unBindEvents() {
        if (this.isNative) {
            this.target.off(Laya.Event.CLICK, this, this.nativeUpload);
        } else {
            this._fileInput.removeEventListener('change', this.onChange);
            this._fileInput.removeEventListener('mouseout', this.inputDisable);
            this.target.off(Laya.Event.MOUSE_OVER, this, this.inputEnable);
        }
    }

    private onChange(e: any) {
        if (this.uploading) {
            return;
        }
        let file = e.target.files[0];
        if (!file) {
            console.log('no select file');
            return;
        }
        if (this.uploadType === UploadType.Base64) {
            this.readAsDataURL(file).then(this.upload);
        } else {
            this.upload(file).then(result => {
                this.event(Uploader.FILE_UPLOADED, [result])
            });
        }

    }

    private inputEnable() {
        if (!this._fileInput) {
            return;
        }
        this._fileInput.disabled = false;
        this._fileInput.style.display = 'block';
    }

    private inputDisable() {
        if (!this._fileInput) {
            return;
        }
        this._fileInput.disabled = true;
        this._fileInput.style.display = 'none';
    }

    private async upload(file: any, filename: string = 'test.png') {
        this.uploading = true;
        if (!this._serverUrl) {
            throw new Error('no server url');
        }
        let xhr: XMLHttpRequest = new Laya.Browser.window.XMLHttpRequest();
        let sendData: any;
        let binaryData: any;
        let isBase64: boolean = (typeof file === 'string' && (/:(.*?);/).test(file));
        //以base64方式
        if (!isBase64) {
            //以二进制方式
            if (file.name) {
                filename = file.name;
                binaryData = await this.readAsBinary(file);
            } else {
                binaryData = file;
            }
        }

        // create promise handle the xhr
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState < 4) {
                    return;
                }
                if (xhr.readyState < 400) {
                    try {
                        let res = JSON.parse(xhr.responseText);
                        resolve(res);
                    } catch (e) {
                        console.log('upload error');
                        reject(e);
                    }
                    this.uploading = false;
                } else {
                    try {
                        let err = JSON.parse(xhr.responseText);
                        err.status = xhr.status;
                        err.statusText = xhr.statusText;
                        reject(err);
                    } catch (e) {
                        console.log('upload error');
                        reject(e);
                    }
                    this.uploading = false;
                }
            };
            xhr.onerror = () => {
                try {
                    let err = JSON.parse(xhr.responseText);
                    err.status = xhr.status;
                    err.statusText = xhr.statusText;
                    reject(err);
                } catch (e) {
                    console.log('upload error');
                    reject(e);
                }
                this.uploading = false;
            };
            xhr.open('POST', this._serverUrl, true);

            if (isBase64) {

                sendData = Uploader.FILE_INPUT_NAME + '=' + encodeURIComponent(file);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(sendData);

            } else {

                let crlf = '\r\n';
                let boundary = "xixixixi";
                let dashes = "--";
                let data = dashes + boundary + crlf +
                    "Content-Disposition: form-data;" +
                    "name=\"" + Uploader.FILE_INPUT_NAME + "\";" +
                    "filename=\"" + encodeURIComponent(filename) + "\"" + crlf +
                    "Content-Type: application/octet-stream" + crlf + crlf +
                    binaryData + crlf +
                    dashes + boundary + dashes;

                xhr.setRequestHeader("Content-Type", "multipart/form-data;boundary=" + boundary);

                (<any>xhr).sendAsBinary(data);
            }
        });

    }

    /**
     * 文件
     * @param file 
     */
    private async readAsBinary(file: any) {
        this._fileInput.disabled = true;
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = e => {
                this._fileInput.disabled = false;
                resolve((<any>e.target).result);
            };
            reader.onerror = error => {
                this._fileInput.disabled = false;
                reject(error);
            };
            reader.readAsBinaryString(file);
        });
    }

    /**
     * readAsDataURL
     * @param file 
     */
    private async readAsDataURL(file: any) {
        this._fileInput.disabled = true;
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = e => {
                this._fileInput.disabled = false
                resolve((<any>e.target).result);
            };
            reader.onerror = error => {
                this._fileInput.disabled = true;
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    private nativeUpload() {
        if (this.uploading) {
            return;
        }
    }

    public destroy() {
        this.unBindEvents();
        if (this._fileInput) {
            Laya.Browser.document.body.removeChild(this._fileInput);
            this._fileInput = null;
        }
    }

}