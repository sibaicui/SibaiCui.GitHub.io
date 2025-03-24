// 请求背景脚本获取临时令牌
async function 获取并存储令牌() {
  const [响应] = await chrome.runtime.sendMessage({ action: '获取临时令牌' });
  if (响应 && 响应.token) {
    localStorage.setItem('pluginToken', 响应.token); // 将令牌存储到 localStorage
    console.log('插件令牌已存储');
  } else {
    console.error('未能获取插件令牌');
  }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  获取并存储令牌();
});