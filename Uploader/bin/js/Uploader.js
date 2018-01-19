/**
 * 先吐槽一下，laya native不支持Blob,不支持FormData
 */
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var UploadType;
(function (UploadType) {
    UploadType[UploadType["Base64"] = 0] = "Base64";
    UploadType[UploadType["Binary"] = 1] = "Binary";
})(UploadType || (UploadType = {}));
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
var Uploader = /** @class */ (function (_super) {
    __extends(Uploader, _super);
    function Uploader(target, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.isNativeUpload = false;
        _this.uploading = false;
        _this.options = {
            serverUrl: '',
            keyName: 'file',
            uploadType: UploadType.Base64,
            maxSize: 200 * 1024,
        };
        _this.options = Object.assign(_this.options, opts);
        //有nativeUploadHandler表示使用native上传
        _this.isNativeUpload = _this.options.nativeUploadHandler && Laya.Render.isConchApp;
        if (!_this.isNativeUpload) {
            _this.createFileInput();
        }
        _this.bindEvents();
        return _this;
    }
    /**
     * createFileInput
     */
    Uploader.prototype.createFileInput = function () {
        if (!this._fileInput) {
            this._fileInput = Laya.Browser.document.createElement('input');
            this._fileInput.setAttribute('name', this.options.keyName);
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
    };
    /**
     * 根据laya元素调整input的位置
     */
    Uploader.prototype.updateInputPosition = function (offsetX, offsetY, target, width, height) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
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
    };
    /**
     * bindEvents
     */
    Uploader.prototype.bindEvents = function () {
        if (this.isNativeUpload) {
            this.target.on(Laya.Event.CLICK, this, this.nativeUpload);
        }
        else {
            this._fileInput.addEventListener('change', this.onChange.bind(this), true);
            /**
             * laya升级后用laya 的MOUSE_OVER和MOUSE_OUT不行
             */
            this._fileInput.addEventListener('mouseout', this.inputDisable.bind(this), true);
            this.target.on(Laya.Event.MOUSE_OVER, this, this.inputEnable);
        }
    };
    /**
     * unBindEvents
     */
    Uploader.prototype.unBindEvents = function () {
        if (this.isNativeUpload) {
            this.target.off(Laya.Event.CLICK, this, this.nativeUpload);
        }
        else {
            this._fileInput.removeEventListener('change', this.onChange);
            this._fileInput.removeEventListener('mouseout', this.inputDisable);
            this.target.off(Laya.Event.MOUSE_OVER, this, this.inputEnable);
        }
    };
    Uploader.prototype.onChange = function (e) {
        var _this = this;
        if (this.uploading) {
            return;
        }
        var file = e.target.files[0];
        if (!file) {
            console.log('no select file');
            return;
        }
        if (file.size > this.options.maxSize) {
            console.log("upload max size " + parseInt(String(this.options.maxSize / 1024)) + "k");
            return;
        }
        this.uploading = true;
        if (this.options.uploadType === UploadType.Base64) {
            this.readAsDataURL(file).then(this.upload.bind(this)).then(function (result) {
                _this.uploading = false;
                _this.event(Uploader.FILE_UPLOADED, [result]);
            }).catch(function (e) {
                console.log('upload error');
                _this.event(Uploader.FILE_UPLOAD_ERROR, [e]);
            });
        }
        else {
            this.readAsBinary(file).then(function (binary) { return _this.upload.bind(_this, binary, file.name); }).then(function (result) {
                _this.uploading = false;
                _this.event(Uploader.FILE_UPLOADED, [result]);
            }).catch(function (e) {
                console.log('upload error');
                _this.event(Uploader.FILE_UPLOAD_ERROR, [e]);
            });
        }
    };
    Uploader.prototype.inputEnable = function () {
        if (!this._fileInput) {
            return;
        }
        this._fileInput.disabled = false;
        this._fileInput.style.display = 'block';
    };
    Uploader.prototype.inputDisable = function () {
        if (!this._fileInput) {
            return;
        }
        this._fileInput.disabled = true;
        this._fileInput.style.display = 'none';
    };
    Uploader.prototype.upload = function (file, filename) {
        if (filename === void 0) { filename = 'test.png'; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var xhr, sendData, isBase64;
            return __generator(this, function (_a) {
                if (this.options.serverUrl === '') {
                    throw new Error('no server url');
                }
                xhr = new Laya.Browser.window.XMLHttpRequest();
                isBase64 = (typeof file === 'string' && (/:(.*?);/).test(file));
                // create promise handle the xhr
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState < 4) {
                                return;
                            }
                            if (xhr.readyState < 400) {
                                try {
                                    var res = JSON.parse(xhr.responseText);
                                    resolve(res);
                                }
                                catch (e) {
                                    reject(e);
                                }
                            }
                            else {
                                try {
                                    var err = JSON.parse(xhr.responseText);
                                    err.status = xhr.status;
                                    err.statusText = xhr.statusText;
                                    reject(err);
                                }
                                catch (e) {
                                    reject(e);
                                }
                            }
                        };
                        xhr.onerror = function () {
                            try {
                                var err = JSON.parse(xhr.responseText);
                                err.status = xhr.status;
                                err.statusText = xhr.statusText;
                                reject(err);
                            }
                            catch (e) {
                                reject(e);
                            }
                        };
                        xhr.open('POST', _this.options.serverUrl, true);
                        if (isBase64) {
                            sendData = _this.options.keyName + '=' + encodeURIComponent(file);
                            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            xhr.send(sendData);
                        }
                        else {
                            var crlf = '\r\n';
                            var boundary = "xixixixi";
                            var dashes = "--";
                            sendData = dashes + boundary + crlf +
                                "Content-Disposition: form-data;" +
                                "name=\"" + _this.options.keyName + "\";" +
                                "filename=\"" + encodeURIComponent(filename) + "\"" + crlf +
                                "Content-Type: application/octet-stream" + crlf + crlf +
                                file + crlf +
                                dashes + boundary + dashes;
                            xhr.setRequestHeader("Content-Type", "multipart/form-data;boundary=" + boundary);
                            xhr.sendAsBinary(sendData);
                        }
                    })];
            });
        });
    };
    /**
     * 文件
     * @param file
     */
    Uploader.prototype.readAsBinary = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._fileInput.disabled = true;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            _this._fileInput.disabled = false;
                            resolve(e.target.result);
                        };
                        reader.onerror = function (error) {
                            _this._fileInput.disabled = false;
                            reject(error);
                        };
                        reader.readAsBinaryString(file);
                    })];
            });
        });
    };
    /**
     * readAsDataURL
     * @param file
     */
    Uploader.prototype.readAsDataURL = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._fileInput.disabled = true;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            _this._fileInput.disabled = false;
                            resolve(e.target.result);
                        };
                        reader.onerror = function (error) {
                            _this._fileInput.disabled = true;
                            reject(error);
                        };
                        reader.readAsDataURL(file);
                    })];
            });
        });
    };
    /**
     * 原生上传
     */
    Uploader.prototype.nativeUpload = function () {
        var _this = this;
        if (this.uploading) {
            return;
        }
        this.uploading = true;
        if (this.options.nativeUploadHandler) {
            this.options.nativeUploadHandler().then(this.upload.bind(this)).then(function (result) {
                _this.uploading = false;
                _this.event(Uploader.FILE_UPLOADED, [result]);
            }).catch(function (e) {
                console.log('native upload error');
                _this.event(Uploader.FILE_UPLOAD_ERROR, [e]);
            });
        }
    };
    Uploader.prototype.destroy = function () {
        this.unBindEvents();
        if (this._fileInput) {
            Laya.Browser.document.body.removeChild(this._fileInput);
            this._fileInput = null;
        }
    };
    Uploader.FILE_UPLOADED = 'FILE_UPLOADED';
    Uploader.FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR';
    return Uploader;
}(Laya.EventDispatcher));
//# sourceMappingURL=Uploader.js.map