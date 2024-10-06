import { WebDemuxer } from "web-demuxer"

// Setup WebDemuxer
// NOTE: this assumes that vite.config.mjs is configured
// to copy wasm files from node_modules/web-demuxer/dist/wasm-files/*
// into the public folder during the build process
const demuxer = new WebDemuxer({
    wasmLoaderPath: `${window.location.href}public/ffmpeg.js`
});

export { demuxer };
