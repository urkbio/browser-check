// 1. 解析浏览器信息
const parser = new UAParser();
const result = parser.getResult();
const uaInfo = document.getElementById('ua-info');
uaInfo.innerText =
  `浏览器: ${result.browser.name} ${result.browser.version}，引擎: ${result.engine.name} ${result.engine.version}，` +
  `系统: ${result.os.name} ${result.os.version}`;

// 2. 检测动态 import() 支持的辅助函数
function supportsDynamicImport() {
  try {
    // 在运行时解析 import()，如果不支持则抛出语法错误
    new Function("return import('data:text/javascript,')");
    return true;
  } catch (e) {
    return false;
  }
}

// 3. 定义要检测的特性
const features = [
  {
    name: 'JavaScript: 箭头函数',
    test: () => {
      try { eval('()=>{}'); return true; } catch { return false; }
    }
  },
  {
    name: 'JavaScript: 异步函数',
    test: () => {
      try { eval('async function f(){}'); return true; } catch { return false; }
    }
  },
  { name: 'Promise', test: () => typeof Promise !== 'undefined' },
  { name: '动态 import()', test: supportsDynamicImport },
  { name: 'Fetch API', test: () => typeof fetch === 'function' },
  { name: 'Cookie 支持', test: () => navigator.cookieEnabled },
  { name: 'CSS Grid 布局', test: () => CSS.supports('display', 'grid') },
  { name: 'CSS 变量', test: () => CSS.supports('--foo', 'red') },
  {
    name: '暗色模式偏好',
    test: () => {
      return typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all';
    }
  },
  { name: 'File System Access API', test: () => 'showOpenFilePicker' in window }
];

// 4. 渲染检测结果
const ul = document.getElementById('feature-list');
features.forEach(f => {
  const li = document.createElement('li');
  const ok = f.test();
  li.className = ok ? 'supported' : 'unsupported';
  li.textContent = `${f.name}：${ok ? '✅' : '❌'}`;
  ul.appendChild(li);
});

