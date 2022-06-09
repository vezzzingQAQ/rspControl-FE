var effectController;
var uniforms;
var sunLight;
var frameCount = 0;

var mapNum = (p, fp, tp, fa, ta) => {
    try {
        return ((fa * p - fa * tp - ta * p + ta * fp) / (fp - tp));
    } catch {
        throw new Error("使用map错误");
    }
}

function initSky() {
    sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    sun = new THREE.Vector3();
    effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 40,
        azimuth: 180,
        exposure: renderer.toneMappingExposure
    };
    uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(sun);
    // 方向光
    sunLight = new THREE.DirectionalLight(0xffffff, 1);
    // 设置光源位置
    sunLight.position.set(sun.x, sun.y, sun.z);
    scene.add(sunLight);
}

function changeTime(time) {
    // 改变shader天空
    effectController.elevation = time;
    uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
    sun = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(sun);
    sunLight.position.set(sun.x, sun.y, sun.z);

    let finTime = ((time) / 360 + 0.25) * 24;
    // 修改体积雾
    let currentSkyColor;
    if (finTime <= 6) {
        currentSkyColor = new THREE.Color(0x000000);
    } else if (finTime <= 7) {
        currentSkyColor = new THREE.Color(mapNum(finTime, 6, 7, 0, 1), mapNum(finTime, 6, 7, 0, 0.5), mapNum(finTime, 6, 7, 0, 0.3));
    } else if (finTime <= 9) {
        currentSkyColor = new THREE.Color(1, mapNum(finTime, 7, 9, 0.5, 1), mapNum(finTime, 7, 9, 0.3, 1));
    } else if (finTime <= 15) {
        currentSkyColor = new THREE.Color(1, 1, 1);
    } else if (finTime <= 17) {
        currentSkyColor = new THREE.Color(1, mapNum(finTime, 15, 17, 1, 0.5), mapNum(finTime, 15, 17, 1, 0));
    } else if (finTime <= 18) {
        currentSkyColor = new THREE.Color(mapNum(finTime, 17, 18, 1, 0), mapNum(finTime, 17, 18, 0.5, 0), 0);
    } else {
        currentSkyColor = new THREE.Color(0, 0, 0);
    }
    scene.fog.color = currentSkyColor;
    // 修改天光
    sunLight.color = currentSkyColor;
}

var renderer;
function initRender() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(document.querySelector(".modelDisplayPan").offsetWidth, document.querySelector(".modelDisplayPan").offsetHeight);
    //告诉渲染器需要阴影效果
    renderer.shadowMapEnabled = true;
    renderer.setClearColor(new THREE.Color(255, 255, 255), 1); //设置背景颜色
    document.querySelector(".modelDisplayPan").appendChild(renderer.domElement);
}

var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, document.querySelector(".modelDisplayPan").offsetWidth / document.querySelector(".modelDisplayPan").offsetHeight, 0.1, 1000);
    camera.position.set(0, 40, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

var scene;
function initScene() {
    scene = new THREE.Scene();
    // 添加体积雾
    scene.fog = new THREE.FogExp2(0x222222, 0.005);
}


var hemiLight;
function initLight() {
    hemiLight = new THREE.HemisphereLight(new THREE.Color(1, 0, 0), new THREE.Color(0, 0, 1), 0.4);//从地面发射光线的颜色，从天空发射光线的颜色，光线强度
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);
}

function changHemiLightDensity(value) {
    hemiLight.intensity = value;
}

var c_light;
function add_c_light() {
    c_light = new THREE.PointLight(0xffffff);
    c_light.position.set(0, -20, 0);
    c_light.visible = true;
    // //告诉平行光需要开启阴影投射
    // c_light.castShadow = true;
    // //阴影抗锯齿
    // c_light.shadow.camera.near = 1;
    // c_light.shadow.camera.far = 12300;
    // c_light.shadow.mapSize.width = 11024;
    // c_light.shadow.mapSize.height = 11024;
    // c_light.intensity = 2;
    scene.add(c_light);
}

var rgb_light;
function add_rgb_light() {
    rgb_light = new THREE.SpotLight(new THREE.Color(1, 0, 1));
    rgb_light.angle = Math.PI / 6.5;
    // rgb_light.distance = 50;
    // rgb_light.shadow.bias = 0.001;
    rgb_light.position.set(0, 40, 0);
    rgb_light.visible = true;
    let target = new THREE.Object3D();
    target.position.set(0, 20, 0);
    scene.add(target);
    rgb_light.target = target;
    // //告诉平行光需要开启阴影投射
    // rgb_light.castShadow = true;
    // //阴影抗锯齿
    // rgb_light.shadow.camera.near = 1;
    // rgb_light.shadow.camera.far = 12300;
    // rgb_light.shadow.mapSize.width = 11024;
    // rgb_light.shadow.mapSize.height = 11024;
    scene.add(rgb_light);
}

var ws_light = [];
function add_ws_light() {
    for (let i = 0; i <= 15; i++) {
        let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        let material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
        });
        let cube = new THREE.Mesh(geometry);
        cube.material = material;
        scene.add(cube);
        let light = new THREE.SpotLight(0xffffff);
        light.intensity = 0.2;
        light.visible = true;
        scene.add(light);
        ws_light.push({
            cube: cube,
            light: light,
        });
    }
    // 设置灯的位置
    for (let i = 0; i <= 3; i++) {
        ws_light[i].cube.position.set(-18, i * 5 - 3, 9);
        ws_light[i].light.position.set(-18, i * 5 - 3, 9);
    }
    for (let i = 4; i <= 7; i++) {
        ws_light[i].cube.position.set(-18, 16, 25 - i * 5);
        ws_light[i].light.position.set(-18, 16, 25 - i * 5);
    }
    for (let i = 8; i <= 11; i++) {
        ws_light[i].cube.position.set(-18, (4 - (i - 8)) * 5 - 8, -13);
        ws_light[i].light.position.set(-18, (4 - (i - 8)) * 5 - 8, -13);
    }
    for (let i = 12; i <= 15; i++) {
        ws_light[i].cube.position.set(-18, -6, -9.5 - (4 - (i - 8)) * 5);
        ws_light[i].light.position.set(-18, -6, -9.5 - (4 - (i - 8)) * 5);
    }
}

function initModel() {
    //加载fbx格式的模型
    var loader = new THREE.FBXLoader();
    loader.load("./src/models/model5.fbx", function (loadedMesh) {
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true, // 设置为true，opacity才会生效
            opacity: 0.5,
        });
        loadedMesh.children.forEach(function (child) {
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
        });
        loadedMesh.castShadow = true;
        loadedMesh.receiveShadow = true;
        let scaleRate = 0.1;
        loadedMesh.scale.set(scaleRate, scaleRate, scaleRate);
        scene.add(loadedMesh);
    });
    // 地面
    var planeGeometry = new THREE.PlaneGeometry(3500, 2500);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 520
    });
    // 平面网格模型作为投影面
    var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotateX(-Math.PI / 2);
    planeMesh.position.y = -38;
    // 设置接收阴影的投影面
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);
}


var controls;
function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;
    //是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    controls.autoRotate = false;
    //设置相机距离原点的最远距离
    controls.minDistance = 1;
    //设置相机距离原点的最远距离
    controls.maxDistance = 1500;
    //是否开启右键拖拽
    controls.enablePan = true;
}

function render() {

    renderer.render(scene, camera);
}

//窗口变动触发的函数
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    //更新控制器
    render();
    frameCount++;
    controls.update();

    requestAnimationFrame(animate);
}

function draw() {
    initRender();
    initScene();
    initCamera();
    initSky();
    initLight();
    add_c_light();
    add_rgb_light();
    add_ws_light();
    initModel();
    initControls();

    animate();
    window.onresize = onWindowResize;
}