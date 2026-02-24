# AWS S3 Integration Setup

This document provides instructions for setting up AWS S3 integration for file uploads in the Spaces Backend application.

## Prerequisites

1. An AWS account with access to create S3 buckets and IAM users
2. Node.js (version 14 or higher)
3. NPM or Yarn package manager

## Step 1: Install Required Dependencies

Add the AWS SDK to your project:

```bash
npm install @aws-sdk/client-s3
# or
yarn add @aws-sdk/client-s3
```

## Step 2: Set Up an S3 Bucket

1. Log in to the AWS Management Console
2. Navigate to the S3 service
3. Click "Create bucket"
4. Choose a unique bucket name
5. Select the region closest to your users
6. Configure the bucket settings:
   - Enable public access if you want the uploaded files to be publicly accessible
   - For public files, disable "Block all public access"
   - Enable CORS for your domain

## Step 3: Configure CORS for Your S3 Bucket

Add a CORS configuration to allow requests from your application:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "ExposeHeaders": []
  }
]
```

## Step 4: Create an IAM User for S3 Access

1. Navigate to the IAM service in AWS
2. Create a new user with programmatic access
3. Attach the `AmazonS3FullAccess` policy (or create a custom policy with more limited permissions)
4. Save the Access Key ID and Secret Access Key

## Step 5: Configure Environment Variables

Add the following variables to your `.env` file:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_selected_region
AWS_S3_BUCKET_NAME=your_bucket_name
```

## Step 6: Update Multer Configuration

Ensure your Multer middleware is configured to use memory storage:

```javascript
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
```

## Step 7: Test the S3 Integration

Upload a file using your application and verify that:

1. The file is successfully uploaded to S3
2. The correct URL is stored in your database
3. The file is accessible via the stored URL

## Troubleshooting

- Check CloudWatch logs for any S3 errors
- Verify that your IAM user has the correct permissions
- Ensure your bucket has the right CORS configuration
- Check that your environment variables are correctly set
