const { elementService } = require("./element.service");

module.exports.VideoTagWatermarkService = class VideoTagWatermarkService {
  watermarkInterval = null;
  constructor(elVideo, elContainer, waterMarkMsg, watermarkSpeedMs = 10000) {
    this.elVideo = elVideo;
    this.elContainer = elContainer;
    this.waterMarkMsg = waterMarkMsg;
    this.watermarkSpeedMs = watermarkSpeedMs;
  }

  applyWatermark() {
    const { elContainer, elVideo } = this;
    const existWatermarkItem = elContainer.querySelector('.watermark');
    if (existWatermarkItem) elContainer.removeChild(existWatermarkItem);
    if (window.getComputedStyle(elContainer).position === 'static') {
      elContainer.style.position = 'relative'
    }
    console.log('APPLYING!!');
    const width = elVideo.offsetWidth;
    const fontSize = width / 50;
    const watermarkEl = elementService.El(`<div class="watermark">
      ${elementService.dataToCssElStr(`.watermark`, {
        fontSize: fontSize*1 + 'px',
        position: 'absolute',
        padding: `${elementService._.em(55)} ${elementService._.em(30)}`,
        textAlign: 'end',
        opacity: '0.5',
        // fontWeight: 'bold',
        cursor: 'normal',
        'user-select': 'none',

        color: 'gray',
        fontFamily: 'fantasy'
      })}
      <p>${this.waterMarkMsg}</p>
    </div>`);
    const watermarkPos = this.getWatermarkPosByMs(elVideo.currentTime * 1000);
    const style = { 'inset-inline-end': watermarkPos.x, top: watermarkPos.y, ...(watermarkPos.style || {}) };
    // watermarkEl.style = style;
    for (let key in style) watermarkEl.style[key] = style[key];
    elContainer.appendChild(watermarkEl);
  }
  play() {
    this.watermarkInterval = setInterval(() => {
      this.applyWatermark();
    }, 10);
  }
  pause() {
    if (this.watermarkInterval) clearInterval(this.watermarkInterval);
  }

  getWatermarkPosByMs = (ms) => {
    const poss = [
        {x: 0, y: 0},
        {x: '100%', y: 0, style: {transform: `translateX(-100%)`}},
        {x: '100%', y: '100%', style: {transform: `translateX(-100%) translateY(-100%)`}},
        {x: 0, y: '100%', style: {transform: `translateY(-100%)`}},
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
