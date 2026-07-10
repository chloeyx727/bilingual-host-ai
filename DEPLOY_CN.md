# 国内服务器部署说明

这个版本适合部署到腾讯云、阿里云、华为云等国内云服务器。前端和后端会部署在同一台服务器上，用户只需要访问一个地址。

## 推荐服务器

- 系统：Ubuntu 22.04 LTS
- 配置：2 核 CPU、2GB 内存起步
- 地区：中国大陆节点访问更稳定，但公开绑定域名通常需要 ICP 备案
- 端口：放行 80；如果配置 HTTPS，再放行 443

## 服务器第一次安装

登录服务器后执行：

```bash
sudo apt update
sudo apt install -y git curl docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

## 上传项目

如果代码已经在 GitHub：

```bash
git clone https://github.com/chloeyx727/bilingual-host-ai.git
cd bilingual-host-ai
```

如果不方便用 GitHub，也可以把整个项目文件夹压缩后上传到服务器，再进入项目目录。

## 填写密钥

先复制一份配置文件：

```bash
cp deployment/server.env.example deployment/server.env
```

打开这个文件：

```bash
nano deployment/server.env
```

至少填写：

```text
DEEPSEEK_API_KEY=你的DeepSeek API Key
```

如果要使用讯飞语音评测，也填写：

```text
IFLYTEK_APP_ID=
IFLYTEK_API_KEY=
IFLYTEK_API_SECRET=
```

保存方式：按 `Ctrl + O`，回车，再按 `Ctrl + X`。

## 启动网站

在项目目录执行：

```bash
docker compose up -d --build
```

启动后访问：

```text
http://服务器公网IP
```

健康检查地址：

```text
http://服务器公网IP/api/health
```

如果返回：

```json
{"status":"ok"}
```

说明后端正常。

## 更新网站

以后修改代码后，在服务器项目目录执行：

```bash
git pull
docker compose up -d --build
```

## 绑定域名

1. 在域名 DNS 里添加一条 `A` 记录，指向服务器公网 IP。
2. 云服务器安全组放行 80 和 443。
3. 中国大陆服务器绑定域名长期公开访问，通常需要完成 ICP 备案。

## HTTPS

最简单的方式是在云厂商控制台申请免费 SSL 证书，再按云厂商文档绑定到负载均衡、CDN 或反向代理。

如果只先测试，可以直接使用：

```text
http://服务器公网IP
```

正式长期分享建议使用：

```text
https://你的域名
```

## 常用命令

查看运行状态：

```bash
docker compose ps
```

查看后端日志：

```bash
docker compose logs -f backend
```

重启：

```bash
docker compose restart
```

停止：

```bash
docker compose down
```
