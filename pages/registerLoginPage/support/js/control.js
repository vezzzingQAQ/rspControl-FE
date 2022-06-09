function initDOMControls() {
    let lightDensity_dom = document.querySelector("#lightDensity_dom");
    lightDensity_dom.oninput = function () {
        c_light.intensity = this.value;
    }
}