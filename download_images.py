import os
import requests
import json
import time

products = [
    {"id": "s2", "query": "Aashirvaad Whole Wheat Atta 5kg packet front view white background supermarket"},
    {"id": "s3", "query": "Sooji Rava 1kg packet generic indian front view"},
    {"id": "s4", "query": "Quaker Rolled oats 1kg pouch white background"},
    {"id": "pl1", "query": "Tata Sampann Kabuli Chana Chickpeas 1kg packet"},
    {"id": "pl2", "query": "Tata Sampann Rajma Red Kidney bean packet"},
    {"id": "ce1", "query": "Fortune Sunflower oil 1 litre pouch white background"},
    {"id": "ce2", "query": "Amul Pure Ghee 500ml carton box"},
    {"id": "ce3", "query": "Madhur Sugar 1kg packet front"},
    {"id": "ce4", "query": "Tata Salt 1kg packet front view white background"},
    {"id": "sc1", "query": "Everest Turmeric powder packet 200g"},
    {"id": "sc2", "query": "Everest Red Chili powder packet 200g"},
    {"id": "sc3", "query": "Everest Garam masala box 100g"},
    {"id": "sc4", "query": "Mothers Recipe Pickle jar mixed"},
    {"id": "d3", "query": "Milky Mist Curd cup plastic 500g"},
    {"id": "d4", "query": "Amul Fresh Paneer block packet 200g"},
    {"id": "sn3", "query": "Parle Hide Seek Chocolate chip cookies packet"},
    {"id": "sn4", "query": "Maggi 2-minute instant noodles pack"},
    {"id": "h1", "query": "Vim Dishwash Liquid bottle 500ml green"},
    {"id": "h2", "query": "Surf Excel Matic Laundry powder packet"},
    {"id": "h3", "query": "Lizol Floor cleaner citrus yellow 1L bottle"},
    {"id": "h4", "query": "Garbage bags roll black plastic 30 pack"},
    {"id": "pc1", "query": "Dove Soap Bar 3 pack carton"},
    {"id": "pc2", "query": "Head Shoulders Anti-Dandruff Shampoo blue bottle"},
    {"id": "pc3", "query": "Colgate Strong Teeth Toothpaste red carton box"},
    {"id": "pc4", "query": "Parachute Coconut oil blue bottle 250ml"},
    {"id": "b1", "query": "Taj Mahal Tea leaves box 500g red orange"},
    {"id": "b2", "query": "Bru Filter Coffee powder green pouch"},
    {"id": "b3", "query": "Real Mixed Fruit Juice 1L carton box"},
    {"id": "b4", "query": "Kinley Packaged drinking water 1L bottle transparent"}
]

public_dir = "C:/Users/dheer/.gemini/antigravity/scratch/Vasavi_Mart/public"

# We use duckduckgo_search library
try:
    from duckduckgo_search import DDGS
except ImportError:
    os.system('python -m pip install duckduckgo-search requests')
    from duckduckgo_search import DDGS

ddgs = DDGS()

for p in products:
    try:
        results = [r for r in ddgs.images(p['query'], max_results=2)]
        if results:
            img_url = results[0]['image']
            req = requests.get(img_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}, timeout=10)
            if req.status_code == 200:
                path = os.path.join(public_dir, f"{p['id']}.jpg")
                with open(path, 'wb') as f:
                    f.write(req.content)
                print(f"Downloaded {p['query']} to {p['id']}.jpg")
            else:
                # Try fallback image
                if len(results) > 1:
                    img_url = results[1]['image']
                    req = requests.get(img_url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)
                    if req.status_code == 200:
                        path = os.path.join(public_dir, f"{p['id']}.jpg")
                        with open(path, 'wb') as f:
                            f.write(req.content)
                        print(f"Downloaded {p['query']} to {p['id']}.jpg (fallback)")
        else:
            print(f"No results for {p['query']}")
    except Exception as e:
        print(f"Error on {p['query']}: {e}")
    time.sleep(1)
