import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { env } from "../env";

@Injectable()
export class CloudflareR2Service {
  private s3 = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

  async uploadBase64Image(base64: string): Promise<string> {
    const match = base64.match(/^data:(image\/(jpeg|jpg|png));base64,(.*)$/);

    let contentType = "image/jpeg";
    let rawBase64 = base64;
    let extension = "jpg";

    if (match) {
      contentType = match[1];
      extension = match[2] === "png" ? "png" : "jpg";
      rawBase64 = match[3];
    }

    const buffer = Buffer.from(rawBase64, "base64");
    const key = `${randomUUID()}.${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read",
      }),
    );

    return `${env.R2_PUBLIC_URL}/${key}`;
  }

  async deleteImageToBucket(imageLink: string): Promise<void> {
    const url = new URL(imageLink);
    const key = url.pathname.slice(1);

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      }),
    );
  }
}
