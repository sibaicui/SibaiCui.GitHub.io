const express = require('express');
const xlsx模块 = require('xlsx');
// const xlsx模块 = require('xlsx-style');
const 路径模块 = require('path');
const multer = require('multer');
// const XLSX = require('xlsx-style');
const 应用 = express();
const 端口 = 3000;

应用.use(express.static(路径模块.join(__dirname, 'public')));

const 上传中间件 = multer({ dest: 'uploads/' });

应用.get('/', (请求, 响应) => {
    响应.sendFile(路径模块.join(__dirname, 'index.html'));
});

应用.post('/api/upload-excel', 上传中间件.single('files'), (请求, 响应) => {
    try {
        if (!请求.file) {
            return 响应.status(400).send('未上传文件');
        }
        const 工作簿 = xlsx模块.readFile(请求.file.path);
        const 工作表名称 = 工作簿.SheetNames[0];
        const 工作表 = 工作簿.Sheets[工作表名称];
        const 数据 = xlsx模块.utils.sheet_to_json(工作表, { header: 1 });
        const 字段名 = 数据[4].slice(1);
        const json数据 = 数据.slice(5).map(行 => {
            const 对象 = {};
            字段名.forEach((字段, 索引) => {
                let 值 = 行[索引 + 1] || '';
                if (字段 === "日期" && typeof 值 === "number") {
                    值 = xlsx模块.SSF.format('yyyy-mm-dd', 值);
                }
                对象[字段] = typeof 值 === 'string' ? 值.trim() : String(值).trim();
            });
            return 对象;
        });

        响应.json(json数据);
    } catch (错误) {
        console.error('处理 Excel 文件时出错:', 错误);
        响应.status(500).send('内部服务器错误');
    }
});


// 启动服务器
应用.listen(端口, () => {
    console.log(`服务器正在运行 http://localhost:${端口}`);
});