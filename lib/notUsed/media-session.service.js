
const { Utils } = require('../../services/globalServices/utils.service');

const HttpService = require('../../services/globalServices/frontServices/httpService').HttpService;

module.exports.MediaPlaySession = class MediaPlaySession {
  state = {
    session: null,
    currSection: null,
    sessionUpdateIntervalId: null,
    isSeeking: false
  }
  constructor(organization, loggedUser, fileItem, mediaEl, baseApiUrl, metaDataToLog = null) {
    this.baseApiUrl = baseApiUrl;
    this.organization = organization;
    this.loggedUser = loggedUser;
    this.fileItem = fileItem;
    this.mediaEl = mediaEl;
    this.metaDataToLog = metaDataToLog;
    this.logSessions = (organization && fileItem && mediaEl && baseApiUrl) || metaDataToLog;

    this.httpService = new HttpService(baseApiUrl);

    mediaEl.addEventListener('play', async () => {
      await Utils.delay(10);
      if (this.state.isSeeking) {
        this.state.isSeeking = false;
        return;
      }
      this.setSessionUpdateInterval();
    });
    mediaEl.addEventListener('pause', async () => {
      await Utils.delay(10);
      if (this.state.isSeeking) return;
      this.stopSessionUpdateIterval();
    });
    mediaEl.addEventListener('seeking', () => {
      this.state.isSeeking = true;
      this.setNewMediaSection();
    });

    this.initMediaPlaySession();
  }

  destroy = () => {
    if (!this.logSessions) return;
    this.stopSessionUpdateIterval();
    this.updateMediaPlaySession();
  }

  initMediaPlaySession = () => { // initWatchSession
    if (!this.logSessions) return;
    this.state.session = this.getEmptyWatchLogItem();
    this.state.session.mediaSecondsDuration = this.mediaEl?.duration || undefined;
    this.state.session.organizationId = this.organization?._id;
    this.state.session.accountId = this.loggedUser?._id;
    this.state.session.fileId = this.fileItem?.fileId;
    this.state.session.data = this.metaDataToLog || {};
    this.setNewMediaSection();
    this.updateMediaPlaySession();
  }

  
  setSessionUpdateInterval = () => {
    if (!this.logSessions) return;
    this.stopSessionUpdateIterval();
    this.state.sessionUpdateIntervalId = setInterval(() => {
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
