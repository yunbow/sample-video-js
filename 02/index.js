{
    let ready = (callbackFunc) => {
        if (document.readyState !== 'loading') {
            callbackFunc();
        } else {
            document.addEventListener('DOMContentLoaded', callbackFunc);
        }
    }

    let videoItemList = [
        {
            url: '../video/Bullfinch.mp4',
            mimeType: 'video/mp4',
            title: 'bullfinch-男性-鳥-2797',
        },
        {
            url: '../video/Sunset.mp4',
            mimeType: 'video/mp4',
            title: '夕日-太陽-自然-金-10467',
        },
        {
            url: '../video/rose.mp4',
            mimeType: 'video/mp4',
            title: 'バラ-赤いバラを-花-3654',
        }
    ];

    let video = new Video();
    let isPlay = false;

    ready(() => {
        document.getElementById('playBtn').addEventListener('click', () => {
            if (!isPlay) {
                isPlay = true;

                let index = 0;
                let playVideoItemList = () => {
                    video.play(videoItemList[index]).then(() => {
                        if (videoItemList.length <= index + 1) {
                            index = 0;
                        } else {
                            index++;
                        }
                        playVideoItemList();
                    }).catch((e) => {
                        console.error(e);
                    });
                }
                playVideoItemList();
            }
        });
    });
}