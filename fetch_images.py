import urllib.request
import urllib.parse
import json
import os

products = [
    {"id": "s2", "query": "Wheat flour"},
    {"id": "s3", "query": "Semolina"},
    {"id": "s4", "query": "Rolled oats"},
    {"id": "pl1", "query": "Chickpea"},
    {"id": "pl2", "query": "Kidney bean"},
    {"id": "ce1", "query": "Sunflower oil"},
    {"id": "ce2", "query": "Ghee"},
    {"id": "ce3", "query": "Sugar"},
    {"id": "ce4", "query": "Salt"},
    {"id": "sc1", "query": "Turmeric"},
    {"id": "sc2", "query": "Chili powder"},
    {"id": "sc3", "query": "Garam masala"},
    {"id": "sc4", "query": "Mixed pickle"},
    {"id": "d3", "query": "Yogurt"},
    {"id": "d4", "query": "Paneer"},
    {"id": "sn3", "query": "Chocolate chip cookie"},
    {"id": "sn4", "query": "Instant noodle"},
    {"id": "h1", "query": "Dishwashing liquid"},
    {"id": "h2", "query": "Laundry detergent"},
    {"id": "h3", "query": "Floor cleaning"},
    {"id": "h4", "query": "Bin bag"},
    {"id": "pc1", "query": "Soap"},
    {"id": "pc2", "query": "Shampoo"},
    {"id": "pc3", "query": "Toothpaste"},
    {"id": "pc4", "query": "Coconut oil"},
    {"id": "b1", "query": "Tea leaves"},
    {"id": "b2", "query": "Coffee powder"},
    {"id": "b3", "query": "Juice"},
    {"id": "b4", "query": "Bottled water"}
]

public_dir = "C:/Users/dheer/.gemini/antigravity/scratch/Vasavi_Mart/public"

for p in products:
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(p['query'])}&prop=pageimages&format=json&pithumbsize=600"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            page = list(pages.values())[0]
            if 'thumbnail' in page:
                img_url = page['thumbnail']['source']
                img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(img_req) as img_resp:
                    img_data = img_resp.read()
                    path = os.path.join(public_dir, f"{p['id']}.jpg")
                    with open(path, 'wb') as f:
                        f.write(img_data)
                print(f"Downloaded {p['query']} to {p['id']}.jpg")
            else:
                # Fallback to general generic term if missing
                print(f"No image found for {p['query']}")
    except Exception as e:
        print(f"Error on {p['query']}: {e}")
