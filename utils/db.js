// utils/db.js

const { MongoClient } = require('mongodb');

const { env } = process;

// DBClient Class Definition
class DBClient {
  constructor() {
    const host = env.DB_HOST || 'localhost';
    const port = env.DB_PORT || 27017;
    const database = env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
        console.log(`Connected to MongoDB at ${url}`);
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
      });
  }

  // Check if MongoDB connection is alive
  isAlive() {
    return this.client.isConnected();
  }

  // Get the number of users in the "users" collection
  async nbUsers() {
    try {
      const usersCollection = this.db.collection('users');
      return await usersCollection.countDocuments();
    } catch (err) {
      console.error('Error getting number of users:', err);
      return 0;
    }
  }

  // Get the number of files in the "files" collection
  async nbFiles() {
    try {
      const filesCollection = this.db.collection('files');
      return await filesCollection.countDocuments();
    } catch (err) {
      console.error('Error getting number of files:', err);
      return 0;
    }
  }
}

// Exporting an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
