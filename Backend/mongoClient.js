const { MongoClient } = require('mongodb');

// MongoDB connection URL
const url = 'mongodb://127.0.0.1:27017/';

// Database name
const dbName = 'todo';

// MongoDB client instance
let client;

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    // Create a new MongoDB client
    client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to the MongoDB server
    await client.connect();

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Function to close the MongoDB connection
async function closeMongoDBConnection() {
  try {
    // Close the MongoDB connection
    await client.close();

    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

// Function to get the MongoDB client instance
function getDb() {
  if (!client) {
    throw new Error('MongoDB connection not established');
  }

  // Return the MongoDB client instance
  return client.db(dbName);
}

module.exports = { connectToMongoDB, closeMongoDBConnection, getDb };
