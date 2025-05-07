#!/usr/bin/env node

if (process.env.npm_execpath && !process.env.npm_execpath.includes('pnpm')) {
  console.error('You must use pnpm to run scripts in this project');
  console.error('Install pnpm: npm install -g pnpm');
  process.exit(1);
}