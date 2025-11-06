import { Application, Sprite, Texture } from "pixi.js";

export class ARCameraMain {

    private _canvas_holder: HTMLDivElement;
    private _videoDom: HTMLVideoElement;
    private _width: number;
    private _height: number;
    private _app: Application | null = null;

    constructor(canvas_holder: HTMLDivElement, videoDom: HTMLVideoElement) {
        this._canvas_holder = canvas_holder;
        this._videoDom = videoDom;
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        let _ = this._initialize();
    }

    private async _initialize() {
        await this.setupWebcamTexture();
    }

    private async setupWebcamTexture() {
        const app = new Application();

        await app.init({
            background: '#000000',
            resizeTo: window,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            preference: 'webgl',
        });
        this._app = app;
        this._canvas_holder.appendChild(app.canvas);
        app.canvas.style.position = 'absolute';
        app.canvas.style.zIndex = '0';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 720, height: 1280 }
            });

            this._videoDom.srcObject = stream;
            this._videoDom.muted = true;
            this._videoDom.playsInline = true;

            // Wait for video to be ready
            await this._videoDom.play();

            // Create video texture and sprite
            this.setupVideoSprite();

        } catch (error ) {
            console.error('❌ Unexpected error:', error);
        }
    }

    private setupVideoSprite() {
        if (!this._app) return;

        // Create texture from video element
        const videoTexture = Texture.from(this._videoDom);
        const videoSprite = new Sprite(videoTexture);

        // Scale to cover the entire screen
        const scaleX = this._app.screen.width / this._videoDom.videoWidth;
        const scaleY = this._app.screen.height / this._videoDom.videoHeight;
        const scale = Math.max(scaleX, scaleY); // Use max to cover

        videoSprite.scale.set(scale);

        // Center the video
        videoSprite.x = (this._app.screen.width - this._videoDom.videoWidth * scale) / 2;
        videoSprite.y = (this._app.screen.height - this._videoDom.videoHeight * scale) / 2;

        this._app.stage.addChild(videoSprite);

        // Update texture each frame
        this._app.ticker.add(() => {
            videoTexture.source.update();
        });

    }

    public async captureAsImage(): Promise<string> {
        if (!this._app) throw new Error('App not initialized');
    
        const base64 = await this._app.renderer.extract.base64(this._app.stage);
        return base64;
    }

}