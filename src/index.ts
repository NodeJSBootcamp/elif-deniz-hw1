import express from 'express';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import AuthRouter from './routes/Auth.routes'
import TweetRouter from './routes/Tweet.routes'


dotenv.config();
const app= express();

app.use(express.json())


app.get('/', (req: Request, res: Response)=>{
    res.json("Welcome to Tweet API")
})


app.use('/auth', AuthRouter);
app.use('/tweet', TweetRouter )


export default app;