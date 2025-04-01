import req from 'express/lib/request.js';
import db from '../config/database.js';
import { calculateFinalTestResult, getSubmissionStatusId } from '../utils/submission.js';
import res from 'express/lib/response.js';

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
        const submission = await db.query('select s.*, p.name as problem_name from submission s inner join problem p on s.problem_id = p.pid where sid = $1', [
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

export const getAllSubmissions = async (req, res) => {
    try {
        const { user_id } = req;
        const userSubmissionsResult = await db.query(
            'select s.sid as submission_id, p.pid as problem_id, p.name as problem_name, sl.language, ss.label as submission_status_label from contest c inner join problem p on p.contest_id = c.cid inner join submission s on p.pid = s.problem_id inner join submission_status ss on ss.status_id = s.submission_status_id inner join supported_language sl on s.language_id = sl.lid where s.submitted_by = $1; ',
            [user_id]
        );
        return res.status(200).json({
            submissions: userSubmissionsResult.rows,
            message: 'Successfully retrieved user submissions of the contest',
        });
    } catch (e) {
        console.log('Error occurred while retrieving all submissions');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while retrieving all submissions' });
    }
};
