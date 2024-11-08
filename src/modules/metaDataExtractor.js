import { useAppStore } from '../stores/appStore';
import { demuxer } from './webDemuxer.mjs';

const getMetaData = async () => {

    const app = useAppStore()  // Pinia store 

    // reset framecount for a new file
    app.set('frameCount', 0)
    app.set('fileInfo', null)

    try {
        app.log(`Loading Demuxer`)
        await demuxer.load(app.file);
        app.log(`Loading Stream Info`)
        let info = await demuxer.getAVStream();
        console.log('getAVStream', info)
        app.set('frameCount', Number(info.nb_frames))
        app.set('fileInfo', { ...info, name: app.file.name })

    } catch (error) {
        console.error('Failed to get file meta data:', error);
    }
}

export { getMetaData }