'use strict';

/**
 * videoクラス
 */
class Video {

    /**
     * コンストラクタ
     */
    constructor() {
        this._video = null;
        this._event = {};
    }

    /**
     * 動画を再生する
     * @param {Object} videoItem 動画情報
     */
    play(videoItem) {
        console.log('Play VIDEO=' + JSON.stringify(videoItem));
        return new Promise((resolve, reject) => {
            if (this._video && !this._video.paused) {
                resolve();
            }

            this._videoItem = videoItem;
            this._isEnded = false;

            document.getElementById('screen').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
            document.getElementById('currentTime').textContent = '00:00:00';
            document.getElementById('totalTime').textContent = '00:00:00';
            document.getElementById('seekbarLine').style.width = '0%';
            document.getElementById('bufferLine').style.width = '0%';
            document.getElementById('videoTitle').textContent = this._videoItem.title;

            let screen = document.getElementById('screen');
            this._video = document.getElementById('video');
            if (!this._video) {
                this._video = document.createElement('video');
                this._video.id = 'video';
                this._video.autoplay = false;
                this._video.preload = 'auto';

                this._source = document.createElement('source');
                this._source.id = 'source';
                this._source.src = this._videoItem.url;
                this._source.type = this._videoItem.mimeType;

                this._video.appendChild(this._source);
                screen.appendChild(this._video);
            } else {
                this._source = document.getElementById('source');
            }

            let loadstart = () => {
                console.debug('EVENT: loadstart');
            };
            let loadedmetadata = () => {
                console.debug('EVENT: loadedmetadata');
            }
            let loadeddata = () => {
                console.debug('EVENT: loadeddata');
                console.debug('########## VideoInfo [start] ##########');
                console.debug(`>> source: ${this._video.currentSrc}`);
                console.debug(`>> mimeType: ${this._videoItem.mimeType}`);
                console.debug(`>> duration: ${this._video.duration}`);
                console.debug(`>> videoSize(WxH): ${this._video.videoWidth}px x ${this._video.videoHeight}px`);
                console.debug(`>> readyState: ${this._video.readyState}`);
                console.debug(`>> networkState: ${this._video.networkState}`);
                console.debug('########## VideoInfo [end] ##########');
            }
            let timeupdate = () => {
                if (!this._isEnded) {
                    document.getElementById('screen').style.display = 'block';
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('totalTime').textContent = this._getTimeMediaFormat(this._video.duration);
                    document.getElementById('currentTime').textContent = this._getTimeMediaFormat(this._video.currentTime);
                    let percentage = (this._video.currentTime / this._video.duration) * 100;
                    document.getElementById('seekbarLine').style.width = percentage + '%';
                }
            }
            let progress = () => {
                if (!this._isEnded && this._video.buffered && 0 < this._video.buffered.length) {
                    let percentage = (this._video.buffered.end(this._video.buffered.length - 1) / this._video.duration) * 100;
                    document.getElementById('bufferLine').style.width = percentage + '%';
                }
            }
            let play = () => {
                console.debug('EVENT: play');
            }
            let playing = () => {
                console.debug('EVENT: playing');
            }
            let pause = () => {
                console.debug('EVENT: pause');
            }
            let suspend = () => {
                console.debug('EVENT: suspend');
            }
            let seeking = () => {
                console.debug('EVENT: seeking');
            }
            let seeked = () => {
                console.debug('EVENT: seeked');
            }
            let waiting = () => {
                console.debug('EVENT: waiting');
            }
            let canplay = () => {
                console.debug('EVENT: canplay');
            }
            let canplaythrough = () => {
                console.debug('EVENT: canplaythrough');
            }
            let ratechange = () => {
                console.debug('EVENT: ratechange');
            }
            let emptied = () => {
                console.debug('EVENT: emptied');
            }
            let stalled = () => {
                console.debug('EVENT: stalled');
            }
            let ended = () => {
                console.debug('EVENT: ended');
                this._isEnded = true;
                this._clearVideo().then(() => {
                    resolve({});
                });
            }
            let abort = (e) => {
                console.debug('EVENT: abort');
                reject(new Error(`ABORT=${e.message}`));
            }
            let error = () => {
                console.debug('EVENT: error');
                let message = 'Unknown.';
                switch (this._video.error.code) {
                    case 1:
                        message = 'Fetching process aborted by user.';
                        break;
                    case 2:
                        message = 'Error occurred when downloading.';
                        break;
                    case 3:
                        message = 'Error occurred when decoding.';
                        break;
                    case 4:
                        message = 'Video not supported.';
                        break;
                    default:
                        break;
                }
                reject(new Error(`ERROR: ${message} (${this._video.error.code})`));
            }

            this._event._loadstart = loadstart.bind(this);
            this._event._loadedmetadata = loadedmetadata.bind(this);
            this._event._loadeddata = loadeddata.bind(this);
            this._event._timeupdate = timeupdate.bind(this);
            this._event._progress = progress.bind(this);
            this._event._play = play.bind(this);
            this._event._playing = playing.bind(this);
            this._event._pause = pause.bind(this);
            this._event._suspend = suspend.bind(this);
            this._event._seeking = seeking.bind(this);
            this._event._seeked = seeked.bind(this);
            this._event._waiting = waiting.bind(this);
            this._event._canplay = canplay.bind(this);
            this._event._canplaythrough = canplaythrough.bind(this);
            this._event._ratechange = ratechange.bind(this);
            this._event._emptied = emptied.bind(this);
            this._event._stalled = stalled.bind(this);
            this._event._ended = ended.bind(this);
            this._event._abort = abort.bind(this);
            this._event._error = error.bind(this);

            this._video.addEventListener('loadstart', this._event._loadstart);
            this._video.addEventListener('loadedmetadata', this._event._loadedmetadata);
            this._video.addEventListener('loadeddata', this._event._loadeddata);
            this._video.addEventListener('timeupdate', this._event._timeupdate);
            this._video.addEventListener('progress', this._event._progress);
            this._video.addEventListener('play', this._event._play);
            this._video.addEventListener('playing', this._event._playing);
            this._video.addEventListener('pause', this._event._pause);
            this._video.addEventListener('suspend', this._event._suspend);
            this._video.addEventListener('seeking', this._event._seeking);
            this._video.addEventListener('seeked', this._event._seeked);
            this._video.addEventListener('waiting', this._event._waiting);
            this._video.addEventListener('canplay', this._event._canplay);
            this._video.addEventListener('canplaythrough', this._event._canplaythrough);
            this._video.addEventListener('ratechange', this._event._ratechange);
            this._video.addEventListener('emptied', this._event._emptied);
            this._video.addEventListener('stalled', this._event._stalled);
            this._video.addEventListener('ended', this._event._ended);
            this._video.addEventListener('abort', this._event._abort);
            this._video.addEventListener('error', this._event._error);

            this._video.play().catch((e) => {
                reject(new Error(`Play ERROR: ${e.message}`));
            });
        });
    }

    /**
     * 動画を停止する
     * @return {Object} Promise
     */
    stop() {
        return new Promise((resolve, reject) => {
            if (!this._video || this._video.paused) {
                resolve({});
            } else {
                this._video.pause();
                this._clearVideo().then(() => {
                    resolve({});
                });
            }
        });
    }

    /**
     * ビデオをクリアにする
     */
    _clearVideo() {
        return new Promise((resolve, reject) => {
            try {
                if (this._video) {
                    this._video.removeEventListener('loadstart', this._event._loadstart);
                    this._video.removeEventListener('loadedmetadata', this._event._loadedmetadata);
                    this._video.removeEventListener('loadeddata', this._event._loadeddata);
                    this._video.removeEventListener('timeupdate', this._event._timeupdate);
                    this._video.removeEventListener('progress', this._event._progress);
                    this._video.removeEventListener('play', this._event._play);
                    this._video.removeEventListener('playing', this._event._playing);
                    this._video.removeEventListener('pause', this._event._pause);
                    this._video.removeEventListener('suspend', this._event._suspend);
                    this._video.removeEventListener('seeking', this._event._seeking);
                    this._video.removeEventListener('seeked', this._event._seeked);
                    this._video.removeEventListener('waiting', this._event._waiting);
                    this._video.removeEventListener('canplay', this._event._canplay);
                    this._video.removeEventListener('canplaythrough', this._event._canplaythrough);
                    this._video.removeEventListener('ratechange', this._event._ratechange);
                    this._video.removeEventListener('emptied', this._event._emptied);
                    this._video.removeEventListener('stalled', this._event._stalled);
                    this._video.removeEventListener('ended', this._event._ended);
                    this._video.removeEventListener('abort', this._event._abort);
                    this._video.removeEventListener('error', this._event._error);

                    this._video.pause();
                    this._source.src = '';
                    this._video.load();

                    let videoQS = document.querySelector('#video')
                    videoQS.parentNode.removeChild(videoQS);
                    this._source = null;
                    this._video = null;
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * メディア表示の時間を取得する
     * @param {Integer} value 秒数
     * @return {String} 時間（HH:MM:SS）
     */
    _getTimeMediaFormat = (value) => {
        let s = value % 60;
        let m = Math.floor((value - s) / 60, 0);
        let h = Math.floor(m / 60, 0);
        let HH = ('00' + h).slice(-2);
        let MM = ('00' + (m % 60)).slice(-2);
        let SS = ('00' + Math.floor(s, 0)).slice(-2);
        return `${HH}:${MM}:${SS}`;
    }
}