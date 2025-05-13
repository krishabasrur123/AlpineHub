import { BatchType } from '../../models/Enum.js';
import { getLatestBatch } from '../../utils/mongodb.js';
import { Trail } from '../types/trail.js';

export const TrailService = {
  // Implement a method to get the latest trail batch from MongoDB
  // This should return all trails in the current batch or an empty array if none exists
  async getLatestTrails(): Promise<Trail[]> {
    // TODO: Implement me!
   try {
    const trailbatch = await getLatestBatch(BatchType.TrailBatch);
    if (!trailbatch){return [];

    }
    return trailbatch.trails;
  }catch (error) {
  throw new Error('Failed to get the trail batch from trpc');
}
  },

  // Implement a method to get a specific trail by name
  // This should search through the latest trail batch and return the matching trail or null if not found
  async getTrailByName(name: string): Promise<Trail | null> {
    // TODO: Implement me!
   try{
      const latestBatch = await getLatestBatch(BatchType.TrailBatch);
           if (!name || !latestBatch){
             return null;
           }
           const trailWithNameBool = latestBatch.trails.some((l: Trail) => l.name === name); 
           if (trailWithNameBool) {
             const trailWithName = latestBatch.trails.find((l: Trail)  => l.name === name);
             return (trailWithName??null);
           }
           else{
             return null;
           }
         } catch (error){
            throw new Error('Failed to get trail by name in trailservice trpc');
         }
  },
  
  // You get a break. No update function for trails this year. yay
};