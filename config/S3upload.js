const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
const multer  = require('multer')
const s3 = new S3Client({ region: "us-west-2" })

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload