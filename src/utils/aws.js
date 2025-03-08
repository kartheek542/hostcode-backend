import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/aws_s3.js';

export const uploadCodeToS3 = async (submissionId, problemId, languageId, code) => {
    const params = {
        Bucket: 'hostcode-terraform-backend',
        Key: `hostcode-problems/${problemId}/submissions/${languageId}/${submissionId}`,
        Body: code,
        ContentType: 'text/plain',
    };

    try {
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);
        console.log('File uploaded successfully to S3 bucket:', response);
    } catch (error) {
        console.error('Error uploading to S3:', error);
    }
};
