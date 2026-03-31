export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  image: string;
  description: string;
  inStock: boolean;
  unit: string;
}

export const mockProducts: Product[] = [
  // Fruits & Vegetables
  {
    id: 'p1', name: 'Fresh Organic Apples', price: 250, category: 'Fruits & Veggies',
    image: '/organic_apples.png', description: 'Crisp and sweet organic apples.', inStock: true, unit: '1 kg',
  },
  {
    id: 'p2', name: 'Farm Fresh Tomatoes', price: 40, category: 'Fruits & Veggies',
    image: '/fresh_tomatoes.png', description: 'Juicy, vine-ripened tomatoes.', inStock: true, unit: '1 kg',
  },
  {
    id: 'p5', name: 'Organic Spinach', price: 25, category: 'Fruits & Veggies',
    image: '/organic_spinach.png', description: 'Fresh organic spinach leaves.', inStock: true, unit: 'Bunch',
  },

  // Food Staples - Grains & Cereals
  {
    id: 's1', name: 'Premium Basmati Rice', price: 799, category: 'Food Staples', subcategory: 'Grains & Cereals',
    image: '/basmati_rice.png', description: 'Long grain, aromatic India Gate basmati rice.', inStock: true, unit: '5 kg',
  },
  {
    id: 's2', name: 'Aashirvaad Whole Wheat Atta', price: 245, category: 'Food Staples', subcategory: 'Grains & Cereals',
    image: '/s2.jpg', description: '100% whole wheat chakki fresh atta.', inStock: true, unit: '5 kg',
  },
  {
    id: 's3', name: 'Rava (Semolina)', price: 45, category: 'Food Staples', subcategory: 'Grains & Cereals',
    image: '/s3.jpg', description: 'Roasted rava, perfect for upma and halwa.', inStock: true, unit: '1 kg',
  },
  {
    id: 's4', name: 'Quaker Rolled Oats', price: 180, category: 'Food Staples', subcategory: 'Grains & Cereals',
    image: '/s4.jpg', description: 'Healthy rolled oats for breakfast.', inStock: true, unit: '1 kg',
  },

  // Food Staples - Pulses & Legumes 
  {
    id: 'p11', name: 'Yellow Toor Dal (Arhar)', price: 160, category: 'Food Staples', subcategory: 'Pulses & Legumes',
    image: '/toor_dal.png', description: 'Polished yellow pigeon peas.', inStock: true, unit: '1 kg',
  },
  {
    id: 'p10', name: 'Premium Urad Dal', price: 140, category: 'Food Staples', subcategory: 'Pulses & Legumes',
    image: '/urad_dal.png', description: 'High-quality unpolished Urad Dal.', inStock: true, unit: '1 kg',
  },
  {
    id: 'p12', name: 'Moong Dal (Yellow)', price: 110, category: 'Food Staples', subcategory: 'Pulses & Legumes',
    image: '/moong_dal.png', description: 'Easily digestible split yellow Moong Dal.', inStock: true, unit: '1 kg',
  },
  {
    id: 'p13', name: 'Chana Dal', price: 90, category: 'Food Staples', subcategory: 'Pulses & Legumes',
    image: '/chana_dal.png', description: 'Nutritious split Bengal gram.', inStock: true, unit: '1 kg',
  },
  {
    id: 'pl1', name: 'Chickpeas (Kabuli Chana)', price: 140, category: 'Food Staples', subcategory: 'Pulses & Legumes',
    image: '/pl1.jpg', description: 'Premium large chickpeas.', inStock: true, unit: '1 kg',
  },
  {
    id: 'pl2', name: 'Rajma (Kidney Beans)', price: 155, category: 'Food Staples', subcategory: 'Pulses & Legumes',
    image: '/pl2.jpg', description: 'Red kidney beans from Jammu.', inStock: true, unit: '1 kg',
  },
  {
    id: 'p9', name: 'Raw Ground Nuts (Peanuts)', price: 175, category: 'Food Staples', subcategory: 'Pulses & Legumes',
    image: '/ground_nuts.png', description: 'Fresh, raw ground nuts directly sourced.', inStock: true, unit: '1 kg',
  },

  // Food Staples - Cooking Essentials
  {
    id: 'ce1', name: 'Fortune Sunflower Oil', price: 135, category: 'Food Staples', subcategory: 'Cooking Essentials',
    image: '/ce1.jpg', description: 'Refined sunflower oil for cooking.', inStock: true, unit: '1 L',
  },
  {
    id: 'ce2', name: 'Amul Pure Desi Ghee', price: 290, category: 'Food Staples', subcategory: 'Cooking Essentials',
    image: '/ce2.jpg', description: 'Aromatic pure cow ghee.', inStock: true, unit: '500 ml',
  },
  {
    id: 'ce3', name: 'Madhur Refined Sugar', price: 45, category: 'Food Staples', subcategory: 'Cooking Essentials',
    image: '/ce3.jpg', description: 'Refined white sugar crystals.', inStock: true, unit: '1 kg',
  },
  {
    id: 'ce4', name: 'Tata Salt', price: 25, category: 'Food Staples', subcategory: 'Cooking Essentials',
    image: '/ce4.jpg', description: 'Vacuum evaporated iodized salt.', inStock: true, unit: '1 kg',
  },

  // Food Staples - Spices & Condiments
  {
    id: 'sc1', name: 'Everest Turmeric Powder', price: 65, category: 'Food Staples', subcategory: 'Spices',
    image: '/sc1.jpg', description: 'High curcumin organic turmeric powder.', inStock: true, unit: '200 g',
  },
  {
    id: 'sc2', name: 'Everest Red Chili Powder', price: 75, category: 'Food Staples', subcategory: 'Spices',
    image: '/sc2.jpg', description: 'Spicy and vibrant red chili powder.', inStock: true, unit: '200 g',
  },
  {
    id: 'sc3', name: 'Everest Garam Masala', price: 85, category: 'Food Staples', subcategory: 'Spices',
    image: '/sc3.jpg', description: 'Authentic blend of whole spices.', inStock: true, unit: '100 g',
  },
  {
    id: 'sc4', name: 'Mother\'s Recipe Mango Pickle', price: 110, category: 'Food Staples', subcategory: 'Condiments',
    image: '/sc4.jpg', description: 'Traditional spicy mango pickle.', inStock: true, unit: '400 g',
  },

  // Dairy & Refrigerated
  {
    id: 'd1', name: 'Amul Taaza Toned Milk', price: 60, category: 'Dairy & Refrigerated',
    image: '/whole_milk.png', description: 'Fresh toned milk, homogenized.', inStock: true, unit: '1 L',
  },
  {
    id: 'd2', name: 'Farm Fresh Eggs', price: 80, category: 'Dairy & Refrigerated',
    image: '/farm_eggs.png', description: 'High quality farm eggs.', inStock: true, unit: '12 count',
  },
  {
    id: 'd3', name: 'Milky Mist Curd', price: 45, category: 'Dairy & Refrigerated',
    image: '/d3.jpg', description: 'Thick and creamy naturally set curd.', inStock: true, unit: '500 g',
  },
  {
    id: 'd4', name: 'Amul Fresh Paneer', price: 85, category: 'Dairy & Refrigerated',
    image: '/d4.jpg', description: 'Soft and malai cottage cheese.', inStock: true, unit: '200 g',
  },

  // Snacks & Packaged Foods
  {
    id: 'sn1', name: 'Roasted Almonds', price: 899, category: 'Snacks & Packaged Foods',
    image: '/roasted_almonds.png', description: 'Premium roasted almonds.', inStock: true, unit: '1 kg',
  },
  {
    id: 'sn2', name: 'Modern Whole Wheat Bread', price: 45, category: 'Snacks & Packaged Foods',
    image: '/wheat_bread.png', description: 'Freshly baked whole wheat bread.', inStock: true, unit: 'Loaf',
  },
  {
    id: 'sn3', name: 'Parle Hide & Seek Cookies', price: 30, category: 'Snacks & Packaged Foods',
    image: '/sn3.jpg', description: 'Crunchy chocolate chip cookies.', inStock: true, unit: '100 g',
  },
  {
    id: 'sn4', name: 'Maggi 2-Minute Noodles', price: 56, category: 'Snacks & Packaged Foods',
    image: '/sn4.jpg', description: '2-minute instant masala noodles.', inStock: true, unit: 'pack of 4',
  },

  // Household Essentials
  {
    id: 'h1', name: 'Vim Dishwashing Liquid', price: 110, category: 'Household Essentials',
    image: '/h1.jpg', description: 'Tough on grease, gentle on hands.', inStock: true, unit: '500 ml',
  },
  {
    id: 'h2', name: 'Surf Excel Matic Powder', price: 410, category: 'Household Essentials',
    image: '/h2.jpg', description: 'Stain removal detergent powder.', inStock: true, unit: '2 kg',
  },
  {
    id: 'h3', name: 'Lizol Floor Cleaner (Citrus)', price: 95, category: 'Household Essentials',
    image: '/h3.jpg', description: 'Kills 99.9% germs with citrus scent.', inStock: true, unit: '500 ml',
  },
  {
    id: 'h4', name: 'Garbage Bags (Medium)', price: 120, category: 'Household Essentials',
    image: '/h4.jpg', description: 'Biodegradable garbage bags.', inStock: true, unit: 'Pack of 30',
  },

  // Personal Care
  {
    id: 'pc1', name: 'Dove Moisturizing Soap', price: 150, category: 'Personal Care',
    image: '/pc1.jpg', description: 'Gentle moisturizing bathing bar.', inStock: true, unit: 'Pack of 3',
  },
  {
    id: 'pc2', name: 'Head & Shoulders Shampoo', price: 320, category: 'Personal Care',
    image: '/pc2.jpg', description: 'Clears dandruff and nourishes scalp.', inStock: true, unit: '400 ml',
  },
  {
    id: 'pc3', name: 'Colgate Strong Teeth Toothpaste', price: 115, category: 'Personal Care',
    image: '/pc3.jpg', description: 'Natural ingredients for total oral care.', inStock: true, unit: '200 g',
  },
  {
    id: 'pc4', name: 'Parachute Coconut Oil', price: 175, category: 'Personal Care',
    image: '/pc4.jpg', description: '100% pure coconut oil for hair.', inStock: true, unit: '250 ml',
  },

  // Beverages
  {
    id: 'b1', name: 'Taj Mahal Tea Leaves', price: 290, category: 'Beverages',
    image: '/b1.jpg', description: 'Strong and aromatic Assam tea leaves.', inStock: true, unit: '500 g',
  },
  {
    id: 'b2', name: 'Bru Filter Coffee Powder', price: 140, category: 'Beverages',
    image: '/b2.jpg', description: 'Authentic South Indian filter coffee.', inStock: true, unit: '250 g',
  },
  {
    id: 'b3', name: 'Real Mixed Fruit Juice', price: 110, category: 'Beverages',
    image: '/b3.jpg', description: '100% real mixed fruit juice.', inStock: true, unit: '1 L',
  },
  {
    id: 'b4', name: 'Kinley Packaged Water', price: 20, category: 'Beverages',
    image: '/b4.jpg', description: 'Purified drinking water.', inStock: true, unit: '1 L',
  }
];
