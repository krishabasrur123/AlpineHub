import { getLatestBatch } from '../../utils/mongodb.js';
import { Lift } from '../types/lift.js';
import { getLocalTimestamp } from '../../utils/dates.js';
import { updateKey, fetchFromCache, cacheResult } from '../../utils/redis.js';
import { BatchType } from '../../models/Enum.js';

const fetch_from_cache = async (key: string): Promise<any | null> => {
  console.log('Attempting to fetch data from cache');
  const data_cached = await fetchFromCache(key);

  if (data_cached) {
    console.log('Data found in cache');
    return data_cached;
  }

  console.log('Data not found in cache');
  return null;
};
export const LiftService = {
  // Implement a method to get the latest lift batch from MongoDB
  // This should return all lifts in the current batch or an empty array if none exists

  async getLatestLifts(): Promise<Lift[]> {
    try{
      const liftbatch = await getLatestBatch(BatchType.LiftBatch);
    if (!liftbatch){return [];

    }
    return liftbatch.lifts;
     }catch (error) {
  throw new Error('Failed to get the lift batch from  liftservice trpc');
}
  },

  // Implement a method to get a specific lift by name
  // This should search through the latest lift batch and return the matching lift or null if not found
  async getLiftByName(name: string): Promise<Lift | null> {
    // TODO: Implement me!

  
      try{
          const latestBatch = await getLatestBatch(BatchType.LiftBatch);
        if (!name || !latestBatch){
          return null;
        }
        const liftWithNameBool = latestBatch.lifts.some((l: Lift) => l.name === name); 
        if (liftWithNameBool) {
          const liftWithName = latestBatch.lifts.find((l: Lift)  => l.name === name);
          return (liftWithName??null);
        }
        else{
          return null;
        }
      } catch (error){
         throw new Error('Failed to get lift by name in liftservice trpc');
      }
  
  },

  // Implement a method to update a lift's status in Redis
  // This should use cacheResult or updateKey to update the status and return success/failure information



  async updateLiftStatus(name: string, status: string): Promise<{ success: boolean, message: string }> {
    // TODO: Implement me!


     if (!name || !status) {
      return { success: false, message: 'Missing lift name or status' };
    }
    try {
         const key = `lifts-latest`;
        console.log("Attempting to fetch data from cache");
        const batch = await fetch_from_cache(key);
        if (!batch ) {
          console.log("Data not found in cache");
          return { success: false, message: 'Lift batch not in cache' };
        }
        const i = batch.findIndex((lift: Lift) => lift.name === name);
        if (i === -1) {
         return { success: false, message: 'Lift not found in batch' };
        }
        const lift = batch[i];
        lift.status = status;
        lift.lastUpdated = new Date().toISOString();
        
      console.log('Writing data to cache');
        console.log("Writing updated lift to caches");
        await cacheResult(key, batch, 300);
    
         await cacheResult(`lift_${name}_status`, { name, status }, 300);
          const key1 = `lift-open`;
    
        
    
        const cached_open = await fetchFromCache('lifts-open') as Lift[] | null;
           if (cached_open && lift.status!=='OPEN') { //if status is not open, and if the list is in lifts-open, we need to remove it
         let updatedOpen = cached_open.filter((l:Lift) => l.name !== name);
         if (updatedOpen) { await cacheResult('lifts-open', updatedOpen, 300)};
    
           } else if (status === 'OPEN') {
      if (!cached_open) {
        await cacheResult('lifts-open', [lift], 300);
      } else {
          const alreadyOpen = cached_open.some((l:Lift) => l.name === name);
          if (!alreadyOpen){
          cached_open.push(lift);
    
          await cacheResult('lifts-open', cached_open, 300);}
      
      }}
    
    
    return { success: true, message: "Done saving liftbatch with status in trpc" };
      } catch (error) {
        console.error("Error in PATCH /update/:name:", error);
        return { success: false, message: `Error saving lift batch in liftservice trpc:` };
      }


    /* this is old code without redis : const latestBatch = await getLatestBatch(BatchType.LiftBatch);
     
  
         const lift = latestBatch.lifts.find( (l: Lift) => l.name === name);
         if (!lift) {
          return  { success: false, message: "No Lift Found" };
        }
    
        
        lift.status = status;
       lift.lastUpdated = getLocalTimestamp();
      try {
    await latestBatch.save();  
    return { success: true, message: "Done saving liftbatch with status in trpc" };
  } catch (error) {
    return { success: false, message: `Error saving lift batch in liftservice trpc:` };
  }*/

        

    
  }
};