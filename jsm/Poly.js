const defAttr = () => ({
    gl: null,
    // 平展开的顶点数据
    vertices: [],
    // 对象型的数组
    geoData: [],
    size: 2,
    attrName: 'a_Position',
    count: 0,
    types: ['POINTS']
})
export default class Poly {
    constructor(attr) {
        Object.assign(this, defAttr(), attr)
        this.init()
    }
    init() {
        const { size, vertices, gl, attrName } = this
        if (!gl) {
            return
        }
        // 缓冲对象
        const vertexBuffer = gl.createBuffer();
        // 绑定缓冲对象(绑定在 gl.ARRAY_BUFFER)
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        this.updateBuffer()
        // 修改attribute变量
        // 获取a_Position的存储空间
        const a_Position = gl.getAttribLocation(gl.program, attrName);
        // 修改attribute
        gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0);
        // 赋能 批处理的功能
        gl.enableVertexAttribArray(a_Position);
    }
    updateBuffer() {
        const { vertices, gl } = this
        this.updateCount()
        //写入数据
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }
    updateCount() {
        this.count = this.vertices.length / this.size
    }
    // 添加顶点
    addVertices(...params) {
        this.vertices.push(...params)
        this.updateBuffer()
    }
    // 删除最后一个顶点
    popVertices() {
        const { vertices, size } = this
        let len = vertices.length
        vertices.splice(len - size, size)
        this.updateCount()
    }
    // 基于顶点位置去修改顶点的数据
    setVertices(index, ...params) {
        const { vertices, size } = this
        const i = index * size
        params.forEach((param, paramIndex) => {
            vertices[i + paramIndex] = param
        })
    }
    // 基于模型数据去修改vertices数据
    updateVertices(params) {
        const { geoData } = this
        const vertices = []
        geoData.forEach(data => {
            params.forEach(key => {
                vertices.push(data[key])
            })
        })
        this.vertices = vertices
    }
    draw(types = this.types) {
        const { gl, count } = this
        console.log('gl, count: ', gl, count);
        for (const type of types) {
            gl.drawArrays(gl[type], 0, count)
        }

    }
}
