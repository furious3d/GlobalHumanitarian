var evtPool = new Map();

const subscribe = (eventName, callbackFunc) => {
    if (evtPool.get(eventName) != null) {
        evtPool.get(eventName).push(callbackFunc);
    } else {
        evtPool.set(eventName, [callbackFunc]);
    }

    console.log(`registered new listener on ${eventName}: ${evtPool.get(eventName).length}`);
};

const publish = (eventName, params) => {
    const poolcallbacks = evtPool.get(eventName);
    console.log(`Event ${eventName} published`);
    if (Array.isArray(poolcallbacks)) {
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
