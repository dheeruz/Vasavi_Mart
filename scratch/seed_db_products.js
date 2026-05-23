import { supabase } from '../server/config/supabase.js';

const products = [
  {
    id: "p_veg_1",
    name: "Fresh Organic Tomatoes",
    description: "Handpicked fresh organic red tomatoes from local farms. Vine-ripened and pesticide-free.",
    price: 45.00,
    category: "Fresh Vegetables",
    unit: "1 kg",
    stock: 120,
    image_url: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_fruit_2",
    name: "Premium Farm Bananas",
    description: "Ripe, sweet, and energy-rich premium bananas. Perfect for daily consumption.",
    price: 60.00,
    category: "Fresh Fruits",
    unit: "1 Dozen",
    stock: 80,
    image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_dairy_3",
    name: "Amul Fresh Milk 1L",
    description: "Homogenized toned fresh milk by Amul. Packed with essential nutrients.",
    price: 64.00,
    category: "Dairy & Breakfast",
    unit: "1 L",
    stock: 150,
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_grain_4",
    name: "Aashirvaad Whole Wheat Atta",
    description: "100% Chakki Fresh Whole Wheat Atta from Aashirvaad. Premium quality flour.",
    price: 245.00,
    category: "Rice, Atta & Grains",
    unit: "5 kg",
    stock: 90,
    image_url: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_pulse_5",
    name: "Tata Sampann Toor Dal",
    description: "Unpolished, natural and protein-rich split pigeon peas (Toor Dal) by Tata Sampann.",
    price: 165.00,
    category: "Pulses & Dals",
    unit: "1 kg",
    stock: 110,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_oil_6",
    name: "Fortune Sunflower Oil",
    description: "Light and healthy Fortune Refined Sunflower Oil. Contains vitamins A and D.",
    price: 135.00,
    category: "Oils & Ghee",
    unit: "1 L",
    stock: 130,
    image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_spice_7",
    name: "Everest Turmeric Powder",
    description: "Pure and aromatic turmeric powder with rich curcumin content by Everest.",
    price: 60.00,
    category: "Masalas & Spices",
    unit: "200 g",
    stock: 200,
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_snack_8",
    name: "Lay’s Classic Salted Chips",
    description: "Crispy, salted potato chips by Lay's. The perfect snack for any time.",
    price: 20.00,
    category: "Snacks & Namkeen",
    unit: "50 g",
    stock: 250,
    image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_bisc_9",
    name: "Parle Hide & Seek Cookies",
    description: "Delicious chocolate chip cookies. India's favorite chocochip cookie from Parle.",
    price: 35.00,
    category: "Biscuits & Cookies",
    unit: "120 g",
    stock: 140,
    image_url: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_sweet_10",
    name: "Cadbury Dairy Milk Silk",
    description: "Premium smooth and creamy milk chocolate bar from Cadbury. Melt-in-your-mouth flavor.",
    price: 80.00,
    category: "Chocolates & Sweets",
    unit: "60 g",
    stock: 95,
    image_url: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_tea_11",
    name: "Tata Premium Tea",
    description: "Premium black tea blend from Tata. Sourced from the finest gardens of Assam.",
    price: 140.00,
    category: "Tea & Coffee",
    unit: "250 g",
    stock: 160,
    image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_juice_12",
    name: "Real Mixed Fruit Juice",
    description: "Rich, delicious, and healthy mixed fruit juice by Real. High fruit content.",
    price: 110.00,
    category: "Soft Drinks & Juices",
    unit: "1 L",
    stock: 100,
    image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_energy_13",
    name: "Red Bull Energy Drink",
    description: "Red Bull Energy Drink vitalizes body and mind. High caffeine content.",
    price: 125.00,
    category: "Energy Drinks",
    unit: "250 ml",
    stock: 180,
    image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_cake_14",
    name: "Britannia Fruit Cake",
    description: "Soft and delicious Britannia Fruit Cake slice. Loaded with premium candied fruits.",
    price: 40.00,
    category: "Bakery & Cakes",
    unit: "150 g",
    stock: 85,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_frozen_15",
    name: "McCain French Fries",
    description: "Super crispy potato french fries. Ready to deep fry or air fry.",
    price: 130.00,
    category: "Frozen Foods",
    unit: "750 g",
    stock: 75,
    image_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_instant_16",
    name: "Maggi 2-Minute Noodles",
    description: "India's favorite instant noodles with authentic tastemaker masala from Nestlé.",
    price: 56.00,
    category: "Instant Foods",
    unit: "4 Pack",
    stock: 300,
    image_url: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_noodle_17",
    name: "Bambino Pasta Macaroni",
    description: "High-quality semolina elbow macaroni pasta. Perfect for creamy pasta dishes.",
    price: 45.00,
    category: "Noodles & Pasta",
    unit: "500 g",
    stock: 120,
    image_url: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_ready_18",
    name: "MTR Rava Idli Mix",
    description: "Instant rava idli breakfast mix. Light, fluffy, and ready in minutes.",
    price: 90.00,
    category: "Ready-to-Cook Foods",
    unit: "500 g",
    stock: 90,
    image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_nuts_19",
    name: "Premium Almonds (Badam)",
    description: "Crunchy, handpicked, raw premium almonds. Excellent source of vitamins.",
    price: 450.00,
    category: "Dry Fruits & Nuts",
    unit: "500 g",
    stock: 65,
    image_url: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_pickle_20",
    name: "Mother's Recipe Mango Pickle",
    description: "Traditional Indian tangy and spicy mango pickle. Packed with aromatic oils.",
    price: 95.00,
    category: "Pickles & Sauces",
    unit: "400 g",
    stock: 110,
    image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_organic_21",
    name: "Organic Tattva Honey",
    description: "100% pure organic raw wild forest honey. Packed with health benefits.",
    price: 220.00,
    category: "Organic Products",
    unit: "250 g",
    stock: 75,
    image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_meat_22",
    name: "Fresh Boneless Chicken Breast",
    description: "Tender, fresh, halal cut skinless chicken breast. Cleaned and ready to cook.",
    price: 280.00,
    category: "Meat & Seafood",
    unit: "1 kg",
    stock: 45,
    image_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_egg_23",
    name: "Farm Fresh Eggs 12 Count",
    description: "White, fresh, farm eggs. High protein daily breakfast staple.",
    price: 90.00,
    category: "Eggs & Poultry",
    unit: "1 Pack",
    stock: 140,
    image_url: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_pc_24",
    name: "Dove Nourishing Body Wash",
    description: "Deeply moisturizing body wash bar from Dove. Contains skin-natural nutrients.",
    price: 160.00,
    category: "Personal Care",
    unit: "250 ml",
    stock: 110,
    image_url: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_skin_25",
    name: "Nivea Soft Moisturizing Cream",
    description: "Nivea Soft is a highly effective, intensive moisturizing cream for everyday use.",
    price: 190.00,
    category: "Skin Care",
    unit: "200 ml",
    stock: 90,
    image_url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_hair_26",
    name: "Dove Intense Repair Shampoo",
    description: "Gently cleanses and prevents hair fall. Restores strength against damage.",
    price: 245.00,
    category: "Hair Care",
    unit: "340 ml",
    stock: 120,
    image_url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_oral_27",
    name: "Colgate Strong Teeth Toothpaste",
    description: "Colgate Strong Teeth provides 2x stronger teeth protection against cavities.",
    price: 95.00,
    category: "Oral Care",
    unit: "200 g",
    stock: 180,
    image_url: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_baby_28",
    name: "Pampers Baby Gentle Wipes",
    description: "Mild, fragrance-free baby wipes from Pampers. Protects delicate baby skin.",
    price: 149.00,
    category: "Baby Care",
    unit: "Pack of 80",
    stock: 80,
    image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_pet_29",
    name: "Pedigree Adult Dry Dog Food",
    description: "Pedigree complete dog food for adult dogs. Chicken and vegetable flavor.",
    price: 360.00,
    category: "Pet Care",
    unit: "1.2 kg",
    stock: 55,
    image_url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_house_30",
    name: "Vim Dishwash Liquid",
    description: "Concentrated gel lemon scent for quick grease removal and sparkling dishes.",
    price: 105.00,
    category: "Household Essentials",
    unit: "500 ml",
    stock: 200,
    image_url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_clean_31",
    name: "Lizol Floor Cleaner Citrus",
    description: "Lizol disinfectant floor cleaner kills 99.9% of germs. Citrus fragrance.",
    price: 99.00,
    category: "Cleaning Supplies",
    unit: "500 ml",
    stock: 140,
    image_url: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_laund_32",
    name: "Surf Excel Easy Wash Detergent",
    description: "Surf Excel Easy Wash removes tough stains easily. Works in bucket washing.",
    price: 140.00,
    category: "Laundry Products",
    unit: "1 kg",
    stock: 150,
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_kitchen_33",
    name: "Kitchen Towel Paper Rolls",
    description: "Absorbent 2-ply kitchen paper towel rolls. Pack of 2 rolls.",
    price: 80.00,
    category: "Kitchen Essentials",
    unit: "2 Rolls",
    stock: 110,
    image_url: "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_bath_34",
    name: "Dettol Liquid Handwash Soap",
    description: "Dettol Liquid Soap provides 100% better protection against germs. Original pine.",
    price: 85.00,
    category: "Bath & Body",
    unit: "200 ml",
    stock: 170,
    image_url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_health_35",
    name: "Dabur Chyawanprash Immunity",
    description: "Traditional Ayurvedic recipe. Boosts immunity and guards against seasonal infections.",
    price: 325.00,
    category: "Health & Wellness",
    unit: "500 g",
    stock: 90,
    image_url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_office_36",
    name: "Classmate Single Line Notebook",
    description: "Premium paper notebook by Classmate. Pack of 6 notebooks, single line ruled.",
    price: 180.00,
    category: "Stationery & Office Supplies",
    unit: "6 Pack",
    stock: 70,
    image_url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_appl_37",
    name: "Prestige Induction Cooktop",
    description: "Prestige induction stove with quick heating, preset menus, and automatic keep warm.",
    price: 1999.00,
    category: "Home & Kitchen Appliances",
    unit: "1 Unit",
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_season_38",
    name: "Fresh Alphonso Mangoes 6 pcs",
    description: "Sweet, juicy, and aromatic premium Alphonso mangoes. Sourced from Ratnagiri.",
    price: 499.00,
    category: "Seasonal Products",
    unit: "6 pcs",
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_import_39",
    name: "Nutella Cocoa Hazelnut Spread",
    description: "Delicious hazelnut cocoa spread by Ferrero Nutella. The perfect topping for toast.",
    price: 390.00,
    category: "Imported Foods",
    unit: "350 g",
    stock: 85,
    image_url: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_bake_40",
    name: "Weikfield Baking Powder",
    description: "Double acting baking powder from Weikfield. Ideal for baking fluffy cakes.",
    price: 40.00,
    category: "Bakery Ingredients",
    unit: "100 g",
    stock: 120,
    image_url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_cook_41",
    name: "Patanjali Hing Asafoetida",
    description: "Pure and aromatic Hing powder by Patanjali. Essential Indian spice.",
    price: 55.00,
    category: "Cooking Ingredients",
    unit: "25 g",
    stock: 180,
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_cereal_42",
    name: "Kellogg's Corn Flakes",
    description: "Original corn flakes by Kellogg's. Crisp, golden flakes high in iron.",
    price: 185.00,
    category: "Breakfast Cereals",
    unit: "475 g",
    stock: 100,
    image_url: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_honey_43",
    name: "Dabur Pure Honey",
    description: "100% pure Sunderbans honey by Dabur. Sourced directly from forest beehives.",
    price: 215.00,
    category: "Honey & Spreads",
    unit: "400 g",
    stock: 120,
    image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_ice_44",
    name: "Amul Vanilla Magic Cup",
    description: "Creamy vanilla ice cream in a cup from Amul. Made with real milk.",
    price: 30.00,
    category: "Ice Cream & Desserts",
    unit: "100 ml",
    stock: 190,
    image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_flower_45",
    name: "Fresh Yellow Marigold Garlands",
    description: "Freshly hand-woven yellow marigold flower garlands for pooja and festivals.",
    price: 80.00,
    category: "Fresh Flowers",
    unit: "2 Pack",
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_festive_46",
    name: "Haldiram's Premium Kaju Katli",
    description: "Premium cashew fudge sweets (Kaju Katli) by Haldiram's. Delicious festive treat.",
    price: 450.00,
    category: "Festive Specials",
    unit: "400 g",
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_combo_47",
    name: "Super Saver Atta 5kg + Sugar 1kg",
    description: "Smart grocery combo including Aashirvaad Atta 5kg and Madhur Sugar 1kg.",
    price: 285.00,
    category: "Combo Offers",
    unit: "1 Combo",
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_best_48",
    name: "Amul Fresh Cream 250ml",
    description: "Fresh pasteurized cream by Amul. Perfect for gravies, desserts, and coffee.",
    price: 65.00,
    category: "Best Sellers",
    unit: "250 ml",
    stock: 140,
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_new_49",
    name: "Epigamia Natural Greek Yogurt",
    description: "Zero fat, thick and creamy natural greek yogurt by Epigamia. High protein.",
    price: 50.00,
    category: "New Arrivals",
    unit: "90 g",
    stock: 110,
    image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  },
  {
    id: "p_daily_50",
    name: "Tata Salt Lite 1kg",
    description: "Tata Salt Lite has 15% less sodium than regular salt. Promotes healthy blood pressure.",
    price: 40.00,
    category: "Daily Essentials",
    unit: "1 kg",
    stock: 160,
    image_url: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=600",
    in_stock: true
  }
];

async function seed() {
  console.log("Seeding Vasavi Mart products database with 50 products...");
  try {
    // Delete existing products
    const { error: deleteError } = await supabase.from('products').delete().neq('id', 'dummy');
    if (deleteError) throw deleteError;
    console.log("Deleted existing products.");

    // Insert 50 products
    const { data, error } = await supabase.from('products').insert(products).select();
    if (error) throw error;
    console.log(`Successfully seeded ${data.length} products!`);
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seed();
