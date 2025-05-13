// USE THIS CLIENT TO TEST YOUR TRPC ENDPOINT

import {  httpBatchLink,createTRPCProxyClient } from '@trpc/client';
import type { AppRoute } from '../index.ts';

async function main() {
  const client = createTRPCProxyClient<AppRoute>({
    links: [
      httpBatchLink({
        url: 'http://localhost:1919/trpc',
      }),
    ],
  });


  // Example of calling getByName
  const lift = await client.lift.getByName.query({ name: 'Broadway Express 1' });
  const trail = await client.trail.getByName.query({ name: 'Wazoo' });
   console.log('Lift by Name:', lift);
  console.log('Trail by Name:', trail);
  const allLifts = await client.lift.getLatest.query();
 


  const updateStatusResponse = await client.lift.updateStatus.mutate({
    name: 'Broadway Express 1',  
    status: 'CLOSED',       
  });

     const lift2 = await client.lift.getByName.query({ name: 'Broadway Express 1' });
  console.log('Update Lift Status Response:', updateStatusResponse);

  
 
  console.log('lift new', lift2);


 
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
