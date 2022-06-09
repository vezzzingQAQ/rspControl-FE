### 20220508

---

### axios 的使用

#### 创建 get 请求

```js
axios
    .get("/user", {
        params: {
            ID: 12345,
        },
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
```

```js
document.querySelector(".get").onclick = function () {
    axios.get("https://autumnfish.cn/api/joke/list?num=6").then(
        function (response) {
            console.log(response);
        },
        function (err) {
            console.log(err);
        }
    );
};
```

创建 post 请求

```js
axios
    .post("/user", {
        firstName: "Fred",
        lastName: "Flintstone",
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
```

```js
document.querySelector(".post").onclick = function () {
    axios.post("https://autumnfish.cn/api/user/reg", { username: "jc" }).then(
        function (response) {
            console.log(response);
        },
        function (err) {
            console.log(err);
        }
    );
};
```
