var canvas = document.getElementById("canvas")
// 将页面中ID为"canvas"的canvas元素赋值给变量canvas。
var 环境 = canvas.getContext("2d")
// 获取 canvas 元素的2D渲染上下文，并将其赋值给常量"环境"
var 地图 = { //地图尺寸
    x: 300,
    y: 150
}
var 速度 = 100 //刷新速度
canvas.width = 地图.x * 8
// canvas的宽度等于地图X轴的的八倍
canvas.height = 地图.y * 8
// canvas的长度等于地图Y轴的的八倍
var 生命 = []
// 声明一个"生命"变量的数组
for (var i = 0; i < 地图.x * 地图.y; i++) {
    //默认无生命
    生命.push("white")
}
// 地图.X轴*地图.Y轴。在每次循环中，将一个字符串"white"（白色）推入到"生命"数组中。
function 抽奖() {
    环境.clearRect(0, 0, canvas.width, canvas.height)
    // 清空Canvas上的所有内容
    for (var i = 0; i < 生命.length; i++) {
        生机 = 生命[i]
        // 循环变量 i 所对应的数组元素赋值给 生机 变量。
        环境.fillStyle = 生机
        // 循环变量 生机 的值作为填充色
        环境.fillRect((i % 地图.x) * 8, parseInt(i / 地图.x) * 8, 7, 7) //根据地图尺寸画上格子
        // (i % 地图.x) * 8 和 parseInt(i / 地图.x) * 8 分别表示矩形在 Canvas 上的横坐标和纵坐标。
        // ctx.fillStyle = '颜色';
        // ctx.fillRect(宽度, 高度, X, Y);
        // parseInt() 函数可解析一个字符串，并返回一个整数。
        // .length获取字符串的长度
    }
    有利生命()
}
function 种子() { //随机生成生命
    var 播种 = 2500 //初始生命数量
    for (var i = 0; i < 播种; i++) {
        生命[parseInt(Math.random() * 生命.length)] = "black"
        // 从生命数组中随机选择一个元素，并将其值设置为 "black"（黑色）。
        // .random选择文档中的随机元素。
    }

}
function 有利生命() {
    var 生存 = []
    var 总数 = 0
    // 周边生命索引速查
    // -地图.x-1,-地图.x,-地图.x+1
    //  -1,   0   ,1 
    //  地图.x-1,地图.x,地图.x+1

    for (i = 0; i < 地图.x * 地图.y; i++)
    // 遍历整个生命数组
    {
        总数 = 0
        if (i == 0) {
            // 当i==0时，表示前面的循环次数已经达到极值，此时程序终止，不再往下执行。
            生命空间 = [1, 地图.x, 地图.x + 1]
            // (1,X,X+1)
        }
        //左上角
        else if (i == 地图.x - 1) {
            生命空间 = [-1, 地图.x - 1, 地图.x]
            // (-1,X-1,1)
        }
        //右上角
        else if (i == 地图.x * 地图.y - 地图.x) {
            生命空间 = [-地图.x, -地图.x + 1, 1]
        }
        //左下角
        else if (i == 地图.x * 地图.y - 1) {
            生命空间 = [-地图.x - 1, -地图.x, -1]
        }
        //右下角
        else if (i > 0 && i < 地图.x - 1) {
            生命空间 = [-1, 1, 地图.x - 1, 地图.x, 地图.x + 1]
        }
        //上边
        else if (i > 地图.x - 1 && parseInt(i % 地图.x) == 地图.x - 1 && i < 地图.x * 地图.y - 1) {
            生命空间 = [-地图.x - 1, -地图.x, -1, 地图.x - 1, 地图.x]
        }
        //右边
        else if (i > 地图.x * 地图.y - 地图.x && i < 地图.x * 地图.y) {
            生命空间 = [-地图.x - 1, -地图.x, -地图.x + 1, -1, 1]
        }
        //下边
        else if (i > 0 && i < 地图.x * 地图.y - 地图.x && parseInt(i % 地图.x) == 0) {
            生命空间 = [-地图.x, -地图.x + 1, 1, 地图.x, 地图.x + 1]
        }
        //左边框 
        else {
            生命空间 = [-地图.x - 1, -地图.x, -地图.x + 1, - 1, 1, 地图.x - 1, 地图.x, 地图.x + 1]
        }
        //中间部分
        生命空间.forEach(function (生命索引) {
            //根据生命空间的值检查周边生命数量
            //array.forEach(function(currentValue, index, array) {  }, [context]);
            if (生命[i + 生命索引] == "black") {
                总数 += 1
            }

        })

        if (总数 >= 3 && 总数 <= 5) {
            //划定生命生成条件
            生存[i] = "black"
        }
        else {
            生存[i] = "white"
        }
    }
    生命 = 生存
    //将结果赋值给生命数组
}
种子()
setInterval(抽奖, 速度)