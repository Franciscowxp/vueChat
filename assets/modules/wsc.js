/**
 * the data pattern
 * {
 *     type: text | image,
 *     format: text | binary,
 *     detail: string | binary,
 *     timestamp: string,
 *     owner: string ,
 *     reciever: string,
 *     action: string
 * }
 */
class wsc {
    constructor(url){
        this.ws = new WebSocket(url);
        this.msgHandlers = [];
    }
    register(action,func){
        this.msgHandlers.push({
            action,
            func
        })
    }
    send(data){
        this.ws.send(data);
    }
    message(){
        this.ws.addEventListener('message',(data) => {
            for(let [action,func] of this.msgHandlers) {
                if(data.action === action) {
                    func(data);
                    return false;
                }
            }
        });
    }

}