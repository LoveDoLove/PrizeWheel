export { loadJSInHtml, loadCSSInHtml, cookiesWriter, cookiesReader };
// Load JS in HTML
function loadJSInHtml(element, src) {
  let script = document.createElement(element);
  script.src = src;
  document.head.appendChild(script);
}
// Load CSS in HTML
function loadCSSInHtml(element, href) {
  let link = document.createElement(element);
  link.href = href;
  link.rel = "stylesheet";
  document.head.appendChild(link);
}
// Cookies Reader and Writer
function cookiesWriter(key, value) {
  let date = new Date();
  date.setTime(date.getTime() + 10 * 60 * 60 * 1000);
  document.cookie = key + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
}
// Cookies Reader
function cookiesReader(key) {
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    if (!cookie) {
      continue;
    }
    let cookieKey = cookie.split("=")[0].trim();
    let cookieValue = cookie.split("=")[1].trim();
    if (cookieKey == key) {
      return cookieValue;
    }
  }
  return null;
}
loadJSInHtml("script", "/libs/boxDialog/dist/js/boxDialog.min.js");
loadCSSInHtml("link", "/libs/boxDialog/src/skins/default.css");
