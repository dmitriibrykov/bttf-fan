# Back to the Future - Fan Site

A full-stack fan site for the Back to the Future trilogy, built with Next.js 16, MongoDB, and NextAuth. Features an interactive SVG timeline with an alternate 1985 branch, character profiles, and a community comments section.

**Live demo:** [bttf-fan.vercel.app](https://bttf-fan.vercel.app)

## Screenshots

1. ### Main page with poll and information about movies from the external API

   ![main-page](/src/assets/readme/main.png?raw=true)

2. ### Characters page with search and film appearance indicators and different theme

   ![characters-dark](/src/assets/readme/characters-dark.png?raw=true)
   ![characters-light](/src/assets/readme/characters-light.png?raw=true)

3. ### Interactive timeline with alternate 1985 branch

   ![timeline-page](/src/assets/readme/timeline.png?raw=true)

4. ### Profile page

   ![profile-page](/src/assets/readme/profile.png?raw=true)

5. ### Character profile with comments section
   ![character-page](/src/assets/readme/character.png?raw=true)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB + Mongoose
- **Auth:** NextAuth.js with Google & GitHub OAuth
- **Storage:** Cloudinary (image upload + avatar cropping)
- **UI:** Tailwind CSS + shadcn/ui + Swiper
- **Animations:** Framer Motion
- **Deployment:** Vercel

## Features

- Server-side character search with MongoDB `$regex`
- OAuth authentication via Google and GitHub
- Comments with user avatars fetched via MongoDB aggregation pipeline
- Comment deletion with confirmation dialog, editing, ability to like
- Poll implemented as a slider in a React portal, results are shown via slider as well
- Poll results with O(n) algorithm to collect all polls result and combine it
- Movies information from OMDB API
- Avatar upload with crop tool (react-easy-crop + Cloudinary)
- Interactive SVG timeline with alternate 1985 branch
- Dark / Light theme switcher
- Fully responsive

## Technical Highlights

**Server Components + Route Handlers**
Pages fetch data directly on the server via Next.js App Router. API routes handle all mutations (POST, PATCH, DELETE), keeping sensitive logic server-side.

**MongoDB Aggregation**
Comments are fetched with a `$lookup` pipeline to join user data (name, avatar) from the `users` collection - avoiding N+1 queries.

**SVG Timeline**
The timeline is built with raw SVG and Framer Motion. Point positions are calculated mathematically from a `viewBox`, making the layout precise and fully responsive. The alternate 1985 branch is rendered as a diagonal fork from the 1955 node.

**Avatar Upload Flow**
Users select an image -> crop it in a modal using `react-easy-crop` → the cropped blob is uploaded to Cloudinary via a server-side Route Handler. Images are stored under an identifier based on user email, so re-uploading overwrites the previous avatar instead of creating duplicates.

**Auth-aware UI**
Unauthenticated users can browse characters and read comments. Leaving a comment redirects to sign-in with a `callbackUrl` so users return to the same character page after login.
