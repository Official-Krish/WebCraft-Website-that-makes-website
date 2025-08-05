import express from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import projectRouter from './routes/project';
import GoogleRouter from './routes/googleAuth';
import GithubRouter from './routes/github';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["https://webcraft.krishdev.xyz", "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use("/api/v1/project", projectRouter);
app.use("/auth/google", GoogleRouter);
app.use("/api/v1/github", GithubRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});