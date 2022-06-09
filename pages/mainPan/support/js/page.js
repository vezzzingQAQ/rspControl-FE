var vm = new Vue({
    el: ".container",
    data: {
        isLogin: false,

        userName: "",

        brightness: 50,

        currentTime: 40,
        isTimeGo: true,

        chrRender: 0.41,

        colorPicker: null,
        color16: "#c95d5d",

        customCode:
            `// 输入自定义的控制代码
// shift+鼠标滚轮左右滑动
if (IS_NIGNT) {
    MAIN_LED.setBrightness(100);
} else {
    MAIN_LED.setBrightness(0);
}
// MAIN_LED.setBrightness(Math.sin(TIME_HOUR)*100+100);   
// RGB_LED.setRGB(255,0,0);   
if (IS_NIGNT) {
    RGB_LED.setHSV(
        TIME_HOUR/24*3360,
        1,
        1
    );   
} else {
    RGB_LED.setRGB(0,0,0);
}                      
`,
        codeName: "未名代码",
        codeIntro: "",
        codesList: [],
        isRewrite: false,
        isHaveError: false,
        isRunCode: false,

        wsColor: [
            {
                r: 0,
                g: 0,
                b: 0
            },
        ]
    },
    // 页面加载完成后执行,执行异步任务
    mounted() {
        this.checkIsLogIn();
        this.getUserName();
        this.initColorPicker();
        // three.js加载模型
        draw();
        // 初始化编辑器
        initCodeEditor();
        // 获取代码列表
        this.getAllProjects();
        // 初始化ws2812
        for (let i = 1; i <= 15; i++) {
            this.wsColor.push({
                r: 0,
                g: 0,
                b: 0
            });
        }
        for (let i = 0; i < this.wsColor.length; i++) {
            this.changeWS2812LED(0, 0, 0, i);
        }
        // 时间自动变化
        setInterval(() => {
            if (this.isTimeGo) {
                if (this.currentTime < 270) {
                    this.currentTime++;
                } else {
                    this.currentTime = -90;
                }
            } else {
                if (frameCount % 2 == 0) {
                    this.currentTime += 0.01;
                } else {
                    this.currentTime -= 0.01;
                }
            }
        }, 100);
    },
    watch: {
        brightness(newValue) {
            // 更新虚拟灯
            c_light.intensity = newValue / 100 * 1.4;
            // 更新rspPack中的属性
            MAIN_LED.brightness = newValue;
            if (newValue == 0) {
                MAIN_LED.isOn = false;
                MAIN_LED.isOff = true;
            } else {
                MAIN_LED.isOn = true;
                MAIN_LED.isOff = false;
            }
            // 发送请求控制硬件
            let url = source + "/api/leds/setBrightness";
            axios.get(url, {
                params: {
                    brightness: newValue
                }
            }).then((response) => {
                if (getState(response) == 1) {
                    console.log("控制灯光成功");
                } else {
                    showServerErr(response);
                }
            }, (err) => {
                showServerErr(err);
            })
        },
        currentTime: {
            handler(newValue) {
                changeTime(newValue);
                // 更新rspPack的时间
                TIME_HOUR = ((this.currentTime) / 360 + 0.25) * 24;
                TIME_MINUTE = ((this.currentTime) / 360 + 0.25) * 24 * 60;
                TIME_SECOND = ((this.currentTime) / 360 + 0.25) * 24 * 60 * 60;
                if (TIME_HOUR < 6 || TIME_HOUR >= 18) {
                    IS_NIGNT = true;
                    IS_DAY = false;
                } else {
                    IS_NIGNT = false;
                    IS_DAY = true;
                }
                if (TIME_HOUR > 6 && TIME_HOUR < 12) {
                    IS_MORNING = true;
                } else {
                    IS_MORNING = false;
                }
                if (TIME_HOUR >= 12 && TIME_HOUR < 18) {
                    IS_AFTERNOON = true;
                } else {
                    IS_AFTERNOON = false;
                }
                // 运行自定义代码片段
                if (this.isRunCode) {
                    try {
                        var editor_pDate = Date.now();
                        eval(iftc_warp(this.customCode));
                    } catch (err) {
                        console.log("代码错误");
                        console.log(err);
                        this.isHaveError = true;
                        this.isRunCode = false;
                    }
                }
            },
        },
        chrRender: {
            handler(newValue) {
                changHemiLightDensity(newValue);
            }
        },
        color16(newValue) {
            // 更新colorPicker
            this.colorPicker.setColor(newValue);
            this.changeRGBLED();
        },
        customCode(newValue) {
            if (this.isRunCode) {
                try {
                    var editor_pDate = Date.now();
                    eval(iftc_warp(newValue));
                    this.isHaveError = false;
                } catch (err) {
                    console.log("代码错误");
                    console.log(err);
                    this.isHaveError = true;
                    this.isRunCode = false;
                }
            }
        }
    },
    computed: {
        brightnessStyle_obj() {
            let currentColor = this.brightness / 100 * 255;
            let fontColor = 255;
            if (currentColor > 200) {
                fontColor = 0;
            }
            return {
                backgroundColor: `rgb(${currentColor},${currentColor},${currentColor})`,
                color: `rgb(${fontColor},${fontColor},${fontColor})`
            }
        }
    },
    methods: {
        checkIsLogIn() {
            // 获取是否登录
            let url = source + "/api/users/checkIsLogin";
            let param = new URLSearchParams()
            param.append('jwt', getCookie('jwt'));
            axios({
                method: 'post',
                url: url,
                data: param
            }).then((response) => {
                if (getState(response) == 1) {
                    this.isLogin = getContent(response).isLogin;
                    // 未登录跳转到登录页面
                    if (!this.isLogin) {
                        location = localSource + "/pages/registerLoginPage/login.html";
                    }
                } else {
                    showServerErr(response);
                }
            }, (err) => {
                showServerErr(err);
                // location = localSource + "/pages/registerLoginPage/login.html";
            });
        },
        getUserName() {
            // 获取用户名
            let url = source + "/api/users/getUserName";
            let param = new URLSearchParams()
            param.append('jwt', getCookie('jwt'));
            axios({
                method: 'post',
                url: url,
                data: param
            }).then((response) => {
                if (getState(response) == 1) {
                    this.isLogin = getContent(response).isLogin;
                    // 未登录跳转到登录页面
                    if (!this.isLogin) {
                        location = localSource + "/pages/registerLoginPage/login.html";
                    } else {
                        this.userName = getContent(response).userName;
                    }
                } else {
                    showServerErr(response);
                }
            }, (err) => {
                showServerErr(err);
            })
        },
        addProject(is_rewrite) {
            // 更新GUI状态
            this.isRewrite = false;
            // 新增项目到服务器
            let url = source + "/api/codes/addProject";
            let param = new URLSearchParams();
            param.append('jwt', getCookie('jwt'));
            param.append('name', this.codeName);
            param.append('code', this.customCode);
            param.append('intro', this.codeIntro);
            param.append('rewrite', is_rewrite);// 0:不覆盖 1:覆盖
            axios({
                method: 'post',
                url: url,
                data: param
            }).then((response) => {
                if (getState(response) == 1) {
                    // 是否重名?
                    if (getContent(response).nameOccupied) {
                        // 显示控件
                        this.isRewrite = true;
                        return;
                    }
                    // 更新项目列表
                    this.getAllProjects();
                } else {
                    showServerErr(response);
                }
            }, (err) => {
                showServerErr(err);
            })
        },
        cancelRewriteProject() {
            // 取消覆盖
            this.isRewrite = false;
        },
        getAllProjects() {
            // 获取项目列表
            let url = source + "/api/codes/getAllProjects";
            let param = new URLSearchParams();
            param.append('jwt', getCookie('jwt'));
            axios({
                method: 'post',
                url: url,
                data: param
            }).then((response) => {
                if (getState(response) == 1) {
                    this.codesList = getContent(response).projects;
                    // 用省略号代替过长的文本
                    let maxNameLen = 8;
                    let maxIntroLen = 8;
                    this.codesList.forEach((item) => {
                        item.name = item.name.length > maxNameLen ? item.name.substring(0, maxNameLen) + "..." : item.name;
                        item.intro = item.intro.length > maxIntroLen ? item.intro.substring(0, maxIntroLen) + "..." : item.intro;
                    });
                } else {
                    showServerErr(response);
                }
            }, (err) => {
                showServerErr(err);
            })
        },
        getProject(id) {
            // 停止代码
            this.stopCode();
            // 获取指定的项目
            let url = source + "/api/codes/getProject";
            let param = new URLSearchParams();
            param.append('jwt', getCookie('jwt'));
            param.append('id', id);
            axios({
                method: 'post',
                url: url,
                data: param
            }).then((response) => {
                if (getState(response) == 1) {
                    this.codeName = getContent(response).name;
                    this.customCode = getContent(response).code;
                    console.log(getContent(response).code)
                    codeEditor.setValue(this.customCode);
                    this.codeIntro = getContent(response).intro;
                } else {
                    showServerErr(response);
                }
            }, (err) => {
                showServerErr(err);
            })
        },
        logout() {
            // 退出登录
            // 删除jwt
            setCookie("jwt", "", -1);
            location = localSource + "/pages/registerLoginPage/login.html";
        },
        getDisplayTime() {
            return Math.floor(((this.currentTime) / 360 + 0.25) * 24);
        },
        initColorPicker() {
            this.colorPicker = new KellyColorPicker({
                place: 'color-picker',
                size: document.querySelector(".RGBLEDcontrol").offsetWidth,
                input: 'RGBcolorDisplay',
            });
        },
        changeRGBLED() {
            let url = source + "/api/leds/setRGBLED";
            let colorStr = document.querySelector("#RGBcolorDisplay").style.backgroundColor;
            let nums = colorStr.match(/\d+(\.\d+)?/g);
            // 更新虚拟灯
            rgb_light.color = new THREE.Color(nums[0] / 255, nums[1] / 255, nums[2] / 255);
            // 发送请求控制硬件
            axios.get(url, {
                params: {
                    r: parseInt(nums[0]),
                    g: parseInt(nums[1]),
                    b: parseInt(nums[2]),
                }
            }).then((response) => {
                if (getState(response) == 1) {
                    console.log("控制灯光成功");
                } else {
                    showServerErr(response);
                }
            }, (err) => {
                showServerErr(err);
            })
        },
        changeWS2812LED(r, g, b, index) {
            let url = source + "/api/leds/setWS2812";
            // 更新虚拟灯
            ws_light[index].light.color = new THREE.Color(r / 255, g / 255, b / 255);
            ws_light[index].cube.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(r / 255, g / 255, b / 255),
                emissive: new THREE.Color(r / 255, g / 255, b / 255),
                transparent: true,
                opacity: 0.9,
            });
            // 修改GUI
            this.wsColor[index].r = r;
            this.wsColor[index].g = g;
            this.wsColor[index].b = b;
            // if (frameCount % 8 == 0) {// 增加一点延时
            // 发送请求控制硬件
            axios.get(url, {
                params: {
                    r: r,
                    g: g,
                    b: b,
                    index: index,
                }
            }).then((response) => {
                if (getState(response) == 1) {
                    console.log("控制灯光成功");
                } else {
                    showServerErr(response);
                }
            }, (err) => {
                showServerErr(err);
            })
            // }
        },
        runCode() {
            this.isRunCode = true;
            // ws清屏
            for (let i = 0; i <= 15; i++) {
                this.changeRGBLED(0, 0, 0, i);
            }
        },
        stopCode() {
            this.isRunCode = false;
        }
    }
});
