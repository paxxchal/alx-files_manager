// utils/redis.js

const redis = require('redis');
const { promisify } = require('util');

/**
 * RedisClient class to handle Redis operations.
 */
class RedisClient {
  /**
   * Constructs a new RedisClient instance.
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 6379;
    const database = process.env.DB_DATABASE || 0; // Redis uses database indices

    this.client = redis.createClient({
      host,
      port,
      db: database,
    });

    // Handle Redis client errors
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    // Promisify Redis methods for async/await usage
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.existsAsync = promisify(this.client.exists).bind(this.client);
  }

  /**
   * Checks if the Redis client is connected.
   *
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value associated with the given key from Redis.
   *
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string|null>} The value stored for the key, or null if not found.
   */
  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (err) {
      console.error(`Error getting key "${key}":`, err);
      return null;
    }
  }

  /**
   * Sets a key-value pair in Redis with an expiration time.
   *
   * @param {string} key - The key to set.
   * @param {string} value - The value to associate with the key.
   * @param {number} duration - Expiration time in seconds.
   * @returns {Promise<boolean>} True if the operation was successful, false otherwise.
   */
  async set(key, value, duration) {
    try {
      // The 'EX' option sets the expiration time in seconds
      await this.setAsync(key, value, 'EX', duration);
      return true;
    } catch (err) {
      console.error(`Error setting key "${key}":`, err);
      return false;
    }
  }

  /**
   * Deletes the key-value pair associated with the given key from Redis.
   *
   * @param {string} key - The key to delete.
   * @returns {Promise<boolean>} True if the key was deleted, false otherwise.
   */
  async del(key) {
    try {
      const result = await this.delAsync(key);
      return result > 0;
    } catch (err) {
      console.error(`Error deleting key "${key}":`, err);
      return false;
    }
  }
}

// Exporting an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
