import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(req: Request) {
  const { key } = await req.json();

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
  });

  await r2.send(deleteCommand);

  return Response.json({ success: true });
}
