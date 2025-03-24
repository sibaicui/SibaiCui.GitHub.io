// 请先安装 OpenAI SDK: `npm install openai`
// 确保你已经安装了 Node.js

import OpenAI from "openai";
import readline from 'readline';
import { spawn } from 'child_process';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: '你的Key'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function generateCode(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "你是一个乐于助人的助手，负责生成适用于 Windows 的批处理脚本 (.bat)。请仅返回纯批处理脚本代码，不包含任何注释或其他非代码内容。" },
      { role: "user", content: prompt }
    ],
    model: "deepseek-chat",
  });

  return completion.choices[0].message.content;
}

async function executeCode(code) {
  // 去除 Markdown 格式的代码块符号
  const batchCode = code.replace(/```batch|```/g, '').trim();
  console.log('要执行的脚本:\n', batchCode); // 添加日志
  try {
    // 使用 spawn 执行批处理脚本
    const child = spawn('cmd.exe', ['/c', batchCode]);

    child.stdout.on('data', (data) => {
      console.log(`脚本执行成功，输出: ${data}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`脚本执行时有错误输出: ${data}`);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`脚本执行时出错，退出码: ${code}`);
      } else {
        console.log('脚本执行完成。');
      }
    });
  } catch (error) {
    console.error("执行脚本时出错:", error);
  }
}

async function handleConversation() {
  rl.question('请输入你的自然语言指令 (输入 "exit" 退出): ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('退出程序。');
      rl.close();
      return;
    }
    console.log('生成脚本中...');
    const code = await generateCode(input);
    console.log('生成的脚本:\n', code);
    rl.question('是否要执行这段脚本? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('执行脚本中...');
        await executeCode(code);
      } else {
        console.log('脚本执行已中止。');
      }
      handleConversation();
    });
  });
}

async function main() {
  handleConversation();
}

main();