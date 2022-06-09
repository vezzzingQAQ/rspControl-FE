// 硬件控制包
// 202205012

var TIME_HOUR;
var TIME_MINUTE;
var TIME_SECOND;
var IS_NIGNT;
var IS_MORNING;
var IS_AFTERNOON;
var IS_NIGHT;

var MAIN_LED = {
    brightness: 0,
    isOn: false,
    isOff: true,
    setBrightness(brightness) {
        vm.brightness = brightness;
        this.brightness = brightness;
    },
    on() {
        this.isOn = true;
        this.isOff = false;
        vm.brightness = 100;
        this.brightness = 100;
    },
    off() {
        this.isOn = false;
        this.isOff = true;
        vm.brightness = 0;
        this.brightness = 0;
    },
    toggle() {
        if (this.isOn) {
            this.off();
        } else {
            this.on();
        }
    }
}

var RGB_LED = {
    r: 0,
    g: 0,
    b: 0,
    setR(rValue) {
        this.setRGB(rValue, this.g, this.b);
    },
    setG(gValue) {
        this.setRGB(this.r, gValue, this.b);
    },
    setB(bValue) {
        this.setRGB(this.r, this.g, bValue);
    },
    setRandom() {
        this.setRGB(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
    },
    setRGB(rValue, gValue, bValue) {
        let rStr = parseInt(rValue, 10).toString(16);
        if (rStr.length == 1) {
            rStr = "0" + rStr;
        }
        let gStr = parseInt(gValue, 10).toString(16);
        if (gStr.length == 1) {
            gStr = "0" + gStr;
        }
        let bStr = parseInt(bValue, 10).toString(16);
        if (bStr.length == 1) {
            bStr = "0" + bStr;
        }
        this.r = rValue;
        this.g = gValue;
        this.b = bValue;
        let colorStr = "#" + rStr + gStr + bStr;
        vm.color16 = colorStr;
    },
    setHSV(h, s, v) {
        let rgb = HSVtoRGB(h, s, v);
        this.setRGB(rgb[0], rgb[1], rgb[2]);
    }
}

var WS_LED = {
    r: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    g: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    b: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setR(rValue, index) {
        this.setRGB(rValue, this.g[index], this.b[index], index);
    },
    setG(gValue, index) {
        this.setRGB(this.r[index], gValue, this.b[index], index);
    },
    setB(bValue, index) {
        this.setRGB(this.r[index], this.g[index], bValue, index);
    },
    setRandom(index) {
        this.setRGB(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), index);
    },
    setRGB(rValue, gValue, bValue, index) {
        this.r[index] = Math.floor(rValue);
        this.g[index] = Math.floor(gValue);
        this.b[index] = Math.floor(bValue);
        vm.changeWS2812LED(Math.floor(rValue), Math.floor(gValue), Math.floor(bValue), index);
    },
    setHSV(h, s, v, index) {
        let rgb = HSVtoRGB(h, s, v);
        this.setRGB(rgb[0], rgb[1], rgb[2], index);
    },
    clearAll() {
        for (let i = 0; i < 16; i++) {
            this.setRGB(0, 0, 0, i);
        }
    }
}