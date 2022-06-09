// 检测代码中的死循环
function iftc_warp(codeStr) {
    codeStr = codeStr.replace(/(for\s*\(.*\).*\{)|(for\s*\(.*\))/g, `
        $&
        if(Date.now()-editor_pDate>1000){
            throw new Error("检测到死循环");
        }`);
    codeStr = codeStr.replace(/(while\s*\(.*\).*\{)|(while\s*\(.*\))/g, `
        $&
        if(Date.now()-editor_pDate>1000){
            throw new Error("检测到死循环");
        }`);
    return (codeStr);
}

