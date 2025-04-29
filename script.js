// 1. 解析浏览器信息
const parser = new UAParser();
const result = parser.getResult();
const uaInfo = document.getElementById('ua-info');

// 获取Chromium版本
function getChromiumVersion(ua) {
  // 检查是否为基于Chromium的浏览器
  const isChromiumBased = /Chrome\/([0-9.]+)/.test(ua) || /Edg\/([0-9.]+)/.test(ua);
  if (!isChromiumBased) return null;
  
  // 提取Chrome版本号
  const chromeMatch = ua.match(/Chrome\/([0-9.]+)/);
  if (chromeMatch) return chromeMatch[1];
  
  // 对于Edge浏览器，提取其版本号作为Chromium版本
  const edgeMatch = ua.match(/Edg\/([0-9.]+)/);
  if (edgeMatch) return edgeMatch[1];
  
  return null;
}

// 获取浏览器和引擎信息
const chromiumVersion = getChromiumVersion(navigator.userAgent);
const engineInfo = result.engine.name === 'Blink' && chromiumVersion
  ? `Chromium ${chromiumVersion}`
  : `${result.engine.name} ${result.engine.version}`;

// 初始化UA信息显示
function updateUAInfo(ipAddress = '') {
  uaInfo.innerText =
    `浏览器: ${result.browser.name} ${result.browser.version}，引擎: ${engineInfo}，
` +
    `系统: ${result.os.name} ${result.os.version}，
` +
    `用户代理字符串: ${navigator.userAgent}
` +
    `浏览器语言: ${navigator.language}`;
}

// 初始显示，不包含IP
updateUAInfo();

// 监听IP信息加载
window.addEventListener('load', () => {
  if (typeof returnCitySN !== 'undefined' && returnCitySN.cip) {
    updateUAInfo(returnCitySN.cip);
  }
});

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

