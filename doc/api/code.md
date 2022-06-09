### 新建储存

##### 请求消息

```url
POST /api/codes/addProject
```

##### 参数

```url
jwt:jwt
name:项目名称
intro:简介
code:代码
rewrite:是否重写
```

##### 响应消息

1.项目名已存在

```json
{
    "state": 1,
    "content": {
        "name":projectName,
        "id": -1,
        "nameOccupied": true
    }
}
```

2.成功上传

```json
{
    "state": 1,
    "content": {
        "name":projectName,
        "id": pid,
        "nameOccupied": false
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

### 获取项目列表

##### 请求消息

```url
POST /api/codes/getAllProjects
```

##### 参数

```url
jwt:jwt
```

##### 响应消息

1.成功

```json
{
    "state": 1,
    "content":{
        "projects":[
            {
                "id": pid,
                "name": projectName,
                "intro": intro,
                "createTime": createTime
            }
            ...
        ]
    }
}
```

2.未知错误

```json
{
    "state": 9
}
```

---

### 获取相应的项目

##### 请求消息

```url
POST /api/codes/getProject
```

##### 参数

```url
id:pid
jwt:jwt
```

##### 响应消息

1.成功

```json
{
    "state": 1,
    "content":{
        "id": pid,
        "name": projectName,
        "intro": intro,
        "createTime": createTime,
        "code": code
    }
}
```

2.未知错误

```json
{
    "state": 9
}
```

---

### 删除相应的项目

##### 请求消息

```url
POST /api/codes/delProject
```

##### 参数

```url
id:pid
jwt:jwt
```

##### 响应消息

1.成功

```json
{
    "state": 1,
    "content":{
        "id": pid,
        "name": projectName,
    }
}
```

2.未知错误

```json
{
    "state": 9
}
```
