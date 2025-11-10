import { Application, Sprite, Texture } from "pixi.js";

export class ARCameraMain {

    private _canvas_holder: HTMLDivElement;
    private _camera_video_dom: HTMLVideoElement;
    private _screen_frame_video_dom: HTMLVideoElement;

    private _camera_video_sprite: Sprite | null = null;
    private _screen_frame_video_sprite: Sprite | null = null;

    private _width: number;
    private _height: number;
    private _app: Application | null = null;
    

    constructor(canvas_holder: HTMLDivElement, camera_video_dom: HTMLVideoElement, screen_frame_video_dom: HTMLVideoElement) {
        this._canvas_holder = canvas_holder;
        this._camera_video_dom = camera_video_dom;
        this._screen_frame_video_dom = screen_frame_video_dom;
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

            this._camera_video_dom.srcObject = stream;
            this._camera_video_dom.muted = true;
            this._camera_video_dom.playsInline = true;

            await new Promise<void>((resolve) => {
                this._camera_video_dom.addEventListener('loadedmetadata', () => resolve(), { once: true });
            });

            await this._camera_video_dom.play();

            // Create video texture and sprite
            this._camera_video_sprite = this.setupVideoSprite(this._camera_video_dom);
            this._screen_frame_video_sprite = this.setupVideoSprite(this._screen_frame_video_dom);
        } catch (error ) {
            console.error('❌ Unexpected error:', error);
        }
    }

    private setupVideoSprite(video_dom: HTMLVideoElement) {
        if (!this._app) return null;

        // Create texture from video element
        const videoTexture = Texture.from(video_dom);
        const videoSprite = new Sprite(videoTexture);

        // Scale to cover the entire screen
        const scaleX = this._app.screen.width / video_dom.videoWidth;
        const scaleY = this._app.screen.height / video_dom.videoHeight;
        const scale = Math.max(scaleX, scaleY); // Use max to cover

        videoSprite.scale.set(scale);

        // Center the video
        videoSprite.x = (this._app.screen.width - video_dom.videoWidth * scale) / 2;
        videoSprite.y = (this._app.screen.height - video_dom.videoHeight * scale) / 2;

        this._app.stage.addChild(videoSprite);

        // Update texture each frame
        this._app.ticker.add(() => {
            videoTexture.source.update();
        });

        return videoSprite;
    }

    public async captureAsImage(): Promise<string> {
        if (!this._app) throw new Error('App not initialized');
    
        const base64 = await this._app.renderer.extract.base64(this._app.stage);
        return base64;
    }

    public dispose() {
        if (this._camera_video_dom && this._camera_video_dom.srcObject) {
            const stream = this._camera_video_dom.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            this._camera_video_dom.srcObject = null;
        }

        if (this._camera_video_sprite && this._app) {
            this._app.stage.removeChild(this._camera_video_sprite);
            this._camera_video_sprite.destroy();
            this._camera_video_sprite = null;
        }

        if (this._screen_frame_video_sprite && this._app) {
            this._app.stage.removeChild(this._screen_frame_video_sprite);
            this._screen_frame_video_sprite.destroy();
            this._screen_frame_video_sprite = null;
        }


        // Destroy the PixiJS application
        if (this._app) {
            this._app.destroy(true, {
                children: true,
                texture: true,
                textureSource: true
            });
            this._app = null;
        }
    }
}