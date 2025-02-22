const registerRoutes = (router) => {
    router.get("/hello", async (req, res) => {
        try {
            return res.status(200).json({ message: "Hello Hostcode" });
        } catch (e) {
            console.log("Error occured while processing response for /hello");
            console.log(e);
        }
    });
};
export default registerRoutes;
