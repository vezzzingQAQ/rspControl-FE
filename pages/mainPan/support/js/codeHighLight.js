var codeEditor;
function initCodeEditor() {
    // 实现高亮
    codeEditor = CodeMirror.fromTextArea(document.getElementById("customCode"), {
        mode: "text/javascript",
        lineNumbers: true,
        theme: "dracula",
        scrollbarStyle: "null",
        matchBrackets: true,
        autoCloseBrackets: true,
        tabSize: 4,
        indentUnit: 4,
    });
    // 变化后将代码写回textarea
    codeEditor.on("change", function () {
        vm.customCode = codeEditor.getValue();
    });
}