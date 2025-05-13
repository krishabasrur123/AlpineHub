import { connectToMongoDB } from '../utils/dbconfig.js';
import { getLatestBatch, getLatestOpen, getNearestBatch } from '../utils/mongodb.js';
import { BatchType } from '../models/Enum.js';

const runTests = async () => {
  await connectToMongoDB();


  
  const nearest = await getLatestBatch(BatchType.LiftBatch);
  console.log(nearest.timestamp);

  process.exit(0);
};

runTests();
