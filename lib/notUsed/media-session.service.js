
const { Utils } = require('../../services/globalServices/utils.service');

const HttpService = require('../../services/globalServices/frontServices/httpService').HttpService;

module.exports.MediaPlaySession = class MediaPlaySession {
  state = {
    session: null,
    currSection: null,
    sessionUpdateIntervalId: null,
    isSeeking: false
  }
  constructor(organization, loggedUser, fileItem, mediaEl, baseApiUrl, metaDataToLog = null, destroyWhenRemovedFromDom = true) {
    this.baseApiUrl = baseApiUrl;
    this.organization = organization;
    this.loggedUser = loggedUser;
    this.fileItem = fileItem;
    this.mediaEl = mediaEl;
    this.metaDataToLog = metaDataToLog;
    this.destroyWhenRemovedFromDom = destroyWhenRemovedFromDom;

    this.httpService = new HttpService(baseApiUrl);


    this.initMediaPlaySession();
  }

  get logSessions() {
    return !!((this.organization && this.fileItem && this.mediaEl && this.baseApiUrl) || this.metaDataToLog);
  }

  destroy = () => {
    if (!this.logSessions) return;
    this.stopSessionUpdateIterval();
    this.updateMediaPlaySession();
  }

  initMediaPlaySession = () => { // initWatchSession
    if (!this.logSessions) return;
    this.mediaEl.addEventListener('play', async () => {
      await Utils.delay(10);
      if (this.state.isSeeking) {
        this.state.isSeeking = false;
        return;
      }
      this.setSessionUpdateInterval();
    });
    this.mediaEl.addEventListener('pause', async () => {
      await Utils.delay(10);
      if (this.state.isSeeking) return;
      this.stopSessionUpdateIterval();
    });
    this.mediaEl.addEventListener('seeking', () => {
      this.state.isSeeking = true;
      this.setNewMediaSection();
    });
    this.state.session = {
      ...this.getEmptyWatchLogItem(),
      mediaSecondsDuration: this.mediaEl?.duration || undefined,
      organizationId: this.organization?._id,
      accountId: this.loggedUser?._id,
      fileId: this.fileItem?.fileId,
      data: this.metaDataToLog || {},
    };
    this.setNewMediaSection();
    this.updateMediaPlaySession();
  }

  
  setSessionUpdateInterval = () => {
    if (!this.logSessions) return;
    this.stopSessionUpdateIterval();
    this.state.sessionUpdateIntervalId = setInterval(() => {
      if (this.destroyWhenRemovedFromDom && !document.contains(this.mediaEl)) return this.destroy();
      this.updateMediaPlaySession();
    }, 5000);
  }
  stopSessionUpdateIterval = () => {
    if (!this.logSessions) return;
    clearInterval(this.state.sessionUpdateIntervalId);
    if (this.state.currSection && this.state.session) this.updateMediaPlaySession();
  }
  setNewMediaSection = async () => { // setNewWatchSection
    if (!this.logSessions) return;
    this.state.currSection = { id: Utils.getRandomId(''), start: (this.mediaEl?.currentTime || 0) * 1000, end: (this.mediaEl?.currentTime || 0) * 1000 };
    this.state.session.sections.push(this.state.currSection);
  }
  updateMediaPlaySession = async () => { // updateWatchSession
    if (!this.logSessions) return;
    this.state.currSection.end = (this.mediaEl?.currentTime || 0) * 1000;
    this.state.session.mediaSecondsDuration = this.mediaEl?.duration || undefined;
    if (!this.state.session.sections.reduce((acc, c) => acc + Math.abs(c.end - c.start), 0)) return;
    this.state.session = JSON.parse(JSON.stringify(await this.save(this.state.session)));
    this.state.currSection = this.state.session.sections.find(c => c.id === this.state.currSection.id);
  }

  getEmptyWatchLogItem(fileId, accountId, organizationId) {
    return {
      fileId: fileId || null,
      accountId: accountId || null,
      organizationId: organizationId || null,
      sections: [/*{
        id: String,
        start: TimeMS,
        end: TimeMS
      }*/],
      // totalWatchTime: 0,
      data: {},
      mediaSecondsDuration: 0
    }
  }
  save(item) {
    if (!this.logSessions) return;
    return item._id ? this.httpService.put('mediaPlayLog', item) : this.httpService.post('mediaPlayLog', item);
  }
}
