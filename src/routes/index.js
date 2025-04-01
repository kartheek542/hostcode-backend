import * as userController from '../controllers/user.js';
import * as problemController from '../controllers/problem.js';
import * as contestController from '../controllers/contest.js';
import * as submissionController from '../controllers/submission.js';
import { authenticate, authenticateAdmin } from '../middleware/auth.js';

const registerRoutes = (router) => {
    router.get('/hello', async (req, res) => {
        try {
            return res.status(200).json({ message: 'Hello Hostcode' });
        } catch (e) {
            console.log('Error occured while processing response for /hello');
            console.log(e);
        }
    });

    router.post('/user/register', userController.registerUser);
    router.post('/user/login', userController.loginUser);
    router.get('/contests', contestController.getContests);
    router.post('/contests', authenticateAdmin, contestController.createNewContest);
    router.get('/contests/:contestId', contestController.getContestDetail);
    router.get(
        '/contests/:contestId/mysubmissions',
        authenticate,
        contestController.getContestUserSubmissions
    );
    router.post(
        '/contests/:contestId/register',
        authenticate,
        contestController.registerUserContest
    );
    router.get('/contests/:contestId/standings', contestController.getContestStandings);
    router.get('/problems', problemController.getAllProblems);
    router.get('/problems/languages', problemController.getSupportedLanguages);
    router.post('/problems/submit', authenticate, problemController.submitProblem);
    router.get('/problems/:problemId', problemController.getProblemDetail);

    router.patch(
        '/submission/:submissionId',
        authenticateAdmin,
        submissionController.updateSubmissionResult
    );
    router.get('/submission/:submissionId', authenticate, submissionController.getSubmissionDetail);
    router.get('/submission', authenticate, submissionController.getAllSubmissions);
};
export default registerRoutes;
