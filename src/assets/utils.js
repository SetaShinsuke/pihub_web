export function copyToClipboard(text) {
    console.log("Start copy...");
    var el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    console.log("Copied!");
}

export function importScript(scriptUrl) {
    let externalScript = document.createElement('script');
    externalScript.setAttribute('src', scriptUrl);
    document.head.appendChild(externalScript);
}