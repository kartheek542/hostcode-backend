import { PutObjectCommand } from '@aws-sdk/client-s3';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import s3Client from '../config/aws_s3.js';
import sqsClient from '../config/aws_sqs.js';

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

export const sendMessageToSQS = async (submissionId, problemId, languageId) => {
    try {
        const messageBody = JSON.stringify({
            submissionId,
            problemId,
            languageId,
        });
        console.log('JSON message is', messageBody);
        const params = {
            QueueUrl: 'https://sqs.ap-south-1.amazonaws.com/159284330056/hostcode-worker',
            MessageBody: messageBody,
        };
        const command = new SendMessageCommand(params);
        const response = await sqsClient.send(command);
        console.log('Message queued successfully:', response);
    } catch (error) {
        console.error('Error queuing message to sqs', error);
    }
};
