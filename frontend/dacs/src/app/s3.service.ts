import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  constructor() { }
  async s3UploadImage(image: File): Promise<string | null> {
    const s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000',
      credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
      },
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
    });
    const extension = image.name.split('.').pop() || 'jpg';
    const filename = `${uuidv4()}.${extension}`;
    try {
      const command = new PutObjectCommand({
        Bucket: 'images',
        Key: filename,
        Body: image,
        ContentType: image.type,
      });
      console.log(command);

      await s3Client.send(command);
      console.log('Image uploaded at', filename);
      return filename;
    }
    catch (err) {
      console.error('Image upload failed:', err);
      return null;
    }
  }
}
