import express from 'express'
import fs from 'fs'
import connectToDatabase from '../models/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const filename = './util/import-mongo/secondChanceItems.json'
  try {
    // Task 1: Connect to MongoDB using connectToDatabase database. Remember to use the await keyword and store the connection in `db`
    const db = await connectToDatabase()

    const collection = db.collection('secondChanceItems')
    const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs
    async function loadData () {
      try {
        const cursor = await collection.find({})
        const documents = await cursor.toArray()
        if (documents.length === 0) {
          // Insert data into the collection
          const insertResult = await collection.insertMany(data)
          console.log('Inserted documents:')
          console.log(insertResult)
          res.json({ message: 'Data loaded successfully', count: insertResult.insertedCount })
        } else {
          console.log('Items already exists in DB')
          res.status(500).json({ message: 'Items already exist in the database' })
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadData()
  } catch (e) {
    console.error('Error fetching gifts:', e)
  }
})

export default router
