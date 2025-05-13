import { getLatestBatch } from '../utils/mongodb.js';
import { updateKey, fetchFromCache, cacheResult } from '../../utils/redis.js';
import { BatchType } from '../models/Enum.js';

export const resolvers = {
  Query: {
    // Lift resolvers
    liftsLatest: async () => {
      // TODO: Implement this resolver to get the latest lift batch
      // in a flexible manner. Remember that the user may specify
      // fewer fields than the ones in the schema.
    const lift = await getLatestBatch(BatchType.LiftBatch);

      return {
        type: BatchType.LiftBatch,
        timestamp: lift.timestamp,
        lifts: lift.lifts
      };
    },
    
    // Trail resolvers
    trailsLatest: async () => {
      // TODO: Implement this resolver to get the latest lift batch
      // in a flexible manner. Remember that the user may specify
      // fewer fields than the ones in the schema.
      const trail = await getLatestBatch(BatchType.TrailBatch);

      return {
        type: BatchType.TrailBatch,
        timestamp: trail.timestamp,
        trails: trail.trails
      };
    },
  },
  
  Mutation: {
    // Lift mutation
    updateLift: async (_, { input }) => {
      // TODO: Implement this mutation to update a single lift's status in Redis
      // and update lastUpdated there as well. You can either modify the JSON
      // blob representing the LiftBatch or update a single property. 

       const { name, status } = input;
       const key = `lifts-latest`;
    console.log("Attempting to fetch data from cache");
    const batch = await fetchFromCache(key);
     
        if (!batch ) {
              console.log("Data not found in cache");
              return { message: 'Lift batch not in cache' };            }
            const i = batch.findIndex(lift => lift.name === name);
            if (i === -1) {
                return { message: 'Lift not found in batch' };
            }
            const lift = batch[i];
            lift.status = status;
            lift.lastUpdated = new Date().toISOString();
            
          console.log('Writing data to cache');
            console.log("Writing updated lift to caches");
            await cacheResult(key, batch, 300);
        
             await cacheResult(`lift_${name}_status`, { name, status }, 300);
              const key1 = `lift-open`;
        
            
        
              const cached_open = await fetchFromCache('lifts-open');
               if (cached_open && lift.status!=='OPEN') { //if status is not open, and if the list is in lifts-open, we need to remove it
             const updatedOpen = cached_open.filter(l => l.name !== name);
             if (updatedOpen) { await cacheResult('lifts-open', updatedOpen, 300)};
        
               } else if (status === 'OPEN') {
          if (!cached_open) {
            await cacheResult('lifts-open', [lift], 300);
          } else {
              const alreadyOpen = cached_open.some(l => l.name === name);
              if (!alreadyOpen){
              cached_open.push(lift);
        
              await cacheResult('lifts-open', cached_open, 300);}
          
          }}
        
        
       return { message: 'Done' };

    },
    
    // Trail mutation
    updateTrail: async (_, { input }) => {
      // TODO: Implement this mutation to update a single trail's status in Redis
      // and update lastUpdated there as well. You can either modify the JSON
      // blob representing the LiftBatch or update a single property.
   const { name, status } = input;
       const key = `trails-latest`;
    console.log("Attempting to fetch data from cache");
    const batch = await fetchFromCache(key);
     
        if (!batch ) {
              console.log("TRAIL Data not found in cache");
              return { message: 'trail batch not in cache' };            }
            const i = batch.findIndex(trail => trail.name === name);
            if (i === -1) {
                return { message: 'trail not found in batch' };
            }
            const trail = batch[i];
            trail.status = status;
            trail.lastUpdated = new Date().toISOString();
            
          console.log('Writing data to cache');
            console.log("Writing updated trail to caches");
            await cacheResult(key, batch, 300);
        
             await cacheResult(`trail_${name}_status`, { name, status }, 300);
              const key1 = `trail-open`;
        
            
        
              const cached_open = await fetchFromCache('trails-open');
               if (cached_open && trail.status!=='OPEN') { //if status is not open, and if the list is in lifts-open, we need to remove it
             const updatedOpen = cached_open.filter(l => l.name !== name);
             if (updatedOpen) { await cacheResult('trails-open', updatedOpen, 300)};
        
               } else if (status === 'OPEN') {
          if (!cached_open) {
            await cacheResult('trails-open', [trail], 300);
          } else {
              const alreadyOpen = cached_open.some(l => l.name === name);
              if (!alreadyOpen){
              cached_open.push(trail);
        
              await cacheResult('trails-open', cached_open, 300);}
          
          }}
        
        
       return { message: 'Done' };
    },
  },
};