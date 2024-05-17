const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors"); // Import CORS middleware
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const url = "mongodb://127.0.0.1:27017/";
const dbName = "todo"; // Database name
const collectionName = "tasks"; // Collection name

// Function to establish MongoDB connection
const connectToMongoDB = async () => {
  try {
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return collection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

// Route to fetch tasks
app.get("/getTasks", async (req, res) => {
  try {
    const collection = await connectToMongoDB();
    const tasks = await collection.find({}).toArray();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to add a task
app.post("/addTask", async (req, res) => {
  const { name, status, deadline } = req.body;
  try {
    const collection = await connectToMongoDB();
    const result = await collection.insertOne({ name, status, deadline });
    res.status(201).send("Task added successfully.");
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to delete a task
app.delete("/deleteTask/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const collection = await connectToMongoDB();
    const result = await collection.deleteOne({ _id: new ObjectId(taskId) });
    res.status(200).send("Task deleted successfully.");
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to edit a task
app.put("/editTask/:id", async (req, res) => {
  const taskId = req.params.id;
  const { name, status, deadline } = req.body;
  try {
    const collection = await connectToMongoDB();
    const result = await collection.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { name, status, deadline } }
    );
    res.status(200).send("Task updated successfully.");
  } catch (error) {
    console.error("Error editing task:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
