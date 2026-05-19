async function testRemote() {
  const url = 'https://vasavi-mart.onrender.com/api/products';
  console.log(`Sending GET to ${url}...`);
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    console.log(`Headers:`, Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log(`Body (truncated):`, text.substring(0, 200));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testRemote();
