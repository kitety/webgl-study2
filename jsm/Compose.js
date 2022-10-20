export default class Compose {
    constructor() {
        this.parent = null
        // compose 和 时间轨
        this.children = []
    }
    add(obj) {
        obj.parent = this
        this.children.push(obj)
    }
    update(t) {
        // t 世界时间
        this.children.forEach(ele => {
            // 当前时间更新子对象状态的方法
            ele.update(t)
        })
    }
}
