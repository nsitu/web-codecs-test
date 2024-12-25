import { defineStore } from 'pinia';

// This store keeps track of the global status of the application
export const useAppStore = defineStore('appStore', {
    state: () => ({
        config: {},
        frameCount: 0,
        frameNumber: 0,
        useShortSide: true,
        crossSectionCount: 60,
        crossSectionType: 'plane', // plane, wave
        samplingMode: 'rows',       // rows, columns
        outputMode: 'rows',         // rows, columns
        tileMode: 'tile',           // tile, full
        tileProportion: 'square',       // square, landscape, portrait
        prioritize: 'quantity',         // quantity, quality
        readerIsFinished: false,
        fileInfo: null,
        samplePixelCount: 0, /** equals width or height depending on samplingMode */
        messages: [],
        status: {},
        pauseDecode: null,
        resumeDecode: null,
        blob: null,
        blobURL: null,
        fpsNow: 0,
        lastFPSUpdate: 0,
        timestamps: [],
        currentTab: '0',
        // Canvasses are
        // -provided by canvasPool
        // -populated with samples
        // -encoded into animations
        canvasses: {},
        tilePlan: {},
        blobs: {},
        // New properties for synchronization
        currentPlaybackTime: 0,
        isPlaying: false,
    }),
    actions: {
        set(key, value) {
            this[key] = value;
        },
        log(message) {
            this.messages.push(message);
        },
        allocateCanvas(tileNumber, canvas) {
            // initialize an array if needed for this particualr tileNumber
            this.canvasses[tileNumber] = this.canvasses[tileNumber] || [];
            this.canvasses[tileNumber].push(canvas);
        },
        createBlob(tileNumber, blob) {
            // Initialize the blob for the given tileNumber
            this.blobs[tileNumber] = blob;
        },
        setStatus(key, value) {
            this.status[key] = value;
        },
        initializeDecodeControl() {
            this.pauseDecode = new Promise(resolve => {
                this.resumeDecode = resolve;
            });
        },
        async pauseIfNeeded() {
            if (this.pauseDecode) {
                await this.pauseDecode;
            }
        },
        resumeDecoding() {
            if (this.resumeDecode) {
                // Resolve the promise to continue the process
                this.resumeDecode();
                // Reinitialize pause and resume promises
                this.initializeDecodeControl();
            }
        },
        // Playback control
        updatePlaybackState({ currentTime, playing }) {
            this.currentPlaybackTime = currentTime;
            this.isPlaying = playing;
        }
    },
    getters: {
        fps() {
            const now = performance.now();
            this.timestamps.push(now);
            if (this.timestamps.length > 150) this.timestamps.shift();
            if (now - this.lastFPSUpdate > 250) {
                this.lastFPSUpdate = now;
                if (this.timestamps.length > 1) {
                    const timeSpan = (this.timestamps[this.timestamps.length - 1] - this.timestamps[0]) / 1000;
                    this.fpsNow = (this.timestamps.length - 1) / timeSpan;
                }
            }
            return parseInt(this.fpsNow);
        }
    }
});