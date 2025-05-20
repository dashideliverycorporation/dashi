/**
 * S3 Service for handling file uploads to AWS S3
 *
 * This service encapsulates the logic for uploading files to S3 and generating URLs
 */
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-client";

/**
 * Interface for file upload result
 */
export interface FileUploadResult {
  url: string;
  key: string;
}

/**
 * Service for handling S3 operations
 */
export class S3Service {
  /**
   * Uploads a file to S3 and returns the public URL
   *
   * @param file - The file buffer to upload
   * @param fileName - Original file name
   * @param contentType - MIME type of the file
   * @returns Promise with the file URL and key
   */
  public static async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string
  ): Promise<FileUploadResult> {
    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
      throw new Error("AWS bucket name or region not configured");
    }

    // Create a unique file name to prevent overwriting
    const uniqueFileName = `${Date.now()}-${fileName}`;

    // Upload the file to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uniqueFileName,
        Body: file,
        ContentType: contentType,
      })
    );

    // Generate and return the URL
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    return {
      url: fileUrl,
      key: uniqueFileName,
    };
  }
}
