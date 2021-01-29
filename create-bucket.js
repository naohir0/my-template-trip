var AWS = require('aws-sdk');
var accessKey = "AKIAJOOIJEHLYZKCQBJA";
var secretKey = "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";
const bucket_name = "my-template-trip-assets";


const s3 = new AWS.S3({
  accessKeyId:accessKey,
  secretAccessKey:secretKey
});
const params = {
  Bucket: bucket_name,
  CreateBucketConfiguration: {
      // Set your region here
      LocationConstraint: "us-east-2"
  }
};
s3.createBucket(params, function(err, data) {
  if (err) console.log(err, err.stack);
  else console.log('Bucket Created Successfully', data.Location);
});
