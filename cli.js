#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const electronPath = require('electron');
const appPath = path.join(__dirname, 'main.js');

const args = process.argv.slice(2);

const child = spawn(electronPath, [appPath, ...args], { stdio: 'inherit' });

child.on('close', (code) => {
  process.exit(code);
});