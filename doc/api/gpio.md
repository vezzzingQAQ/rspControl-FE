### 修改 LED 亮度

##### 请求消息

```url
GET /api/leds/setBrightness
```

##### 参数

```url
brightness:brightness【0-100】
```

##### GPIO信息
BCM:26-高电平控制

##### 响应消息

1.成功

```json
{
    "state": 1
}
```

2.未知错误

```json
{
    "state": 9
}
```

---

### 重置RGB-LED

##### 请求消息

```url
GET /api/leds/setRGBLED
```

##### 参数

```url
r:r【0-255】
g:g【0-255】
b:b【0-255】
```

##### GPIO信息
BCM:16-高电平控制-R
BSM:20-高电平控制-G
BCM:21-高电平控制-B

##### 响应消息

1.成功

```json
{
    "state": 1
}
```

2.未知错误

```json
{
    "state": 9
}
```

---

### 重置GPIO引脚

##### 请求消息

```url
GET /api/leds/clearGPIO
```

##### 响应消息

1.成功

```json
{
    "state": 1
}
```

2.未知错误

```json
{
    "state": 9
}
```

