import express from 'express';
import { getLatestBatch, getNearestBatch, getLatestOpen } from '../../utils/mongodb.js';
import { cacheResult, updateKey, fetchFromCache } from '../../utils/redis.js';
import { BatchType } from '../../models/Enum.js';
import { ObjectType } from '../../models/Enum.js';
import { TrailStatus } from '../../models/Enum.js';
//DO NOT LOOK HERE, PLEASE IGNORE , THIS IS KEPT AS BACKUP
const router = express.Router();

// Unless otherwise noted, you must implement a caching layer for each endpoint
// except for the write. With clever coding this is rather painless.
// IMPORTANT: You MUST have console.log statements to show that the
// architecture is being used:
// 1. "Attempting to fetch data from cache"
// 2. "Data found / not found in cache"
// 3. "Fetching data from MongoDB"
// 4. "Writing data to cache"
// All inserts into the cache MUST have a TTL of only 5 minutes,
// except for the /latest endpoint, which has special instructions.

router.get('/latest', async (req, res) => {
  try {
    // TODO: First, implement getting the latest trail batch from MongoDB
    // Return an array with the trail name and its data.
    
    const latestBatch = await getLatestBatch(BatchType.TrailBatch);

    return res.json(latestBatch.trails);
    
   
  } catch (error) {
    console.error("Error in /latest route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/latest/open', async (req, res) => {
  try {
    const latestBatch = await getLatestBatch(BatchType.TrailBatch);
    const open = latestBatch.trails.filter(trail => trail.status === "OPEN");
    if (!open){return res.json([]);}
    return res.json(open);  
  } catch (error) {
    console.error("Error in /latest/open route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/latest/:name', async (req, res) => {
  try {
    // TODO: Implement getting a specific trail by name.
    // If the proper parameters are not passed, return the proper HTTP code with message.
    // If the trail does not exist, return empty.
    // Note that there are a couple of ways to do this.
    // You should return a JSON object with the trail name and its data.
    //code 400 for parameter, 500 for server error
    const latestBatch = await getLatestBatch(BatchType.TrailBatch);
    const name = req.params.name;
    if (!name){
      return res.status(400).json({ error: "Wrong paramter name passed" });
    }
    const trailWithNameBool = latestBatch.trails.some(trail => trail.name === name); //exists is not proper java so used some
    if (trailWithNameBool) {
      const trailWithName = latestBatch.trails.filter(trail => trail.name === name);
      return (res.json({ name, data: trailWithName[0] }));
    }
    else{
      return res.json ({});
    }
  

  } catch (error) {
    console.error("Error in /latest/:name route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/latest/:name/:field', async (req, res) => {
  try {
    // TODO: Implement getting a specific field of a trail
    // If the proper parameters are not passed, return the proper HTTP code with message.
    // If the trail does not exist, return empty.
    // If the field does not exist, return empty.
    // Return a JSON object with the trail name and the requested field.

    const latestBatch = await getLatestBatch(BatchType.TrailBatch);
    const name = req.params.name;
    const field = req.params.field;
    if (!name ||!field){
      return res.status(400).json({ error: "Wrong paramter name passed" });
    }
    const trailWithNameField = latestBatch.trails.find(trail => trail.name === name );
    if (trailWithNameField && trailWithNameField[field] !== undefined) {
  
      return (res.json({ name, [field]: trailWithNameField[field] }));
    }
  
    else{
      return res.json ({});
    }
  

  } catch (error) {
    console.error("Error in /latest/:name route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/at/:timestamp', async (req, res) => {
  try {
    // TODO: Implement getting the most recent trail batch before a certain time. What this means is the following:
    // If you query for a batch at 11am, and all that exists is a batch for 9am (before 11am) fetch the 9am.
    // If the proper parameters are not passed, return the proper HTTP code with message.
    // If the timestamp is not of the correct format, return the proper HTTP code with message.
    // Return an array of JSON objects with the trail name and its data.
    // YOU DO NOT NEED TO IMPLEMENT CACHING HERE
    const ts = req.params.timestamp;
    if(!ts || isNaN(Date.parse(ts))){
       return res.status(400).json({ error: "Wrong paramters passed" }); 
      }
   console.log("Parsed Date:", new Date(ts).toISOString());
    const nearestBatch = await getNearestBatch(BatchType.TrailBatch, ts);
    console.log("Nearest batch fetched:", nearestBatch);
  

    if (!nearestBatch){return res.json ([]);} else{
    return res.json(nearestBatch.trails);
    }
   
  } catch (error) {
    console.log("Error in /at/:timestamp route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.patch('/update', async (req, res) => {
  try {
       const {name, status}  = req.body;

    if (!status || !name) {
      return res.status(400).json({ error: "missing name or status" });
    }
  const latestBatch = await getLatestBatch(BatchType.TrailBatch);

     const trail = latestBatch.trails.find(trail => trail.name === name);
     if (!trail) {
      return res.status(404).json({ error: "Lift not found" });
    }

    
    trail.status = status;
    trail.lastUpdated = new Date().toISOString();
  
    await latestBatch.save();

   

   return res.json (trail);
  } catch (error) {
    console.error("Error in PATCH /update/:name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
