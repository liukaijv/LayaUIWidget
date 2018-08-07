declare namespace QRCode {

    interface  Options {
        width?: number;
        height?: number;
    }

    function toDataURL(content: string, options: Options, callback: (err, url: string) => void);

}

export = QRCode;

export as namespace QRCode;