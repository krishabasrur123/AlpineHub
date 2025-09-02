# TrailSync

**TrailSync** is a full-stack web application UCLA class project built for managing ski resort lift and trail information in real-time. The application tracks lifts, trails, weather conditions, opening hours, and other key features, providing users with up-to-date mountain information.

---

## Key Features & Technologies

### Data Storage & Retrieval
- **MongoDB** stores historical lift and trail data.  
- BSON sample data included for testing.

### Backend APIs
- **REST API** routes for lifts and trails (`rest/routes/lift.js`, `rest/routes/trail.js`) for standard CRUD operations.
- **GraphQL** integration (`graphql/index.js`, `graphql/resolvers.js`, `graphql/schema.js`) allowing flexible queries and mutations for real-time lift/trail updates.
- **tRPC** endpoints (`trpc/routers/lift.ts`, `trpc/routers/trail.ts`) for type-safe API calls across the stack.

### Caching
- **Redis** used to cache lift and trail statuses for high-performance updates, reducing database calls.

### Frontend
- **HTML/JS frontend** (`public/index.html`, `public/assets/`) visualizes trail and lift statuses, including symbols for difficulty levels and lift types.

### Real-Time Updates
- Mutations in **GraphQL** and **tRPC** allow updating lift/trail statuses, which automatically refresh cached data and the frontend display.

### Testing & Utilities
- Includes test scripts (`test/testMongo.js`)  
- Utility functions for MongoDB, Redis, and date handling.

---

## Highlights
- Combines **REST**, **GraphQL**, **tRPC**, and **Redis caching** for an end-to-end full-stack solution.
- Handles real-time state changes in ski lifts and trails efficiently.
- Modular architecture: separate services for lifts and trails, clean schema definitions, and type-safe client/server communication.
- Fully equipped for future enhancements like weather-based suggestions, notifications, or multi-resort support.

---

## Use Cases
- Skiers and snowboarders can check which lifts and trails are open.
- Resort operators can update trail and lift statuses in real-time.
- Enables fast, scalable queries for large datasets, suitable for multiple resorts.

---

## Project Structure (Important Files)
- **REST API:** `rest/routes/lift.js`, `rest/routes/trail.js`  
- **GraphQL:** `graphql/index.js`, `graphql/resolvers.js`, `graphql/schema.js`  
- **tRPC:** `trpc/routers/lift.ts`, `trpc/routers/trail.ts`  
- **Frontend Assets:** `public/index.html`, `public/assets/`  
- **Database Samples:** `sample/mammoth.bson`  
- **Tests & Utilities:** `test/testMongo.js`, `utils/`

---


## Tech Stack
- **Backend:** Node.js, Express, GraphQL, tRPC  
- **Database:** MongoDB  
- **Caching:** Redis  
- **Frontend:** HTML, JavaScript  
- **Other Tools:** Apollo Server, BSON, REST APIs

  ## Acknowledgements
This project was adapted from code and examples by [Ryan Rosaio](https://github.com/RyanRosario). 
