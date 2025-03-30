import db from '../config/database.js';
import { calculateFinalTestResult, getSubmissionStatusId } from '../utils/submission.js';

export const updateSubmissionResult = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { testExecutions } = req.body;
        const statusId = getSubmissionStatusId(calculateFinalTestResult(testExecutions));
        const updateSubmissionResult = await db.query(
            'update submission set result = $1::jsonb, submission_status_id = $2 where sid = $3',
            [JSON.stringify({testExecutions}), statusId, submissionId]
        );
        return res.status(200).json({ message: 'Successfully updated submission result' });
    } catch (e) {
        console.log('Error occured while updating submission result');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};

export const getSubmissionDetail = async (req, res) => {
    try {
        const { submissionId } = req.params;
    } catch (e) {
        console.log('Error occured while updating submission resul');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};
