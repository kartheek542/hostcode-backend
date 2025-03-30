import db from '../config/database.js';
import { calculateFinalTestResult, getSubmissionStatusId } from '../utils/submission.js';

export const updateSubmissionResult = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { testExecutions } = req.body;
        const statusId = getSubmissionStatusId(calculateFinalTestResult(testExecutions));
        await db.query(
            'update submission set result = $1::jsonb, submission_status_id = $2 where sid = $3',
            [JSON.stringify({ testExecutions }), statusId, submissionId]
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
        const { user_id } = req;
        const submission = await db.query('select * from submission where sid = $1', [
            submissionId,
        ]);
        if (submission.rowCount === 0) {
            return res.status(404).json({ message: 'Invalid Submission id' });
        }
        if (user_id !== submission.rows[0].submitted_by) {
            return res.status(403).json({ message: 'You are forbidden to view this submission' });
        }
        return res.status(200).json({
            submission: submission.rows[0],
            message: 'Successfully retrieved submission details',
        });
    } catch (e) {
        console.log('Error occurred while retrieving submission details');
        console.log(e);
        return res
            .status(500)
            .json({ message: 'Error occurred while retrieving submission details' });
    }
};
