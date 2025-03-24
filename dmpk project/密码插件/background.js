// 固定密码
const FIXED_PASSWORD = 'G7#pL9@qX2!mR5&v';

// 向后端发送密码验证请求
async function 获取临时令牌() {
  try {
    const 响应 = await fetch('http://192.168.152.169:3000/验证插件密码', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: FIXED_PASSWORD }),
    });
    const 数据 = await 响应.json();
    if (数据.success) {
      return 数据.token; // 返回临时令牌
    } else {
      console.error('插件密码验证失败');
      return null;
    }
  } catch (错误) {
    console.error('服务器连接失败:', 错误);
    return null;
  }
}

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === '获取临时令牌') {
    获取临时令牌().then((token) => {
      sendResponse({ token });
    });
    return true; // 表示异步响应
  }
});