var pool = new Map();
const subscribe = function (eventName, callbackFunc) {
    if (this.pool.get(eventName) != null) {
        this.pool.get(eventName).push(callbackFunc);
    } else {
        this.pool.set(eventName, [callbackFunc]);
    }
};
const publish = function (eventName, params) {
    const poolcallbacks = this.pool.get(eventName);
    if (Array.isArray(poolcallbacks)){
        poolcallbacks.forEach(el => {
            if (typeof el === 'function') {
                el(params);
            }
        });
    }
};
export default {
    subscribe, 
    publish
}