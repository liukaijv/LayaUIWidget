// 程序入口
class GameMain {

    private btnSkin:string = 'res/btn_upload.png';

    private uploader:Uploader;

    private btn:Laya.Button;

    constructor() {
        Laya.init(750, 1000);
       
       Laya.loader.load([this.btnSkin],Laya.Handler.create(this, this.assetsLoaded));

    }

    assetsLoaded(){
        this.btn = new Laya.Button(this.btnSkin);
        this.btn.stateNum = 1;
        this.btn.label = '';
        this.btn.pos(200, 200);
        Laya.stage.addChild(this.btn);

       this.uploader = new Uploader(this.btn);
        
    }

}
new GameMain();