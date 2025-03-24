const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const 数据路径 = {
    用户: './数据/用户.json',
    项目进展: './数据/项目进展.json',
    项目资料: './数据/项目资料.json',
    项目进展审计追踪: './数据/项目进展审计追踪.json',
    项目资料审计追踪: './数据/项目资料审计追踪.json'
};
const 用户会话 = {};
function 读取JSON(文件路径) {
    try {
        return JSON.parse(fs.readFileSync(文件路径, 'utf-8'));
    } catch (错误) {
        console.error(`读取文件失败：${文件路径}`, 错误);
        return [];
    }
}
function 写入JSON(文件路径, 数据) {
    try {
        fs.writeFileSync(文件路径, JSON.stringify(数据, null, 2), 'utf-8');
    } catch (错误) {
        console.error(`写入文件失败：${文件路径}`, 错误);
    }
}
function 记录审计追踪(审计文件路径, 操作, 用户, 详情) {
    const 审计追踪数据 = 读取JSON(审计文件路径);
    const 详细信息 = typeof 详情 === 'object' ? JSON.stringify(详情) : 详情;
    审计追踪数据.push({
        操作,
        时间: new Date().toISOString(),
        用户,
        详情: 详细信息
    });
    写入JSON(审计文件路径, 审计追踪数据);
}
function 验证权限(请求, 响应, 回调) {
    const token = 请求.headers['authorization'];
    const 用户 = 用户会话[token];
    if (!用户) {
        响应.writeHead(401, { 'Content-Type': 'application/json' });
        响应.end(JSON.stringify({ 成功: false, 错误: '未授权' }));
        return;
    }
    回调(用户);
}
const 服务器 = http.createServer((请求, 响应) => {
    const 请求路径 = decodeURIComponent(url.parse(请求.url, true).pathname);
    const 路径名 = 请求路径;
    if (请求路径.startsWith('/开放文件')) {
        const 安全路径 = path.normalize(path.join(__dirname, 请求路径));
        console.log('安全路径:', 安全路径);
        if (!安全路径.startsWith(path.join(__dirname, '/开放文件'))) {
            响应.writeHead(403, { 'Content-Type': 'text/plain' });
            响应.end('禁止访问');
            return;
        }
        if (fs.existsSync(安全路径)) {
            响应.writeHead(200, { 'Content-Type': 'text/html' });
            响应.end(fs.readFileSync(安全路径));
        } else {
            响应.writeHead(404, { 'Content-Type': 'text/plain' });
            响应.end('文件未找到');
        }
        return;
    }



    // // 固定密码
    // const FIXED_PLUGIN_PASSWORD = 'G7#pL9@qX2!mR5&v';

    // // 验证插件密码接口
    // 服务器.on('request', (请求, 响应) => {
    //     const 路径名 = url.parse(请求.url).pathname;

    //     if (路径名 === '/验证插件密码' && 请求.method === 'POST') {
    //         let 数据体 = '';
    //         请求.on('data', (数据) => 数据体 += 数据);
    //         请求.on('end', () => {
    //             try {
    //                 const { password } = JSON.parse(数据体);

    //                 if (password === FIXED_PLUGIN_PASSWORD) {
    //                     // 生成临时令牌
    //                     const token = jwt.sign({ valid: true }, 'your-secret-key', { expiresIn: '1h' });
    //                     响应.writeHead(200, { 'Content-Type': 'application/json' });
    //                     响应.end(JSON.stringify({ success: true, token }));
    //                 } else {
    //                     响应.writeHead(401, { 'Content-Type': 'application/json' });
    //                     响应.end(JSON.stringify({ success: false, error: '插件密码错误' }));
    //                 }
    //             } catch (错误) {
    //                 响应.writeHead(500, { 'Content-Type': 'application/json' });
    //                 响应.end(JSON.stringify({ success: false, error: '服务器内部错误' }));
    //             }
    //         });
    //     }
    // });
    // 服务器.on('request', (请求, 响应) => {
    //     const 路径名 = url.parse(请求.url).pathname;

    //     if (路径名 === '/验证插件密码' && 请求.method === 'POST') {
    //         let 数据体 = '';
    //         请求.on('data', (数据) => 数据体 += 数据);
    //         请求.on('end', () => {
    //             try {
    //                 const { password } = JSON.parse(数据体);

    //                 if (password === FIXED_PLUGIN_PASSWORD) {
    //                     // 生成临时令牌
    //                     const token = jwt.sign({ valid: true }, 'your-secret-key', { expiresIn: '1h' });
    //                     响应.writeHead(200, { 'Content-Type': 'application/json' });
    //                     响应.end(JSON.stringify({ success: true, token }));
    //                 } else {
    //                     响应.writeHead(401, { 'Content-Type': 'application/json' });
    //                     响应.end(JSON.stringify({ success: false, error: '插件密码错误' }));
    //                 }
    //             } catch (错误) {
    //                 响应.writeHead(500, { 'Content-Type': 'application/json' });
    //                 响应.end(JSON.stringify({ success: false, error: '服务器内部错误' }));
    //             }
    //         });
    //         return;
    //     }
    // });


    // // 登录接口
    // if (路径名 === '/登录' && 请求.method === 'POST') {
    //     let 数据体 = '';
    //     请求.on('data', (数据) => 数据体 += 数据);
    //     请求.on('end', () => {
    //         try {
    //             const { 用户名, 密码, pluginToken } = JSON.parse(数据体);

    //             // 验证插件令牌
    //             if (!pluginToken) {
    //                 响应.writeHead(401, { 'Content-Type': 'application/json' });
    //                 响应.end(JSON.stringify({ 成功: false, 错误: '插件验证失败' }));
    //                 return;
    //             }

    //             jwt.verify(pluginToken, 'your-secret-key', (错误, 解码数据) => {
    //                 if (错误 || !解码数据.valid) {
    //                     响应.writeHead(401, { 'Content-Type': 'application/json' });
    //                     响应.end(JSON.stringify({ 成功: false, 错误: '插件验证失败' }));
    //                     return;
    //                 }

    //                 // 验证用户名和密码
    //                 const 用户列表 = 读取JSON(数据路径.用户);
    //                 const 当前用户 = 用户列表.find(u => u.用户名 === 用户名 && u.密码 === 密码);

    //                 if (当前用户) {
    //                     const token = jwt.sign({ 用户名 }, 'your-secret-key', { expiresIn: '1h' });
    //                     响应.writeHead(200, { 'Content-Type': 'application/json' });
    //                     响应.end(JSON.stringify({ 成功: true, token }));
    //                 } else {
    //                     响应.writeHead(401, { 'Content-Type': 'application/json' });
    //                     响应.end(JSON.stringify({ 成功: false, 错误: '用户名或密码错误' }));
    //                 }
    //             });
    //         } catch (错误) {
    //             响应.writeHead(500, { 'Content-Type': 'application/json' });
    //             响应.end(JSON.stringify({ 成功: false, 错误: '服务器内部错误' }));
    //         }
    //     });
    //     return;
    // }
    if (路径名 === '/登录' && 请求.method === 'POST') {
        let 数据体 = '';
        请求.on('data', (数据) => 数据体 += 数据);
        请求.on('end', () => {
            try {
                const 用户信息 = JSON.parse(数据体);
                console.log('请求体:', 用户信息);
                const 用户列表 = 读取JSON(数据路径.用户);
                const 当前用户 = 用户列表.find(用户 =>
                    用户.用户名 === 用户信息.用户名 &&
                    用户.密码 === 用户信息.密码
                );
                if (当前用户) {
                    const token = `${Date.now()}-${Math.random()}`;
                    用户会话[token] = 当前用户;
                    响应.writeHead(200, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: true, token, 用户: 当前用户 }));
                } else {
                    响应.writeHead(401, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: false, 错误: '用户名或密码错误' }));
                }
            } catch (错误) {
                响应.writeHead(500, { 'Content-Type': 'application/json' });
                响应.end(JSON.stringify({ 成功: false, 错误: '服务器内部错误' }));
            }
        });
        return;
    }
    if (路径名 === '/修改密码' && 请求.method === 'POST') {
        验证权限(请求, 响应, (用户) => {
            let 数据体 = '';
            请求.on('data', (数据) => 数据体 += 数据);
            请求.on('end', () => {
                try {
                    const { 旧密码, 新密码 } = JSON.parse(数据体);

                    // 校验字段
                    if (!旧密码 || !新密码 || typeof 旧密码 !== 'string' || typeof 新密码 !== 'string') {
                        响应.writeHead(400, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: false, 错误: '旧密码和新密码不能为空或格式错误' }));
                        return;
                    }

                    // 读取用户数据
                    const 用户列表 = 读取JSON(数据路径.用户);
                    const 当前用户 = 用户列表.find(u => u.用户名 === 用户.用户名);

                    // 调试用户数据
                    console.log('当前用户:', 当前用户);
                    if (!当前用户 || !当前用户.密码) {
                        响应.writeHead(400, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: false, 错误: '用户数据异常' }));
                        return;
                    }

                    // 验证旧密码
                    if (当前用户.密码 === 旧密码) {
                        当前用户.密码 = 新密码; // 更新密码
                        写入JSON(数据路径.用户, 用户列表); // 保存到文件

                        响应.writeHead(200, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: true }));
                    } else {
                        响应.writeHead(400, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: false, 错误: '旧密码不正确' }));
                    }
                } catch (错误) {
                    响应.writeHead(500, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: false, 错误: '服务器内部错误' }));
                }
            });
        });
        return;
    }
    if (路径名 === '/获取当前用户' && 请求.method === 'GET') {
        验证权限(请求, 响应, (用户) => {
            响应.writeHead(200, { 'Content-Type': 'application/json' });
            响应.end(JSON.stringify({ 成功: true, 用户 }));
        });
        return;
    }
    if (路径名 === '/获取项目进展' && 请求.method === 'GET') {
        验证权限(请求, 响应, (用户) => {
            const 项目进展数据 = 读取JSON(数据路径.项目进展);
            if (用户.角色 === '管理员') {
                响应.writeHead(200, { 'Content-Type': 'application/json' });
                响应.end(JSON.stringify({ 成功: true, 数据: 项目进展数据 }));
            } else {
                const 过滤数据 = 项目进展数据.filter(项目 => 项目.填写人员 === 用户.用户名);
                响应.writeHead(200, { 'Content-Type': 'application/json' });
                响应.end(JSON.stringify({ 成功: true, 数据: 过滤数据 }));
            }
        });
        return;
    }
    function 生成唯一ID() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    if (路径名 === '/添加项目进展' && 请求.method === 'POST') {
        验证权限(请求, 响应, (用户) => {
            let 数据体 = '';
            请求.on('data', (数据) => 数据体 += 数据);
            请求.on('end', () => {
                try {
                    const 新项目 = JSON.parse(数据体);
                    if (!新项目.项目名称 || !新项目.项目代号) {
                        响应.writeHead(400, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: false, 错误: '项目名称或项目代号不能为空' }));
                        return;
                    }
                    新项目.填写人员 = 用户.用户名;
                    新项目.创建时间 = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
                    新项目.创建人 = 用户.用户名;
                    新项目.ID = 生成唯一ID();
                    const 项目进展数据 = 读取JSON(数据路径.项目进展);
                    项目进展数据.push(新项目);
                    写入JSON(数据路径.项目进展, 项目进展数据);
                    记录审计追踪(数据路径.项目进展审计追踪, '新增', 用户.用户名, {
                        旧数据: {},
                        新数据: 新项目
                    });
                    响应.writeHead(200, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: true, ID: 新项目.ID }));
                } catch (错误) {
                    响应.writeHead(500, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: false, 错误: '服务器内部错误' }));
                }
            });
        });
        return;
    }
    if (路径名 === '/修改项目进展' && 请求.method === 'PUT') {
        验证权限(请求, 响应, (用户) => {
            let 数据体 = '';
            请求.on('data', (数据) => 数据体 += 数据);
            请求.on('end', () => {
                try {
                    const 修改数据 = JSON.parse(数据体);
                    const 项目进展数据 = 读取JSON(数据路径.项目进展);
                    const 目标项目 = 项目进展数据.find(项目 => 项目.ID === 修改数据.ID);
                    if (目标项目 && (用户.角色 === '管理员' || 目标项目.填写人员 === 用户.用户名)) {
                        const 旧数据 = { ...目标项目 };
                        Object.assign(目标项目, 修改数据);
                        写入JSON(数据路径.项目进展, 项目进展数据);
                        记录审计追踪(数据路径.项目进展审计追踪, '修改', 用户.用户名, {
                            旧数据: 旧数据,
                            新数据: 目标项目
                        });
                        响应.writeHead(200, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: true }));
                    } else {
                        响应.writeHead(404, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: false, 错误: '项目未找到或无权限' }));
                    }
                } catch (错误) {
                    响应.writeHead(500, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: false, 错误: '服务器内部错误' }));
                }
            });
        });
        return;
    }
    if (路径名.startsWith('/删除项目进展') && 请求.method === 'DELETE') {
        验证权限(请求, 响应, (用户) => {
            const 查询参数 = url.parse(请求.url, true).query;
            const 项目ID = 查询参数.ID;
            if (!项目ID) {
                响应.writeHead(400, { 'Content-Type': 'application/json' });
                响应.end(JSON.stringify({ 成功: false, 错误: '项目ID不能为空' }));
                return;
            }
            const 项目进展数据 = 读取JSON(数据路径.项目进展);
            const 目标项目索引 = 项目进展数据.findIndex(项目 => 项目.ID === 项目ID);
            if (目标项目索引 !== -1) {
                const 目标项目 = 项目进展数据[目标项目索引];
                if (用户.角色 === '管理员' || 目标项目.填写人员 === 用户.用户名) {
                    项目进展数据.splice(目标项目索引, 1);
                    写入JSON(数据路径.项目进展, 项目进展数据);
                    记录审计追踪(数据路径.项目进展审计追踪, '删除', 用户.用户名, {
                        旧数据: 目标项目,
                        新数据: {}
                    });
                    响应.writeHead(200, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: true }));
                } else {
                    响应.writeHead(403, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: false, 错误: '无权限删除该项目' }));
                }
            } else {
                响应.writeHead(404, { 'Content-Type': 'application/json' });
                响应.end(JSON.stringify({ 成功: false, 错误: '项目未找到' }));
            }
        });
        return;
    }
    if (路径名 === '/获取项目进展审计追踪' && 请求.method === 'GET') {
        验证权限(请求, 响应, (用户) => {
            const 审计追踪数据 = 读取JSON(数据路径.项目进展审计追踪);
            const 有效数据 = 审计追踪数据.filter(记录 => Object.keys(记录).length > 0);
            let 过滤数据;
            if (用户.角色 === '管理员') {
                过滤数据 = 有效数据;
            } else {
                过滤数据 = 有效数据.filter(记录 => 记录.用户 === 用户.用户名);
            }
            响应.writeHead(200, { 'Content-Type': 'application/json' });
            响应.end(JSON.stringify(过滤数据));
        });
        return;
    }

    // 获取项目资料
    if (路径名 === '/获取项目资料' && 请求.method === 'GET') {
        验证权限(请求, 响应, (用户) => {
            const 项目资料数据 = 读取JSON(数据路径.项目资料);
            if (用户.角色 === '管理员') {
                响应.writeHead(200, { 'Content-Type': 'application/json' });
                响应.end(JSON.stringify({ 成功: true, 数据: 项目资料数据 }));
            } else {
                const 过滤数据 = 项目资料数据.filter(资料 => 资料.填写人员 === 用户.用户名);
                响应.writeHead(200, { 'Content-Type': 'application/json' });
                响应.end(JSON.stringify({ 成功: true, 数据: 过滤数据 }));
            }
        });
        return;
    }

    // 添加项目资料
    if (路径名 === '/添加项目资料' && 请求.method === 'POST') {
        验证权限(请求, 响应, (用户) => {
            let 数据体 = '';
            请求.on('data', (数据) => 数据体 += 数据);
            请求.on('end', () => {
                try {
                    const 新资料 = JSON.parse(数据体);
                    if (!新资料.项目名称代号 || !新资料.组) {
                        响应.writeHead(400, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: false, 错误: '必填字段不能为空' }));
                        return;
                    }
                    新资料.ID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    新资料.创建时间 = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
                    新资料.创建人 = 用户.用户名;
                    新资料.填写人员 = 用户.用户名;

                    const 项目资料数据 = 读取JSON(数据路径.项目资料);
                    项目资料数据.push(新资料);
                    写入JSON(数据路径.项目资料, 项目资料数据);

                    记录审计追踪(数据路径.项目资料审计追踪, '新增', 用户.用户名, {
                        旧数据: {},
                        新数据: 新资料
                    });

                    响应.writeHead(200, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: true, ID: 新资料.ID }));
                } catch (错误) {
                    响应.writeHead(500, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: false, 错误: '服务器内部错误' }));
                }
            });
        });
        return;
    }

    // 修改项目资料
    if (路径名 === '/修改项目资料' && 请求.method === 'PUT') {
        验证权限(请求, 响应, (用户) => {
            let 数据体 = '';
            请求.on('data', (数据) => 数据体 += 数据);
            请求.on('end', () => {
                try {
                    const 修改数据 = JSON.parse(数据体);
                    const 项目资料数据 = 读取JSON(数据路径.项目资料);
                    const 目标资料 = 项目资料数据.find(资料 => 资料.ID === 修改数据.ID);

                    if (目标资料 && (用户.角色 === '管理员' || 目标资料.填写人员 === 用户.用户名)) {
                        const 旧数据 = { ...目标资料 };
                        Object.assign(目标资料, 修改数据);
                        写入JSON(数据路径.项目资料, 项目资料数据);

                        记录审计追踪(数据路径.项目资料审计追踪, '修改', 用户.用户名, {
                            旧数据: 旧数据,
                            新数据: 目标资料
                        });

                        响应.writeHead(200, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: true }));
                    } else {
                        响应.writeHead(404, { 'Content-Type': 'application/json' });
                        响应.end(JSON.stringify({ 成功: false, 错误: '资料未找到或无权限' }));
                    }
                } catch (错误) {
                    响应.writeHead(500, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: false, 错误: '服务器内部错误' }));
                }
            });
        });
        return;
    }

    // 删除项目资料
    if (路径名.startsWith('/删除项目资料') && 请求.method === 'DELETE') {
        验证权限(请求, 响应, (用户) => {
            const 查询参数 = url.parse(请求.url, true).query;
            const 资料ID = 查询参数.ID;
            if (!资料ID) {
                响应.writeHead(400, { 'Content-Type': 'application/json' });
                响应.end(JSON.stringify({ 成功: false, 错误: '资料ID不能为空' }));
                return;
            }

            const 项目资料数据 = 读取JSON(数据路径.项目资料);
            const 目标资料索引 = 项目资料数据.findIndex(资料 => 资料.ID === 资料ID);

            if (目标资料索引 !== -1) {
                const 目标资料 = 项目资料数据[目标资料索引];
                if (用户.角色 === '管理员' || 目标资料.填写人员 === 用户.用户名) {
                    项目资料数据.splice(目标资料索引, 1);
                    写入JSON(数据路径.项目资料, 项目资料数据);

                    记录审计追踪(数据路径.项目资料审计追踪, '删除', 用户.用户名, {
                        旧数据: 目标资料,
                        新数据: {}
                    });

                    响应.writeHead(200, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: true }));
                } else {
                    响应.writeHead(403, { 'Content-Type': 'application/json' });
                    响应.end(JSON.stringify({ 成功: false, 错误: '无权限删除该资料' }));
                }
            } else {
                响应.writeHead(404, { 'Content-Type': 'application/json' });
                响应.end(JSON.stringify({ 成功: false, 错误: '资料未找到' }));
            }
        });
        return;
    }

    // 获取项目资料审计追踪
    if (路径名 === '/获取项目资料审计追踪' && 请求.method === 'GET') {
        验证权限(请求, 响应, (用户) => {
            const 审计追踪数据 = 读取JSON(数据路径.项目资料审计追踪);
            const 有效数据 = 审计追踪数据.filter(记录 => Object.keys(记录).length > 0);
            let 过滤数据;
            if (用户.角色 === '管理员') {
                过滤数据 = 有效数据;
            } else {
                过滤数据 = 有效数据.filter(记录 => 记录.用户 === 用户.用户名);
            }
            响应.writeHead(200, { 'Content-Type': 'application/json' });
            响应.end(JSON.stringify(过滤数据));
        });
        return;
    }
    响应.writeHead(404, { 'Content-Type': 'text/plain' });
    响应.end('无效请求');
});
服务器.listen(3000, () => {
    console.log('服务器已启动，监听端口3000');
});