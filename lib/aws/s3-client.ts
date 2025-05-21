import { S3Client } from "@aws-sdk/client-s3";
// import { fromSSO } from "@aws-sdk/credential-provider-sso";

// if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
//   throw new Error("AWS credentials or region not configured in environment variables");
// }

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  maxAttempts: 3,
  // credentials: fromSSO({
  //   profile: process.env.NEXT_PUBLIC_PROFILE
  // })
});
