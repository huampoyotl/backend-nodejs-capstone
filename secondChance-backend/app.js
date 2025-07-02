import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { logger, pinoLogger } from './logger.js'
import fs from 'fs'
import connectToDatabase from './models/db.js'
import pinoHttp from 'pino-http'

dotenv.config()


const app = express();
app.use("*",cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

// Route files

// authRoutes Step 2: import the authRoutes and store in a constant called authRoutes
import authRoutes from './routes/authRoutes.js';

// Items API Task 1: import the secondChanceItemsRoutes and store in a constant called secondChanceItemsRoutes
import secondChanceItemsRoutes from './routes/secondChanceItemsRoutes.js';

// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
import searchRoutes from './routes/searchRoutes.js';


app.use(pinoHttp({ logger }));

// Use Routes
// authRoutes Step 2: add the authRoutes and to the server by using the app.use() method.
app.use('/api/auth', authRoutes);

// Items API Task 2: add the secondChanceItemsRoutes to the server by using the app.use() method.
app.use('/api/secondchance/items', secondChanceItemsRoutes);

// Search API Task 2: add the searchRoutes to the server by using the app.use() method.
app.use('/api/secondchance/search', searchRoutes);

app.use('/images/*', (req, res) => {
    const imagePath = req.originalUrl.replace('/images/', '');
    const fullPath = `./public/images/${imagePath}`;
    if (fs.existsSync(fullPath)) {
        res.sendFile(fullPath, { root: '.' });
    } else {
        res.status(404).send('Image not found');
    }
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/",(req,res)=>{
    res.send("Inside the server")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
