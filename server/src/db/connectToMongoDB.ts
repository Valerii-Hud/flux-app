import mongoose from 'mongoose';
import isError from '../utils/isError.util';
import chalk from 'chalk';

const connectToMongoDB = async (mongoUri: string, hide: boolean = false) => {
  try {
    if (!mongoUri) {
      chalk.bgRed(`MONGO_URI is required`);
      process.exit(1);
    }
    const connection = await mongoose.connect(mongoUri);
    console.log(
      chalk.blue(
        `MongoDB connected: ${hide ? 'hidden' : connection.connection.host}`
      )
    );
  } catch (error) {
    isError({ error, functionName: connectToMongoDB.name, handler: 'db' });
    process.exit(1);
  }
};

export default connectToMongoDB;
