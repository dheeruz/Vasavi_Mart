import { execSync } from 'child_process';

if (process.env.RENDER) {
  console.log('Detected Render environment. Skipping frontend build.');
} else {
  console.log('Running standard production build (tsc + vite)...');
  try {
    execSync('tsc -b && vite build', { stdio: 'inherit' });
  } catch (error) {
    console.error('Build execution failed:', error);
    process.exit(1);
  }
}
