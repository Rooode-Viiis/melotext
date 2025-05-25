import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

// 改为 POST 方法更合理，前端主动发文件名称等信息
export async function POST(req: Request) {
  const { filename, filetype } = await req.json();

  const key = `audio-${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: filetype,
  });

  const url = await getSignedUrl(r2, command, { expiresIn: 600 }); // 10分钟链接有效期足够上传

  const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${key}`;

  return Response.json({ url, publicUrl, key });
}
