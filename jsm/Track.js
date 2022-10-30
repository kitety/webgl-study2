export default class Track {
    constructor(target) {
        this.target = target;
        this.parent = null;
        this.start = 0;
        // 5 ms
        this.timeLen = 5;
        // 是否循环
        this.loop = false;
        // 所有属性的关键帧集合
        this.keyMap = new Map();
    }
    update(t) {
        // t世界时间
        const { keyMap, timeLen, loop, target, start } = this;
        // time 本地时间
        let time = t - start
        if (loop) {
            time = time % timeLen
        }
        for (const [key, fms] of keyMap.entries()) {
            const last = fms.length - 1
            if (time < fms[0][0]) {
                target[key] = fms[0][1]
            } else if (time > fms[last][0]) {
                target[key] = fms[last][1]
            } else {
                target[key] = getValBetweenFms(time, fms, last)
            }

        }
    }

}
function getValBetweenFms(time, fms, last) {
    const index = fms.findIndex((current, index) => {
        const next = fms[index + 1]
        if (current && next) {
            return time >= current[0] && time <= next[0]
        }
        return false
    })
    if (index >= 0) {
        const current = fms[index]
        const next = fms[index + 1]
        const delta = {
            x: next[0] - current[0],
            y: next[1] - current[1]
        }
        const k = delta.y / delta.x;
        const b = current[1] - current[0] * k
        return k * time + b
    }
}
