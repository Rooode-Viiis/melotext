import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

export async function POST(req: Request) {
  const { filename, filetype } = await req.json();

  const key = `audio-${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: filetype,
  });

  const url = await getSignedUrl(r2, command, { expiresIn: 1800 }); // 30分钟
  const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${key}`;

  return Response.json({ url, publicUrl, key });
}
