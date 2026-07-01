module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          },
          region: env('AWS_REGION'),
          params: {
            Bucket: env('S3_BUCKET'),
            // This bucket has S3's modern "Bucket owner enforced" object
            // ownership (ACLs disabled) - matches the old Express app's
            // multer-s3 config, which never set an ACL either. Explicitly
            // present-but-undefined so the provider doesn't default it to
            // 'public-read' and get AccessControlListNotSupported.
            ACL: undefined,
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
