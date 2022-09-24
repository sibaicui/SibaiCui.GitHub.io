var myImport = function () {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "./live2dw/lib/L2Dwidget.min.js");        // 引用文件的路径
    document.getElementsByTagName('head')[0].appendChild(script);                    // 引用文件
}
window.onload = function () {
    myImport();
}
// 引入L2Dwidget.min.js文件
L2Dwidget.init({
    model: {// 模型
        jsonPath: "./live2dw/live2d-widget-model-shizuku/assets/shizuku.model.json",
        // jsonPath: "./live2dw/live2d-widget-model-miku/assets/miku.model.json",
        // jsonPath: "./live2dw/live2d-widget-model-haru_1/assets/haru01.model.json",
        // jsonPath: "./live2dw/live2d-widget-model-haru_2/assets/haru02.model.json",
        // jsonPath: "./live2dw/live2d-widget-model-hibiki/assets/hibiki.model.json",
        // jsonPath: "./live2dw/live2d-widget-model-z16/assets/z16.model.json",
        scale: 1 //模型缩放比例
    },
    display: {
        position: "left", //模型的位置（左or右）
        width: 300, //模型宽度
        height: 600, //模型高度
        hOffset: 0, //模型水平偏移量
        vOffset: -20 //模型垂直偏移量
    },
    mobile: {
        show: true, //手机端是否显示
        scale: 1 //缩放比例
    },
    react: {
        opacity: 1 //模型不透明度
    },
    dialog: {
        hitokoto: true,
        enable: true,
    }
})