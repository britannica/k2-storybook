// External Libraries
import '../lib/howler.min.js';
import Vue from '../lib/vue.esm.browser.min.js';
import VueRouter from '../lib/vue-router.esm.browser.js';

// Routes
import Preloader from '../routes/preloader/route.js';
import Title from '../routes/title/route.js';
import Game from '../routes/game/route.js';

// Styles
import ImportStyle from '../components/import-style.js';

import SpineWidget from '../components/spine-widget.js';

// Config
import Config from './config.js';
import Questions from './questions.js';

Vue.use(VueRouter, ImportStyle, SpineWidget);

let app = new Vue({
    template: `
        <div id="game-view" :style="container.style">
            <!-- Style -->    
            <import-style></import-style>

            <div id="view-container">
                <router-view></router-view>
            </div>
        </div>
    `,
    components: { ImportStyle, SpineWidget },
    router: new VueRouter({
        mode: 'abstract',
        transitionOnLoad: true,
        routes: [
            { path: '/', component: Preloader },
            { path: '/title', component: Title },
            { path: '/game', component: Game }
        ]
    }),
    data: {
        audio: {
            soundFX: [],
            music: []
        },
        config: Config,
        container: {
            style: {
                fontSize: 0
            }
        },
        currentPage: "",
        language: "en-US",
        isMusicPlaying: false,
        mutedMusic: false,
        mutedSFX: false,
        paused: false,
        popup: {
            open: false,
            message: ""
        },
        questions: Questions,
        state: {
            askedQuestions: []
        },
        showOptions: false,
        user: JSON.parse(JSON.stringify(Config.default))
    },
    mounted(){
        this.setupListeners();

        this.load();
    },
    methods: {
        load(){
            this.loadAudioState();
            this.detectLanguage();
            this.detectPause();
            this.$router.replace({ path: `/` }); // Navigate to preloader
        },

        unload(){
            this.removeListeners();
            this.stopAllMusic();
            this.stopAllSoundEffects();
        },

        preloadComplete(){
            // Load the state of where the player left off
            // this.loadState();

            // OR go directly to the title screen
            // this.navigate("game");
            this.navigate("title");
        },

        setupListeners(){
            // Listen for audio state changes
            window.addEventListener('audio-change', this.loadAudioState);
            
            // Listen for language changes
            window.addEventListener('language-change', this.detectLanguage);
            
            // Listen for pause changes
            window.addEventListener('pause-change', this.detectPause);

            // Listen for window resizes
            window.addEventListener('resize', this.resizeEvent);
            this.resizeEvent();

            // Listen for game unload
            window.addEventListener('destroy', () => {
                this.unload();
                app.$destroy();
            });
        },

        removeListeners(){
            window.removeEventListener('audio-change', this.loadAudioState);
            window.removeEventListener('language-change', this.detectLanguage);
            window.removeEventListener('pause-change', this.detectPause);
            window.removeEventListener('resize', this.resizeEvent);
        },

        resizeEvent(){
            let elContainer = this.$el;
            if(!elContainer) return;

            let width  = elContainer.parentElement.clientWidth,
                height = elContainer.parentElement.clientHeight;
            let maxWidth = 100;
            let fontSize = 16;
            let paddingTop = "";

            if (width / height > 16 / 9) {
                maxWidth = (height * (16 / 9)) + "px";
                fontSize *= (height * (16 / 9)) / 1024;
                paddingTop = "initial";
                height = "100%";
            } else {
                maxWidth = "100%";
                fontSize *= width / 1024;
                paddingTop = "56.25%";
                height = "initial";
            }

            this.container.style.fontSize = fontSize + "px";
            this.container.style.maxWidth = maxWidth;
            this.container.style.height = height;
            this.container.style.paddingTop = paddingTop;
        },

        detectLanguage(){
            this.language = sessionStorage.getItem("_eb_language") || "en-US";
        },

        detectPause(){
            this.paused = sessionStorage.getItem('_eb_pause') || false;
        },

        saveState(){
            let state = {
                currentPage: this.currentPage,
                user: this.user,
                askedQuestions: this.state.askedQuestions
            }

            // sessionStorage.setItem("_eb_game_state", JSON.stringify(state));
        },

        loadState(){
            let state = sessionStorage.getItem("_eb_game_state");

            if(state){
                state = JSON.parse(state);

                this.currentPage = state.currentPage || "title";
                this.user = state.user;
                this.state.askedQuestions = state.askedQuestions;
            }

            this.navigate(this.currentPage);
        },

        saveAudioState(){
            let state = {
                mutedMusic: this.mutedMusic,
                mutedSFX: this.mutedSFX
            }

            // localStorage.setItem("_eb_sound", JSON.stringify(state));
        },

        loadAudioState(){
            let state = sessionStorage.getItem("_eb_sound") == "true";
            if(!sessionStorage.getItem("_eb_sound")) state = true;

            this.muteMusic(!state);
            this.muteSFX(!state);

            // if(state){
            //     state = JSON.parse(state);

            //     this.mutedMusic = state.mutedMusic;
            //     this.mutedSFX = state.mutedSFX;
            // }
        },
        
        navigate(path = ""){
            this.stopAllSoundEffects();

            this.currentPage = path;
            this.$router.replace({ path: path });
            this.scrollToTop();

            this.saveState();

            if(path){
                // this.playMusic("music");
            }
        },

        playSoundFX(name, cancelOthers){
            try {
                if(cancelOthers) this.audio.soundFX[name].stop();
                
                this.audio.soundFX[name].play();
                this.audio.soundFX[name].mute(this.mutedSFX);
            }catch(e){
                console.error(e);
            }
        },

        playMusic(name){
            if(this.isMusicPlaying) return;

            try {
                this.audio.music[name].play();
                this.audio.music[name].volume(this.config.musicVolume);
                this.audio.music[name].loop(true);
                this.audio.music[name].mute(this.mutedMusic);
            }catch(e){
                console.error(e);
            }
            
            this.isMusicPlaying = true;
        },

        stopAllSoundEffects(){
            for (const sound of Object.values(this.audio.soundFX)) {
                sound.stop();
            }
        },

        stopAllMusic(){
            for (const sound of Object.values(this.audio.music)) {
                sound.stop();
            }
            
            this.isMusicPlaying = false;
        },

        reset(){
            this.user = JSON.parse(JSON.stringify(Config.default));
            this.currentPage = "title";
            this.state.askedQuestions = {};

            this.saveState();
            this.stopAllSoundEffects();
            this.stopAllMusic();
            
            this.navigate("title");
        },

        scrollToTop(){
            window.scrollTo(0, 0);
        },

        showPopupMessage(message = ""){
            this.popup.message = message;
            this.popup.open = true;
        },

        closePopup(){
            this.popup.open = false;
        },

        muteMusic(muted = !this.mutedMusic){
            this.mutedMusic = muted;
            this.saveAudioState();
            
            for (const sound of Object.values(this.audio.music)) {
                sound.mute(this.mutedMusic);
            }
        },

        muteSFX(muted = !this.mutedSFX){
            this.mutedSFX = muted;
            this.saveAudioState();
            
            for (const sound of Object.values(this.audio.soundFX)) {
                sound.mute(this.mutedSFX);
            }
        },

        toggleOptions(){
            this.showOptions = !this.showOptions;
        }
    }
}).$mount('#game');

// For global namespace
// window.fablevision_multichoice = app;