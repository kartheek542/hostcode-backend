import express from 'express';
import cors from 'cors';
import registerRoutes from './src/routes/index.js';

const app = express();
const router = express.Router();

registerRoutes(router);

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(8080, () => {
    console.log('Server started running on port 8080');
});
