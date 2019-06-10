import ASSETS from '../../res/index.js';

const RETRY_TIMEOUT = 3000;

const Route = async() => {
    let template = await fetch('routes/preloader/index.html');
    template = await template.text();

    return {
        data: function(){
            return {
                percentCompletedImages: 0,
                percentCompletedMusic: 0,
                percentCompletedSoundFX: 0
            }
        },
        template,
        mounted: function(){
            this.preload();
        },
        methods: {
            getPercentComplete(){
                return ((this.percentCompletedImages + this.percentCompletedMusic + this.percentCompletedSoundFX) / 3) * 100;
            },

            async preload(){
                await this.preloadImages();
                await this.preloadAudio(ASSETS.audio.music, this.$root.audio.music);
                await this.preloadAudio(ASSETS.audio.sfx, this.$root.audio.soundFX);
                
                this.$root.preloadComplete();
            },

            async preloadImages(){
                let loaded = 0;
                return new Promise((resolve, reject) => {
                    for(let img of ASSETS.images){
                        this.preloadImage(img).then(() => {
                            loaded++;
                            this.percentCompletedImages = loaded / ASSETS.images.length;

                            if(this.percentCompletedImages >= 1) resolve();
                        });
                    }
                }, this.preloadImages);
            },

            async preloadImage(src){
                return new Promise((resolve, reject) => {
                    let img = new Image();
                    img.onload = () => {
                        resolve();
                    }

                    img.onerror = () => {
                        reject();
                    }
                    
                    img.src = src;
                }, () => {
                    this.preloadImage(src)
                });
            },

            async preloadAudio(assets, containerObj){
                let loaded = 0;
                let failed = false;

                return new Promise((resolve, reject) => {
                    for(let sound of assets){
                        let name = sound.split("/").pop().replace(".mp3", "");
                         
                        containerObj[name] = new Howl({
                            src: [sound], 
                            onload: () => {
                                loaded++;

                                if(assets === ASSETS.audio.music){
                                    this.percentCompletedMusic = loaded / assets.length;
                                    if(this.percentCompletedMusic >= 1) resolve();
                                }else{
                                    this.percentCompletedSoundFX = loaded / assets.length;
                                    if(this.percentCompletedSoundFX >= 1) resolve();
                                }
                            },
                            onloaderror: () => {
                                if(failed) return;
                                failed = true;

                                window.setTimeout(() => {
                                    this.preloadAudio(assets, containerObj);
                                }, RETRY_TIMEOUT);
                            }
                        });
                    }
                }, this.preloadAudio);
            },

        }
    }
}

export default Route;