请务必参考根目录中的 **MUST_READ_ME.env.template**

```
### ✅【必填!】此为环境变量配置，可新建".env.local"文件并填入以下内容,或复制本文件进行修改,亦可在填写完成后将此文件改名为".env.local"

## 以下为转录部分

# 请至 https://www.assemblyai.com 获取API KEY
ASSEMBLYAI_API_KEY=

## 以下为翻译部分

# 翻译用的API接口路径,如 https://openrouter.ai/api/v1/chat/completions 或 https://api.x.ai/v1/chat/completions 等
TRANSLATION_API_URL=https://<YOUR_API_PROVIDER>/v1/chat/completions

# 翻译模型服务的API KEY
TRANSLATION_API_KEY=your-api-key-here

# 翻译使用的模型名称
TRANSLATION_MODEL=

## 以下为cloud flare R2存储部分

# 访问密钥ID
R2_ACCESS_KEY=

# 机密访问密钥
R2_SECRET_KEY=

# 存储桶名称
R2_BUCKET=

# S3客户端使用管辖权地特定的终结点
R2_ENDPOINT=https://******.r2.cloudflarestorage.com

# 公共开发 URL
R2_PUBLIC_DOMAIN=https://******.r2.dev

```
