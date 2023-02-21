import * as AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_IAM_REGION,
  accessKeyId: process.env.AWS_IAM_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
})

export default AWS;
