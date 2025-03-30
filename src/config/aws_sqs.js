import { SQSClient } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({
    region: 'ap-south-1',
});

export default sqsClient;
