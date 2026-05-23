import fs from 'fs';
import fetch from 'node-fetch';

// Read seed file
const content = fs.readFileSync('scratch/seed_db_products.js', 'utf8');
// Extract the products array text using regex or simple split
const startIdx = content.indexOf('const products = [');
const endIdx = content.indexOf('];', startIdx);
const arrayText = content.substring(startIdx, endIdx + 2);

// Evaluate the array securely by converting to JSON-like structure
// Or we can just import it by turning it into a temporary ES module if Node supports it.
// Let's create a temporary JS file that exports products and check them!
const tempFile = 'scratch/temp_products.js';
fs.writeFileSync(tempFile, arrayText + '\nexport { products };');

async function check() {
  const { products } = await import('./temp_products.js');
  console.log(`Loaded ${products.length} products to check...`);
  
  let failed = 0;
  for (const p of products) {
    try {
      const res = await fetch(p.image_url, { method: 'HEAD' });
      if (res.status !== 200) {
        console.log(`❌ Product [${p.id}] "${p.name}" image failed: ${res.status} - ${p.image_url}`);
        failed++;
      } else {
        // console.log(`✅ Product [${p.id}] image OK`);
      }
    } catch (err) {
      console.log(`❌ Product [${p.id}] "${p.name}" check error: ${err.message}`);
      failed++;
    }
  }
  console.log(`Check complete. Total failed images: ${failed}`);
  
  // clean up
  try {
    fs.unlinkSync(tempFile);
  } catch (e) {}
}

check();
