const WebSocket = require('ws');
var SocketServerInstance;
SocketServerInstance = require('ws').Server;
// const decodeUriComponent = require('decode-uri-component');
/**
 * If this file is in use in the server, install 'ws' npm, and put line 2 out of comment.
 * otherwize, put line 2 in comment;
*/

// export default SocketService();
module.exports = SocketService();

function SocketService() {
  // Base event emiter
  class EventEmitter {
    events = {};
    emit(ev, ...args) {
      if (!this.events[ev]) return;
      this.events[ev].forEach(cb => cb(...args));
    }
    on(ev, cb) {
      if (!this.events[ev]) this.events[ev] = [];
      this.events[ev].push(cb);
    }
    off(ev, cb) {
      const { events } = this;
      if (!events[ev]) return;
      const idx = events[ev].findIndex(c => c === cb);
      if (idx !== -1) events[ev].splice(idx, 1);
      if (!events[ev].length) delete events[ev];
    }
  }
  // the purpose of this class is only to create a base emitter with a method named 'emitEv' instead of 'emit', 
  // becouse emit is a used name in the higher classes and the Emitter's emit needs to be in use as well, not as a super method;
  class BaseEmitter extends EventEmitter { 
    constructor() { super() }
    emitEv(...args) { super.emit(...args) }
  }
  
  // Socket client service
  class Client extends BaseEmitter {
    socket = null;
    constructor(api) {
      super();
      this.api = api;
      this.setup();
    }
    setup() {
      this.events = {};
      let socket = new WebSocket(this.api);
      socket.addEventListener('message', (message) => {
        message = message.data;
        if (!utils.isJson(message)) {
          pingPongMethods.pingPong.call(this, message);
          return;
        }
        const { event, value } = JSON.parse(message);
        super.emitEv(event, value);
      });
      socket.addEventListener('open', () => { });
      socket.addEventListener('close', () => {
        setTimeout(() => {
          this.setup();
        }, 5000);
      });
      socket.addEventListener('error', (err) => {
        console.error('Had error with socket connection: ' + err.target.url);
      });
      {
        // socket.addEventListener('ping', () => {
        //   socket.pong();
        // });
        // socket.addEventListener('pong', () => {
        // });
      }
      this.socket = socket;
    }
    disconnect() {
      this.socket.close();
      this.socket = null;
      this.events = {};
    }
    
    get api() { return this._api }
    set api(apiVal) {
      let _api;
      const protocol = location.protocol === 'https:'? 'wss:' : 'ws:';
      if (apiVal === '/') {
        _api = protocol + '//' + location.host;
      } else if (apiVal.slice(0,2) === '//') {
        _api = protocol + apiVal;
      }
      this._api = _api;
    }
  
    emit(ev, data) {
      const message = utils.msg(ev, data);
      if (this.socket.readyState === 1) this.socket.send(message);
      else setTimeout(() => this.emit(ev, data), 1000);
    }

    ping = pingPongMethods.ping;
  }

  if (!SocketServerInstance) return { Client };
  


  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////                                                                                          ////////
  ////////     IF CLIENT:: RELEVANT CODE IS UNTILL HERE, FROM HERE IS ALL FOR SOCKET SERVER USE     ////////
  ////////                                                                                          ////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////


  // Socket server service
  class Producer extends BaseEmitter {
    wss = null;
    clients = [];
    middlewares = [];
  
    constructor(server) {
      super();
      this.setup(server);
    }
    
    static instance = SocketServerInstance;
    setup(server) {
      const { instance } = this.constructor;
      if (!instance) return;
      const wss = new instance({ server });
      wss.on('connection', (socket, req) => {
        const client = new ServerSocket(socket, this);
        client.headers = req.headers;
        this.clients.push(client);
        this.emitEv('connection', client, req);
      });
      this.wss = wss;
      this.aliveInterval = setInterval(() => {
        this.clients.forEach(client => client.destroyOrPing());
      }, 1000 * 60);
    }

    destroy() {
      this.clients.forEach(this.removeClient.bind(this));
      clearInterval(this.aliveInterval);
    }
    
    middlewares = [];
    use = middlewareMethods.use;
  
    to = (room) => ({
      emit: (ev, value) => this.emit(ev, value, client => client.rooms.includes(room))
    });

    emit = (ev, data, filterClientsCb) => {
      this.clients.forEach(client => {
        if (filterClientsCb && !filterClientsCb(client)) return;
        client.emitEvAndMiddlewares(ev, data);
      });
    }
  
    removeClient(client) {
      const idx = this.clients.findIndex(c => c.id === client.id);
      if (idx !== -1) this.clients.splice(idx, 1);
    }
  }
  
  // Single server socket item
  class ServerSocket extends BaseEmitter {
    id = null;
    socket = null;
    producer = null;
    alive = true;

    constructor(socket, producer) {
      super();
      this.setup(socket, producer);
    }

    setup(socket, producer) {
      this.producer = producer;
      this.socket = socket;
      this.id = utils.id();
  
      socket.on('message', (message, req) => {
        this.alive = true;
        if (!utils.isJson(message)) {
          pingPongMethods.pingPong.call(this, message);
          return;
        }
        const { event, value } = JSON.parse(message);
        super.emitEv(event, value);
        this.producer.emitEv(event, value);
      });
      socket.on('close', () => {
        this.destroy();
      });
      {
        // socket.on('ping', () => {
        //   this.alive = true;
        //   this.socket.pong(() => {});
        //   // socket.emit('pong');
        //   // socket.send(utils.msg('pong', null));
        //   socket.send('pong');
        // });
        // socket.on('pong', () => {
        //   this.alive = true;
        // });
      }
      // this.aliveInterval = setInterval(this.destroyOrPing.bind(this), 1000*60);
    }

    destroyOrPing() {
      if (!this.alive) return this.destroy();
      this.alive = false;
      // this.socket.ping(() => {});
      this.ping();
    }

    destroy() {
      this.producer.removeClient(this);
      this.socket.close();
      this.emitEv('disconnect', this);
    }
  
    middlewares = [];
    use = middlewareMethods.use;
    async emitEvAndMiddlewares(ev, data) { // Not using Promise.all becouse asuming that needs to run the middlewares in the given order;
      const isAllowdByParrent = await middlewareMethods.validateMiddlewares.call(this.producer, this);
      const isAllowdBySelf = await middlewareMethods.validateMiddlewares.call(this, this);
      const isAllowed = isAllowdByParrent && isAllowdBySelf;
      if (isAllowed) this.socket.send(utils.msg(ev, data));
    } 
  
    emit = (ev, data) => this.emitEvAndMiddlewares(ev, data);
    broadcast = (ev, value) => this.producer.emit(ev, value, client => client.id !== this.id);
    rooms = [];
    join = (room) => this.rooms.push(room);
    leave = (room) => this.rooms.splice(this.rooms.indexOf(room), 1);

    ping = pingPongMethods.ping;
  }

  var pingPongMethods = {
    pingPong(message) {
      if (message === 'ping') {
        this.socket.send('pong');
        this.pingCb?.();
      }
      else if (message === 'pong') {
        this.pongCb?.();
      }
    },
    ping(cb) {
      this.socket.send('ping');
      this.pongCb = cb;
    }
  }

  
  var middlewareMethods = {
    use(middleware) {
      this.middlewares.push(middleware);
    },
    async validateMiddlewares(client) {
      let nextCount = 0;
      const next = () => nextCount++;
      for (let i = 0; i < this.middlewares.length; i++) {
        const middleware = this.middlewares[i];
        await middleware(client, next); // Not Promise.all to keep the given middlewares order;
        if (nextCount < i+1) return false;
      }
      return true;
    }
  }
  
  var utils = {
    msg: (event = '', value = null) => (JSON.stringify({ event, value })),
    id(len = 10) {
      const opts = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      // return opts.split('').sort(() => Math.random() > 0.5? 1 : -1).slice(0, len).join('');
      let _id = '';
      for (let i = 0; i < len; i++) _id += opts[Math.floor(Math.random()*opts.length)]; 
      return _id;
    },
    isJson(jsonStr) {
      try {
        JSON.parse(jsonStr);
        return true;
      } catch (e) {
        return false;
      }
    }
  }


  // const parseCookies = (cookiesStr) => {
  //   return cookiesStr.split('&').reduce((map, curr) => {
  //       const [key, value] = curr.split('=');
  //       map[key] = decodeUriComponent(value);
  //       return map;
  //   }, {});
  // }
  // const requireAuthMiddleware = async (socket, next) => { // require auth for socket routes;
  //   // return next();
  //   const connectSid = parseCookies(socket.headers.cookie)['connect.sid'];
  //   const sessionId = connectSid.split('.')[0]?.split(':')[1] || '';
  //   return new Promise((resolve, reject) => {
  //       sessionStore.get(sessionId, (err, _session) => {
  //           if (!_session?.user) return resolve(false);
  //           next();
  //           resolve();
  //       });
  //   });
  // }
  // io.use(requireAuthMiddleware);

  return {
    EventEmitter,
    Client,
    Producer
  }
}