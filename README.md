# Padel Tournament Manager

A modern web application for managing padel tennis tournaments, built with the T3 Stack.

## Features

- **Tournament Creation**

  - Create league or group-based tournaments
  - Specify tournament level (Beginners, Level D, Level C, Mixed)
  - Choose tournament location
  - Configure number of groups for group-based tournaments

- **Team Management**

  - Add teams with two players each
  - Assign teams to groups in group tournaments
  - Edit team names and group assignments
  - View team statistics and standings

- **Match Management**

  - Automatic match generation based on tournament type
  - Record match scores
  - Track match progress
  - Filter matches by completion status and teams

- **Tournament Dashboard**

  - Real-time scoreboard with team rankings
  - Points calculation (3 points for win, 1 for draw)
  - Set difference tracking
  - Group-wise standings for group tournaments

- **User Authentication**
  - Secure login system
  - Protected tournament management features

## Tech Stack

This project is built using the [T3 Stack](https://create.t3.gg/), which includes:

- [Next.js](https://nextjs.org) - React framework for web applications
- [NextAuth.js](https://next-auth.js.org) - Authentication for Next.js
- [Prisma](https://prisma.io) - Type-safe database ORM
- [Drizzle](https://orm.drizzle.team) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [tRPC](https://trpc.io) - End-to-end typesafe APIs

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Set up the database:
   ```bash
   npm run db:push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Deployment

The application can be deployed on:

- [Vercel](https://create.t3.gg/en/deployment/vercel)
- [Netlify](https://create.t3.gg/en/deployment/netlify)
- [Docker](https://create.t3.gg/en/deployment/docker)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
