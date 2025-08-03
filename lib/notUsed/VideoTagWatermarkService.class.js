const { elementService } = require("./element.service");

module.exports.VideoTagWatermarkService = class VideoTagWatermarkService {
  watermarkInterval = null;
  constructor(elVideo, elContainer, waterMarkMsg, watermarkSpeedMs = 10000, destroyWhenRemovedFromDom = true) {
    this.elVideo = elVideo;
    this.elContainer = elContainer;
    this.waterMarkMsg = waterMarkMsg;
    this.watermarkSpeedMs = watermarkSpeedMs;
    this.destroyWhenRemovedFromDom = destroyWhenRemovedFromDom;
    this.init();
  }

  init = () => {
    this.elVideo.addEventListener('play', this.play);
    this.elVideo.addEventListener('pause', this.pause);
  }
  destroy = () => {
    this.pause();
    this.elVideo.removeEventListener('play', this.play);
    this.elVideo.removeEventListener('pause', this.pause);
  }

  
  play = () => {
    this.pause();
    this.watermarkInterval = setInterval(() => {
      if (this.destroyWhenRemovedFromDom && !document.contains(this.elVideo)) return this.destroy();
      this.applyWatermark();
    }, 10);
  }
  pause = () => {
    if (this.watermarkInterval) {
      clearInterval(this.watermarkInterval);
      this.watermarkInterval = null;
    }
  }

  applyWatermark = () => {
    const { elContainer, elVideo } = this;
    const existWatermarkItem = elContainer.querySelector('.watermark');
    if (existWatermarkItem) elContainer.removeChild(existWatermarkItem);
    if (window.getComputedStyle(elContainer).position === 'static') {
      elContainer.style.position = 'relative'
    }
    const width = elVideo.offsetWidth;
    const height = elVideo.offsetHeight;
    const fontSize = width / 50;
    const watermarkEl = elementService.El(`<div class="watermark">
      ${elementService.dataToCssElStr(`.watermark`, {
        // width: width*0.9+'px',
        // height: height*0.8+'px',
        // transform: `translateX(-50%) translateY(-50%)`,
        // top: '50%',
        // left: '50%',

        fontSize: fontSize*1 + 'px',
        position: 'absolute',
        // padding: `${elementService._.em(55)} ${elementService._.em(30)}`,
        textAlign: 'end',
        opacity: '0.5',
        // fontWeight: 'bold',
        cursor: 'normal',
        'user-select': 'none',

        color: 'gray',
        fontFamily: 'fantasy',
        p: {
          // position: 'absolute'
        }
      })}
      <p>${this.waterMarkMsg}</p>
    </div>`);
    // const watermarkP = watermarkEl.querySelector('p');
    const watermarkPos = this.getWatermarkPosByMs(elVideo.currentTime * 1000);
    const style = { ['left' || 'inset-inline-end']: watermarkPos.x, top: watermarkPos.y, ...(watermarkPos.style || {}) };
    // watermarkEl.style = style;
    for (let key in style) watermarkEl.style[key] = style[key];
    elContainer.appendChild(watermarkEl);
  }

  getWatermarkPosByMs = (ms) => {
    // const pad = { x: elementService._.em(55), y: elementService._.em(30) };
    const pad = { x: elementService._.em(55), y: elementService._.em(55) };
    function cssCalcForPad(val, pad, isInlineStart) {
      // return val;
      return `calc(${val} ${isInlineStart ? '+' : '-'} ${pad})`;
    }
    const poss = [
        {x: 0, y: 0, style: {transform: `translateX(${pad.x}) translateY(${pad.y})` } },
        {x: '100%', y: 0, style: {transform: `translateX(${cssCalcForPad('-100%', pad.x, false)})  translateY(${pad.y})`}},
        {x: '100%', y: '100%', style: {transform: `translateX(${cssCalcForPad('-100%', pad.x, false)}) translateY(${cssCalcForPad('-100%', pad.y, false)})`}},
        {x: 0, y: '100%', style: {transform: `translateX(${cssCalcForPad('100%', pad.x, false)}) translateY(${cssCalcForPad('-100%', pad.y, false)})`}},
        {x: '50%', y: '50%', style: {transform: `translateX(-50%) translateY(-50%)`}}
    ];
    // const msPerPos = 10000;
    const msPerPos = this.watermarkSpeedMs;
    // return (ms) => {
        const posIdx = parseInt(parseInt(ms / msPerPos) % poss.length);
        return poss[posIdx];
    // }
  };
}





/*
    appendWatermarkStyling() {
      const { elVideo } = this.$refs;
      const width = elVideo.offsetWidth;
      const fontSize = width / 50;
      // const getEm = size => `${(size / fontSize)}em`;
      if (!this.useWterMark) return;
      const styleEl = elementService.StyleEl(`#${this.videoId}`, {
        fontSize: `${fontSize}px`,
        '&:after': {
          width: 'fit-content',
          content: `"${this.watermarkMsg}"`,
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          'inset-inline-end': '0',
          fontSize: elementService._.em(15),
          fontWeight: 'bold',
          animation: '25s linear moving-watermark-animation infinite',
          'text-wrap': 'nowrap',
          opacity: '0.4'
        },
        '&.paused': {
          '&:after': {
            'animationPlayState': 'paused'
          }
        },
        '@keyframes moving-watermark-animation': {
          '0%': {'inset-inline-end': '-100%'},
          '100%': {'inset-inline-end': '100%'}
        },
        '&:before': {
          display: 'none',
          content: `""`,
          position: 'absolute',
          top: elementService._.em(20),
          'inset-inline-start': elementService._.em(20),
          width: elementService._.em(70),
          height: elementService._.em(70),
          backgroundImage: `url(${this.logoUrl})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          // opacity: '0.6'
        },
        video: {
          height: 'auto',
          objectFit: 'contain',
          width: '100%',
          height: '100%'
        },
        'video::-webkit-media-controls-fullscreen-button': {
          display: 'none',
        }
      });
      styleEl.classList.add('video-styling');
      this.styleEl == styleEl;
      document.head.append(styleEl);
    }

*/