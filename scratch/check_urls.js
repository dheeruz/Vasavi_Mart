import fetch from 'node-fetch';

const testUrls = {
  dishwash1: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600",
  dishwash2: "https://images.unsplash.com/photo-1607006342411-b0135f072fee?auto=format&fit=crop&q=80&w=600",
  dishwash3: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=600"
};

async function check() {
  for (const [key, url] of Object.entries(testUrls)) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`${key}: ${res.status} ${res.statusText}`);
    } catch (err) {
      console.error(`Failed to check ${key}:`, err.message);
    }
  }
}

check();
