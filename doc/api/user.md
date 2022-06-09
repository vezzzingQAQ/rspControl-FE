### 获取当前用户名

##### 请求消息

```url
POST /api/users/getUserName
```

##### 参数

```url
jwt:jwt
```

##### 响应消息

1.成功获取

```json
{
    "state": 1,
    "content": {
        "isLogin": true,
        "userName": userName
    }
}
```

2.未登录

```json
{
    "state": 1,
    "content": {
        "isLogin": false,
        "userName": null
    }
}
```

3.未知错误

```json
{
    "state": 9
}
```

---

### 获取是否登录信息

##### 请求消息

```url
POST /api/users/checkIsLogin
```

##### 参数

```url
jwt:jwt
```

##### 响应消息

1.已登录

```json
{
    "state": 1,
    "content": {
        "isLogin": true
    }
}
```

2.未登录

```json
{
    "state": 1,
    "content": {
        "isLogin": false
    }
}
```

3.未知错误

```json
{
    "state": 9
}
```

---

### 用户注册请求

##### 请求消息

```url
POST /api/users/actionRegister
```

##### 参数

```url
userName:userName
passWord:passWord
validCode:validCode
```

##### 响应消息

1.注册成功

```json
{
    "state": 1,
    "content": {
        "userNameValid": true,
        "validCodeValid": true,
        "userName": userName
    }
}
```

2.用户名已经存在

```json
{
    "state": 1,
    "content": {
        "userNameValid": false,
        "validCodeValid": true,
        "userName": userName
    }
}
```

3.邀请码错误

```json
{
    "state": 1,
    "content": {
        "userNameValid": true,
        "validCodeValid": false,
        "userName": userName
    }
}
```

3.未知错误

```json
{
    "state": 9
}
```

---

### 登录请求

##### 请求消息

```url
POST /api/users/actionLogin
```

##### 参数

```url
userName:userName
passWord:passWord
```

##### 响应消息

1.登录成功

```json
{
    "state": 1,
    "content": {
        "isLogin": true,
        "userName": userName,
        "jwt": jwt
    }
}
```

2.登录失败

```json
{
    "state": 1,
    "content": {
        "isLogin": false,
        "userName": userName,
        "jwt": null
    }
}
```

3.未知错误

```json
{
    "state": 9
}
```
