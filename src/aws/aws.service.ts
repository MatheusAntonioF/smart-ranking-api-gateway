import { Injectable } from '@nestjs/common';

import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  async uploadFile(file: Express.Multer.File, id: string) {
    try {
      const s3 = new S3({
        region: process.env.AWS_BUCKET_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
        },
      });

      const fileExtension = file.originalname.split('.')[1];

      const urlKey = `${id}.${fileExtension}`;

      await s3
        .putObject({
          Body: file.buffer,
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: urlKey,
        })
        .promise();

      return { url: `https://smart-ranking-1.s3.amazonaws.com/${urlKey}` };
    } catch (error) {
      console.error(error);
    }
  }
}
