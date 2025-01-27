import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export class R2Storage implements Uploader {
  private client: S3Client

  constructor() {
    this.client = new S3Client({})
  }

  upload({ body, fileName, fileType }: UploadParams): Promise<{ url: string }> {
    throw new Error('Method not implemented.')
  }
}
