import mongoose from 'mongoose';
import { LiftBatch } from '../models/LiftBatch.js';
import { TrailBatch } from '../models/TrailBatch.js';
import { BatchType } from '../models/Enum.js';
import { timeStamp } from 'console';
//Note for me: this file contains utility functionsthat interacts with the database

// Utility: choose model by type  
function getBatchModel(type) {
  switch (type) {
    case BatchType.LiftBatch: return LiftBatch;
    case BatchType.TrailBatch: return TrailBatch;
    default: throw new Error(`Unknown batch type: ${type}`);
  }
}

// Implement a function to get the latest batch by type
// This should query the appropriate model and return the most recent document
export async function getLatestBatch(type) {
 try{
  const model = getBatchModel(type);
   const latest = await model.findOne({type}).sort({ timestamp: -1 })
   return latest; //KB:gave me all the array elements too, as limit(1) only gives back arry [object][object]...


 }catch(err){
  throw new Error(`Cant get latest batch: ${err.message}`);
 }
  
}

// Implement a function to get the latest open lifts or trails
// This should use getLatestBatch and then filter for only items with "open" in the status
export async function getLatestOpen(type) {
  try{
    const latest = await getLatestBatch(type);
    if (!latest){
      throw new Error('No Latest Found');
    }
    let open;
    if (type==="LiftBatch"){
      open = latest.lifts.filter(lift => lift.status === "OPEN"); //KB:filter within one single document as .find works with a whole document
    } else if (type =="TrailBatch"){
      open = latest.trails.filter(trail => trail.status === "OPEN");
    }else{
      throw new Error('Invalid type');
    }
    
     return open; 
  
  
   }catch(err){
      throw new Error(`Cant get latest batch: ${err.message}`);
   }
}

// Implement a function to get the nearest batch to a given timestamp
// This should find the batch with a timestamp closest to (but before) the queried timestamp
// For example: you query for 11am today, but the most recent batch BEFORE 11am is 9am,
// so your function should return the 9am batch.
export async function getNearestBatch(type, ts) {
  try {
    const model = getBatchModel(type);
    const convert_iso = new Date(ts).toISOString();

        return await model.findOne({ timestamp: { $lt: convert_iso } , type: type }).sort({ timestamp: -1 });
  


  } catch (err) {
    throw new Error(`Cant get nearest batch: ${err.message}`);
  }
}

export default { getLatestBatch, getLatestOpen, getNearestBatch };
