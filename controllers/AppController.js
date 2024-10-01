// controllers/AppController.js

const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

/**
 * AppController class containing API endpoint handlers.
 */
class AppController {
  /**
   * Handler for GET /status
   * Returns the status of Redis and MongoDB connections.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getStatus(req, res) {
    try {
      const redisStatus = redisClient.isAlive();
      const dbStatus = dbClient.isAlive();

      res.status(200).json({ redis: redisStatus, db: dbStatus });
    } catch (error) {
      console.error('Error in getStatus:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Handler for GET /stats
   * Returns the number of users and files in the database.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getStats(req, res) {
    try {
      const [usersCount, filesCount] = await Promise.all([
        dbClient.nbUsers(),
        dbClient.nbFiles(),
      ]);

      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AppController;
