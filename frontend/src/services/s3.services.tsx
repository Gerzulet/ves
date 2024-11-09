'use server'
/*
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from 'next/server';

const Bucket = process.env.LIGHTSAIL_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// endpoint to upload a file to the bucket
// export async function uploadFile(file: File) {
//   const Key = `avatars/${file.name}`; // You can modify this path as needed
// 
//   // Convert file to array buffer to use as the Body
//   const Body = (await file.arrayBuffer()) as Buffer;
// 
//   // Upload the file to S3
//   await s3.send(new PutObjectCommand({ Bucket, Key, Body }));
// 
//   // Construct the S3 URL (this will be the base URL for later use)
//   const s3Url = `https://${Bucket}.s3.amazonaws.com/${Key}`;
// 
//   return s3Url;
// }

export async function getFile(key: string) {
  const command = new GetObjectCommand({ Bucket, Key: key });
  const src = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return src;
}
  */