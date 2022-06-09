function getState(obj) {
    // 获取相应的状态
    // 1表示成功,9表示后端的未知错误
    return obj.data.state;
}

function getContent(obj) {
    // 获取相应的内容
    return obj.data.content;
}

function showServerErr(err) {
    // err的情况
    // alert("服务器貌似崩了2333");
    console.log(err);
}

function setCookie(cname, cvalue, exdays = 1) {
    // 设置cookie
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    // 获取cookie
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setJwt(jwt) {
    // 设置jwt的cookie
    let cdate = new Date();
    cdate.setDate(cdate.getDate() + 14);
    let expireDate = cdate.toGMTString();
    setCookie("jwt", jwt, expireDate);
}

function getJwt() {
    // 获取jwt
    return getCookie("jwt");
}

function set16ToRgb(str) {
    // 16位颜色值->RGB
    var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
    if (!reg.test(str)) { return; }
    let newStr = (str.toLowerCase()).replace(/\#/g, '')
    let len = newStr.length;
    if (len == 3) {
        let t = ''
        for (var i = 0; i < len; i++) {
            t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
        }
        newStr = t
    }
    let arr = []; //将字符串分隔，两个两个的分隔
    for (var i = 0; i < 6; i = i + 2) {
        let s = newStr.slice(i, i + 2)
        arr.push(parseInt("0x" + s))
    }
    return arr;
}

function HSVtoRGB(h, s, v) {
    let i, f, p1, p2, p3;
    let r = 0, g = 0, b = 0;
    if (s < 0) s = 0;
    if (s > 1) s = 1;
    if (v < 0) v = 0;
    if (v > 1) v = 1;
    h %= 360;
    if (h < 0) h += 360;
    h /= 60;
    i = Math.floor(h);
    f = h - i;
    p1 = v * (1 - s);
    p2 = v * (1 - s * f);
    p3 = v * (1 - s * (1 - f));
    switch (i) {
        case 0: r = v; g = p3; b = p1; break;
        case 1: r = p2; g = v; b = p1; break;
        case 2: r = p1; g = v; b = p3; break;
        case 3: r = p1; g = p2; b = v; break;
        case 4: r = p3; g = p1; b = v; break;
        case 5: r = v; g = p1; b = p2; break;
    }
    return [r * 255, g * 255, b * 255];
}
