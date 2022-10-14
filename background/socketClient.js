/**
 * Websocket client class to communicate with node socket server running at *.*.*.*:7777
 */
class SocketClient {
    /**
     * static get instance method in singleton class
     */
    static _inst = null;
    static getInstance() {
        if (!SocketClient._inst) SocketClient._inst = new SocketClient();
        return SocketClient._inst;
    }
    constructor() {
        console.log('Socket client is created.');
    }
    static EVENT = {
        OPEN: 'SOCKET_OPEN',
        CLOSE: 'SOCKET_CLOSED',
        ERROR: 'SOCKET_ERROR',
        MESSAGE: 'SOCKET_MESSAGE',
        LOGOUT: 'LOG_OUT'
    };

    isConnected = false;
    serverPath = '';
    keepConnection = true;
    callbacks = [];
    /**
     * @summary connect to websocket server.
     * @param {string} url
     */
    connect(url, keepConnection = true) {
        this.serverPath = url;
        this.keepConnection = keepConnection;
        if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
            console.log('Bad call to connect while client socket is running.');
            return;
        }
        try {
            this.socket = new WebSocket(url);
            this.socket.onopen = this.onOpen;
            this.socket.onerror = this.onError;
            this.socket.onclose = this.onClose;
            this.socket.onmessage = this.onMessage;
        } catch (e) {
            console.error('Error in connecting server.', e);
        }
    }
    /**
     * @summary         Make JSON from type and data, convert it to string and send to server.
     * @param {string} type
     * @param {string} data
     */
    send(type, data) {
        try {
            this.socket.send(JSON.stringify({ type, data }));
        } catch (e) {
            console.error('Error in sending data to server.', e);
        }
    }

    /**
     * @summary         add event listener.
     * @param {string}   eventType
     * @param {function} callback
     */
    addEventListener(eventType, callback) {
        this.callbacks.push({ eventType, callback });
    }

    /**
     * @summary         remove event listener
     * @param {string}  eventType
     * @param {function} callback
     */
    removeEventListener(eventType, callback) {
        this.callbacks = this.callbacks.filter((record) => record.eventType !== eventType || record.callback !== callback);
    }
    /**
     * @summary         call every callback for specific event type. It will be called for all socket event
     * @param {string} eventType
     * @param {event} event
     */
    callProperCallback(eventType, event) {
        this.callbacks.forEach((record) => {
            if (record.eventType === eventType) record.callback(event);
        });
    }
    // Socket event listeners
    /**
     * @summary callback of socket "onopen" event
     * @param {*} event socket event
     */
    onOpen(event) {
        console.log('Socket is opend.');
        SocketClient.getInstance().isConnected = true;
        SocketClient.getInstance().callProperCallback(SocketClient.EVENT.OPEN, event);
    }
    /**
     * @summary callback of socket "onopen" event
     * @param {*} event socket event
     */
    onError(event) {
        console.log('Socket error.');
        SocketClient.getInstance().isConnected = false;
        SocketClient.getInstance().callProperCallback(SocketClient.EVENT.ERROR, event);
    }
    /**
     * @summary callback of socket "onopen" event
     * @param {*} event socket event
     */
    onClose(event) {
        console.log('Socket is closed.');
        SocketClient.getInstance().isConnected = false;
        SocketClient.getInstance().callProperCallback(SocketClient.EVENT.CLOSE, event);
        // if keepConnection is true, it will try to reconnect on every time of socket close.
        if (SocketClient.getInstance().keepConnection)
            setTimeout(() => SocketClient.getInstance().connect(SocketClient.getInstance().serverPath, true), 5000);
    }
    /**
     * @summary callback of socket "onopen" event
     * @param {*} event socket event
     */
    onMessage(event) {
        console.log('Socket message.', event);
        SocketClient.getInstance().callProperCallback(SocketClient.EVENT.MESSAGE, event);
    }
}
