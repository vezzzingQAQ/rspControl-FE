### 20220508
---
### 大致结构和引用库
库文件引入
```html
<script src="./../../support/threejs/three.min.js"></script>
<script src="./../../support/threejs/jsm/OBJLoader.js"></script>
<script src="./../../support/threejs/jsm/OrbitControls.js"></script>
```
一般开发用这个three.min.js就够了，如果要旋转平移缩放，需要OrbitControls.js，这里因为要导入obj所以引用了OBJLoader.js

ThreeJS项目的基本结构
```js
initRender();
initCamera();
initScene();
initLight();
initObject();
initControls();

render();
onWidowResize();
animate();

draw();
```

### 导入obj
引用了OBJLoader.js
```js
function initModel() {
    //加载OBJ格式的模型
    var loader = new THREE.OBJLoader();
    loader.load("./src/main.obj", function (loadedMesh) {
        var material = new THREE.MeshLambertMaterial({ color: 0x5C3A21 });

        // 加载完obj文件是一个场景组，遍历它的子元素，赋值纹理并且更新面和点的发现了
        loadedMesh.children.forEach(function (child) {
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
        });

        //模型放大一百倍
        loadedMesh.scale.set(0.01, 0.01, 0.01);
        scene.add(loadedMesh);
    });
}
```

### 设置背景颜色
在initRender中:
```js
renderer.setClearColor(new THREE.Color(255,255,255), 1); //设置背景颜色
```

### 设置点光源
在initLight中:
```js
var c_light;
function add_c_light() {
    c_light = new THREE.PointLight(0xffffff);
    c_light.position.set(0, 20, 0);
    //告诉平行光需要开启阴影投射
    c_light.castShadow = true;
    //阴影抗锯齿
    c_light.shadow.mapSize.width = 1024;
    c_light.shadow.mapSize.height = 1024;
    c_light.intensity = 2;

    scene.add(c_light);
}
```

### 20220510
---
### 设置透明材质
```js
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true, // 设置为true，opacity才会生效
    opacity: 0.5,
});
```

### 渲染物理天空
引入库文件[sky.js]
initSky
```js
function initSky() {
    sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    sun = new THREE.Vector3();
    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 6,
        azimuth: 180,
        exposure: renderer.toneMappingExposure
    };


    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(sun);

    scene.add(directionalLight);
}
```

### 202205014
---
### 关于SpotLight
可以设置阴影
```js
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
```

### 加载fbx
引入库文件FBXLoader.js和inflate.min.js
```js
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
}
```