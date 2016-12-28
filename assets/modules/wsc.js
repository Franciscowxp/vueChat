/**
 * the data pattern
 * {
 *     type: text | image | json,
 *     format: text | binary,
 *     detail: string | binary,
 *     timestamp: string,
 *     owner: string ,
 *     reciever: string,
 *     action: string
 * }
 * there are the actions below,
 *  updateUser
 *  updateUserList
 *  exchangeMsg
 *  exchangeFile
 */

var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

class WS {
    constructor(){
        this.msgHandlers = [];
    }
    init() {
        this.event('message', (res) => {
            let data = JSON.parse(res.data || res);
            this.dealMsgHandlers(data);
        })
    }
    register(action, func) {
        this.msgHandlers.push({
            action,
            func
        });
    }
    dealMsgHandlers(data) {
        for (let { action, func } of this.msgHandlers) {
            if (data.action === action) {
                func(data);
                return false;
            }1
        }
    }
    send(data){
        this.ws.send(JSON.stringify(data));
    }
    event(type,func) {
        if(this.ws.on) {
            this.ws.on(type, (res) => {
                func(res);
            })
        } else {
            this.ws.addEventListener(type, (res) => {
                func(res);
            })
        }
    }
}

class Wsc extends WS {
    constructor({
        url,
        open = () => {},
        error = () => {},
        close = () => {}
    }) {
        super();
        this.ws = new WebSocket(url);
        this.init();
    }
}

export { Wsc, WS};