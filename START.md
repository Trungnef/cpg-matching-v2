# Project Startup Guide

This guide explains how to start both the frontend and backend services of this project.

## Prerequisites

- Make sure you have Node.js installed
- Ensure all dependencies are installed for both frontend and backend

## Starting the Project

You can start the entire project (both frontend and backend) with a single command:

```bash
npm run start:full
```

This command uses `concurrently` to run both services simultaneously.

## Starting Individual Services

If you need to start just one of the services:

- For frontend only:
  ```bash
  npm run start:frontend
  ```

- For backend only:
  ```bash
  npm run start:backend
  ```

## What These Commands Do

- `start:full`: Starts both frontend and backend concurrently
- `start:frontend`: Starts only the frontend Vite development server
- `start:backend`: Navigates to the backend directory and starts its development server

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed in both frontend and backend directories
2. Check that both directories have their respective `.env` files configured correctly
3. If one service fails to start, you can run them individually to see specific error messages 