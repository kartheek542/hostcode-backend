import * as userController from "../controllers/user.js"
import * as problemController from "../controllers/problem.js"
import * as contestController from "../controllers/contest.js"

const registerRoutes = (router) => {
    router.get("/hello", async (req, res) => {
        try {
            return res.status(200).json({ message: "Hello Hostcode" });
        } catch (e) {
            console.log("Error occured while processing response for /hello");
            console.log(e);
        }
    });

    router.post("/user/register", userController.registerUser);
    router.post("/user/login", userController.loginUser);
    router.get("/contests", contestController.getContests);
    router.get("/contests/:contestId", contestController.getContestDetail);
    router.get("/contests/:contestId/mysubmissions", contestController.getContestUserSubmissions);
    router.get("/contests/:contestId/standings", contestController.getContestStandings);
    router.get("/problems", problemController.getAllProblems);
    router.get("/problems/:problemId", problemController.getProblemDetail);
    router.get("/problems/languages", problemController.getSupportedLanguages);
    router.post("/problems/submit", problemController.submitProblem);
};
export default registerRoutes;
