const RtspServer = require('rtsp-streaming-server').default;
const child_process = require('child_process');

class Server {
    static get IsWindows() { return process.platform === "win32"; }
    static start = async () => {

        let proc = null;
        try {
            this.server = new RtspServer({
                serverPort: 5554,
                clientPort: 6554,
                rtpPortStart: 10000,
                rtpPortCount: 10000
            });
            await this.server.start();
            await this.delay(2000);
            console.log("ffmpeg Starting");
            proc = await this.ffmpeg();
        } catch (ex) {
            console.log(ex);
        }
    }

    static guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static ffmpeg = async () => {
        let streamId = this.guid();
        console.log(`RTSP: rtsp://127.0.0.1:6554/${streamId}`);
        return child_process.exec(`ffmpeg -re -stream_loop -1 -i abc.mp4 -c copy -f rtsp rtsp://127.0.0.1:5554/${streamId}`);
    }

    static delay = async (ms) => {
        return new Promise((res) => setTimeout(res, ms));
    }
}

Server.start();