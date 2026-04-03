#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getCurrentBranch() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    return branch;
  } catch (error) {
    console.log('Could not determine git branch, defaulting to main');
    return 'main';
  }
}

function setupEnvironment() {
  const currentBranch = getCurrentBranch();
  const envFile = `.env.${currentBranch}`;
  const targetEnvFile = '.env';
  
  console.log(`Current branch: ${currentBranch}`);
  
  // Check if branch-specific env file exists
  if (fs.existsSync(envFile)) {
    // Copy branch-specific env to .env
    fs.copyFileSync(envFile, targetEnvFile);
    console.log(`✅ Environment set up for ${currentBranch} branch`);
    console.log(`📄 Copied ${envFile} to ${targetEnvFile}`);
    
    // Read and display NEXTAUTH_URL for verification
    const envContent = fs.readFileSync(targetEnvFile, 'utf8');
    const nextAuthUrlMatch = envContent.match(/NEXTAUTH_URL=(.+)/);
    if (nextAuthUrlMatch) {
      console.log(`🔗 NEXTAUTH_URL: ${nextAuthUrlMatch[1]}`);
    }
  } else {
    console.log(`⚠️  No environment file found for branch '${currentBranch}'`);
    console.log(`📝 Available environment files:`);
    
    // List available .env.* files
    const files = fs.readdirSync('.')
      .filter(file => file.startsWith('.env.') && file !== '.env.example')
      .sort();
    
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
    
    if (files.length === 0) {
      console.log('   (none found)');
    }
    
    console.log(`\n💡 Create ${envFile} or use 'main' branch configuration as fallback`);
    
    // Try to use main branch as fallback
    if (fs.existsSync('.env.main')) {
      fs.copyFileSync('.env.main', targetEnvFile);
      console.log(`🔄 Using .env.main as fallback`);
    }
  }
}

// Run the setup
setupEnvironment();