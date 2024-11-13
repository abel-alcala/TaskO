import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes.js';
import listRoutes from './routes/listRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI not in .env file');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

app.use('/users', userRoutes);
app.use('/lists', listRoutes);
app.use('/tasks', taskRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise rejection:', err);
    process.exit(1);
});
startServer();