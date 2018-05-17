import aws from 'aws-sdk';

const signS3 = (req, res) => {
  const s3 = new aws.S3({ signatureVersion: 'v4', region: 'us-east-2' });
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) { return res.status(422).send(err); }

    const returnData = {
      signedRequest: data,
      url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    };
    return (res.send(JSON.stringify(returnData)));
  });
};

export default signS3;
