import { Application, Assets, Matrix, RenderTexture, Sprite, Texture, Text, type Renderer } from "pixi.js";
import type { PixiSpriteConfig } from "~/utility/sprite_type";


export class ARCameraMain {

    private _canvas_holder: HTMLDivElement;
    private _camera_video_dom: HTMLVideoElement;
    private _screen_frame_video_dom: HTMLVideoElement;

    private _camera_video_sprite: Sprite | null = null;
    private _screen_frame_video_sprite: Sprite | null = null;
    private _tree_camera_sprite: Sprite | null = null;
    private _tree_camera_text: Text | null = null;
    private _style: string;
    private _width: number;
    private _height: number;
    private _app: Application | null = null;
    
    constructor(canvas_holder: HTMLDivElement, camera_video_dom: HTMLVideoElement, screen_frame_video_dom: HTMLVideoElement, style: string) {
        this._canvas_holder = canvas_holder;
        this._camera_video_dom = camera_video_dom;
        this._screen_frame_video_dom = screen_frame_video_dom;
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._style = style;

        let _ = this._initialize();
    }

    private async _initialize() {
        const app = new Application();

        await app.init({
            background: '#000000',
            resizeTo: window,
            resolution: 1,
            autoDensity: true,
            preference: 'webgl',
        });

        this._app = app;
        this._canvas_holder.appendChild(app.canvas);
        app.canvas.style.position = 'absolute';
        app.canvas.style.zIndex = '0';

        const MAX_W = 1080;
        const MAX_H = 1920;
        const targetW = Math.min(window.innerWidth, MAX_W);
        const targetH = Math.min(window.innerHeight, MAX_H);
        app.renderer.resize(targetW, targetH);

        await Promise.all([this.setupWebcamTexture(app),
                            // this.setupFrameVideoTexture(),
                            this.setupScreenFrameSprite(app, `../screen_frames/screen_frame_${this._style}.png`, {z_index: 2, scale: 1.2 } ),
                            this.setupFrameSprite(app, '../images/05_xmastree_targetframe_with_take_picture.png', {z_index: 1, scale: 0.3 } ) ]);
    }

    private async setupWebcamTexture(app: Application<Renderer>) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                width: {ideal: 1920}, height: {ideal: 1440},
                aspectRatio: { ideal: 1.333 },
                facingMode: 'environment' }
            });

            this._camera_video_dom.srcObject = stream;
            this._camera_video_dom.muted = true;
            this._camera_video_dom.playsInline = true;

            await new Promise<void>((resolve) => {
                this._camera_video_dom.addEventListener('loadedmetadata', () => resolve(), { once: true });
            });
            
            await this._camera_video_dom.play();

            const containerWidth = this._canvas_holder.clientWidth;
            const containerHeight = this._canvas_holder.clientHeight;

            // Resize PixiJS app to match video
            app.renderer.resize(containerWidth, containerHeight);

            // Create video texture and sprite
            this._camera_video_sprite = await this.setupVideoSprite(this._camera_video_dom, 0);
        } catch (error ) {
            console.error('❌ Unexpected error:', error);
        }
    }

    private async setupFrameVideoTexture() {
            this._screen_frame_video_dom.currentTime = 0; // Reset to start
            await this._screen_frame_video_dom.play();
            this._screen_frame_video_sprite = this.setupVideoSprite(this._screen_frame_video_dom, 2);
    }

    private setupVideoSprite(video_dom: HTMLVideoElement, z_index :number) {
        if (!this._app) return null;

        // Create texture from video element
        const videoTexture = Texture.from(video_dom);
        if (videoTexture.source.resource) {
             // @ts-ignore - Typescript might complain depending on version, but this property exists
             videoTexture.source.autoUpdate = true; 
        }

        const videoSprite = new Sprite(videoTexture);
        videoSprite.zIndex = z_index;

        // Scale to cover the entire screen
        const scaleX = this._app.screen.width / video_dom.videoWidth;
        const scaleY = this._app.screen.height / video_dom.videoHeight;
        const scale = Math.max(scaleX, scaleY); // Use max to cover
        
        videoSprite.scale.set(scale);

        // Center the video
        videoSprite.x = (this._app.screen.width - video_dom.videoWidth * scale) / 2;
        videoSprite.y = (this._app.screen.height - video_dom.videoHeight * scale) / 2;

        this._app.stage.addChild(videoSprite);
        return videoSprite;
    }

    private async setupFrameSprite(app: Application<Renderer>, texture_path: string, sprite_config: PixiSpriteConfig) {
        const texture = await Assets.load(texture_path);
        const sprite = new Sprite(texture);

        sprite.zIndex = sprite_config.z_index;        
        sprite.scale.set(sprite_config.scale);
        sprite.x = (app.screen.width - sprite.getSize().width) / 2;
        sprite.y = ( (app.screen.height - sprite.getSize().height) / 2) + 30;

        const hint_text = new Text({
            text: '請對準聖誕樹',
            style: {
            fill: '#ffffff',
            fontSize: 12,
        }});
        hint_text.resolution = 2;
        hint_text.zIndex = sprite_config.z_index + 1;        

        hint_text.x = (app.screen.width - hint_text.getSize().width) / 2;
        hint_text.y = (sprite.y) -20;

        const logo_texture = await Assets.load('../images/right_corner.png');
        const logo_sprite = new Sprite(logo_texture);
        logo_sprite.zIndex = sprite_config.z_index + 10;
        logo_sprite.x = app.screen.width - logo_sprite.getSize().width;
        logo_sprite.y = 0;

        app.stage.addChild(sprite);
        app.stage.addChild(hint_text);
        app.stage.addChild(logo_sprite);

        this._tree_camera_text = hint_text;
        this._tree_camera_sprite = sprite;
        return sprite;
    }

    private async setupScreenFrameSprite(app: Application<Renderer>, texture_path: string, sprite_config: PixiSpriteConfig) {
        const texture = await Assets.load(texture_path);
        texture.source.autoGenerateMipmaps = false;
        texture.source.scaleMode = 'linear';
        texture.source.anisotropicLevel = 8;
        texture.update();

        const sprite = new Sprite(texture);
        sprite.zIndex = sprite_config.z_index + 1;     
        const scaleX = app.screen.width / sprite.width;
        const scaleY = app.screen.height / sprite.height;
        const scale = Math.max(scaleX, scaleY); // Use max to cover

        sprite.scale.set(scale);
        sprite.x = (app.screen.width - sprite.getSize().width) / 2;
        sprite.y = (app.screen.height - sprite.getSize().height) / 2;

        // // 1. Reset position to top-left corner
        // sprite.x = 0;
        // sprite.y = 0;

        // // 2. Force the width and height to match the screen exactly
        // // PixiJS will automatically calculate the necessary scale.x and scale.y to make this happen
        // sprite.width = app.screen.width;
        // sprite.height = app.screen.height;

        app.stage.addChild(sprite);
        this._screen_frame_video_sprite = sprite;
        return sprite;
    }

    public async captureAsImage(maxLongSide = 1280): Promise<string> {
        if (!this._app) throw new Error("App not initialized");
        if (!this._tree_camera_sprite) throw new Error("Tree camera sprite not initialized");

        const app = this._app;

        // Hide overlay while capturing
        this._tree_camera_sprite.visible = false;

        if (this._tree_camera_text != null)
            this._tree_camera_text.visible = false;

        const TARGET_SHORT_SIDE = 1080;
        let targetWidth, targetHeight, scaleFactor;

        scaleFactor = TARGET_SHORT_SIDE / app.screen.width;
        targetWidth = TARGET_SHORT_SIDE;
        targetHeight = Math.round(app.screen.height * scaleFactor);

        const rt = RenderTexture.create({ 
            width: targetWidth, 
            height: targetHeight 
        });

        app.renderer.render({
            container: app.stage, // what to render
            target: rt,           // where to render (RenderTexture)
            clear: true,
        });

        // Extract as base64 from the smaller RT
        const base64 = await app.renderer.extract.base64({
            target: rt,
            format: 'jpg',
            quality: 0.95
        });

        // Cleanup & restore
        rt.destroy(true);
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

        if (this._tree_camera_sprite && this._app) {
            this._app.stage.removeChild(this._tree_camera_sprite);
            this._tree_camera_sprite.destroy();
            this._tree_camera_sprite = null;
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