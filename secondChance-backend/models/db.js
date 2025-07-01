// db.js
import dotenv from 'dotenv';
import {MongoClient} from 'mongodb';

dotenv.config();

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = `${process.env.MONGO_DB}`;

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient(url);      

    // Task 1: Connect to MongoDB
    await client.connect()

    // Task 2: Connect to database giftDB and store in variable dbInstance
    dbInstance = client.db(dbName)

    // Task 3: Return database instance
    return dbInstance
}

export default connectToDatabase;
