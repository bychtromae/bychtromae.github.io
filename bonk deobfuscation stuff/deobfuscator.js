function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute(
        'href',
        'data:application/javascript;charset=utf-8,' + encodeURIComponent(text)
    );
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

fetch("https://bychtromae.github.io/bonk%20deobfuscation%20stuff/source_formatted.js")
    .then(res => res.text())
    .then(deobfuscateSource);

function deobfuscateSource(src) {
    let deobfuscatedSource = src;
    for (var i = 0; i < 3899; i++) {
        deobfuscatedSource = deobfuscatedSource.replaceAll("P2ff.p9i("+i+")",'"'+P2ff.p9i(i)+'"');
        deobfuscatedSource = deobfuscatedSource.replaceAll("P2ff.L9i("+i+")",'"'+P2ff.p9i(i)+'"');
        deobfuscatedSource = deobfuscatedSource.replaceAll("i0v.p9i("+i+")",'"'+P2ff.p9i(i)+'"');
        deobfuscatedSource = deobfuscatedSource.replaceAll("i0v.L9i("+i+")",'"'+P2ff.p9i(i)+'"');
    }
    download("deobfuscated-pass1.js",deobfuscatedSource);
}