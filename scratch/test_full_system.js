import { supabase } from '../server/config/supabase.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./.env') });

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING E2E PROGRAMMATIC SYSTEM INTEGRATION TEST ===');

  try {
    // 1. Fetch products to get a valid product ID
    console.log('\n[1/10] Fetching products list...');
    const prodRes = await fetch(`${BASE_URL}/products`);
    if (!prodRes.ok) throw new Error(`Fetch products failed: ${prodRes.statusText}`);
    const products = await prodRes.json();
    if (products.length === 0) throw new Error('No products found in the database. Please insert products first.');
    const testProduct = products[0];
    console.log(`- Found product: "${testProduct.name}" (ID: ${testProduct.id}, Price: ₹${testProduct.price})`);

    // 2. Signup a new user
    const randomSuffix = Math.floor(Math.random() * 100000);
    const email = `e2e_tester_${randomSuffix}@vasavimart.com`;
    const signupPayload = {
      name: 'John Doe',
      email: email,
      password: 'Password123!'
    };
    console.log(`\n[2/10] Signing up user: ${email}...`);
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupPayload)
    });
    const signupData = await signupRes.json();
    if (!signupRes.ok) throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);
    const token = signupData.token;
    const userId = signupData.user.id;
    console.log(`- Signup successful! User ID: ${userId}`);

    // 3. Fetch initial profile
    console.log('\n[3/10] Fetching initial profile...');
    const profileRes1 = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profile1 = await profileRes1.json();
    console.log(`- Profile received: name="${profile1.name}", addresses count = ${profile1.addresses?.length}`);

    // 4. Update profile and addresses
    console.log('\n[4/10] Updating profile and saving address...');
    const updatePayload = {
      name: 'Johnny',
      lastName: 'Doe',
      mobile: '9876543210',
      addresses: [
        {
          type: 'Home',
          street: '456 Royal Highway',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520002',
          isDefault: true
        }
      ]
    };
    const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatePayload)
    });
    const updateResult = await updateRes.json();
    if (!updateRes.ok) throw new Error(`Profile update failed: ${JSON.stringify(updateResult)}`);
    console.log('- Profile and address sync update completed.');

    // 5. Verify updated profile & addresses are fetched from database
    console.log('\n[5/10] Verifying updated profile and addresses from database...');
    const profileRes2 = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profile2 = await profileRes2.json();
    console.log(`- Fresh profile: name="${profile2.name}", lastName="${profile2.lastName}", phone="${profile2.mobile}"`);
    console.log(`- Address count: ${profile2.addresses?.length}`);
    if (profile2.addresses?.length > 0) {
      console.log(`  * Saved address: ${profile2.addresses[0].street}, ${profile2.addresses[0].city}, ${profile2.addresses[0].zipCode}`);
    } else {
      throw new Error('Address table did not save the address.');
    }

    // 6. Sync cart
    console.log('\n[6/10] Syncing cart items to backend...');
    const cartItems = [
      {
        id: testProduct.id,
        name: testProduct.name,
        price: testProduct.price,
        image: testProduct.image,
        quantity: 3
      }
    ];
    const cartRes = await fetch(`${BASE_URL}/cart/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cartItems })
    });
    const cartSyncResult = await cartRes.json();
    console.log(`- Cart sync response status: ${cartRes.status}`);

    // Verify cart load
    const getCartRes = await fetch(`${BASE_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const loadedCart = await getCartRes.json();
    console.log(`- Cart loaded from database: ${loadedCart.length} item(s)`);
    if (loadedCart.length > 0) {
      console.log(`  * Cart item product ID: ${loadedCart[0].product_id}, quantity: ${loadedCart[0].quantity}`);
    } else {
      throw new Error('Cart table is empty after sync.');
    }

    // 7. Sync wishlist
    console.log('\n[7/10] Syncing wishlist items to backend...');
    const productIds = [testProduct.id];
    const wishlistRes = await fetch(`${BASE_URL}/wishlist/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productIds })
    });
    console.log(`- Wishlist sync response status: ${wishlistRes.status}`);

    // Verify wishlist load
    const getWishlistRes = await fetch(`${BASE_URL}/wishlist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const loadedWishlist = await getWishlistRes.json();
    console.log(`- Wishlist loaded from database: ${loadedWishlist.length} item(s)`);
    if (loadedWishlist.length > 0) {
      console.log(`  * Wishlisted product ID: ${loadedWishlist[0].id}, name: "${loadedWishlist[0].name}"`);
    } else {
      throw new Error('Wishlist table is empty after sync.');
    }

    // 8. Place an order
    console.log('\n[8/10] Placing order via checkout...');
    const subtotal = testProduct.price * 3;
    const tax = subtotal * 0.05;
    const shipping = 40;
    const total = subtotal + tax + shipping;

    const orderPayload = {
      customer: {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: email,
        address: '456 Royal Highway',
        city: 'Vijayawada',
        zipCode: '520002'
      },
      items: [
        {
          id: testProduct.id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 3
        }
      ],
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod: 'Cash on Delivery'
    };

    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderDetails: orderPayload })
    });
    const orderResult = await orderRes.json();
    if (!orderRes.ok) throw new Error(`Place order failed: ${JSON.stringify(orderResult)}`);
    console.log(`- Order placed successfully! Order ID: ${orderResult.orderId}`);

    // 9. Fetch user orders and verify details (including items, payment, and order history)
    console.log('\n[9/10] Fetching user orders to verify order history and details...');
    const myOrdersRes = await fetch(`${BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const myOrders = await myOrdersRes.json();
    console.log(`- Found ${myOrders.length} order(s) for user`);
    if (myOrders.length > 0) {
      const placedOrder = myOrders[0];
      console.log(`  * Placed Order ID: ${placedOrder.id}`);
      console.log(`  * Placed Order Status: ${placedOrder.status}`);
      console.log(`  * Full raw order JSON:`, JSON.stringify(placedOrder, null, 2));
      console.log(`  * Placed Order Items count: ${placedOrder.order_items?.length}`);
      console.log(`  * Placed Order History count: ${placedOrder.order_history?.length}`);
      if (placedOrder.order_history?.length > 0) {
        console.log(`    - History log: [${placedOrder.order_history[0].status}] ${placedOrder.order_history[0].message}`);
      } else {
        throw new Error('Order history was not created.');
      }
    } else {
      throw new Error('Placed order not found in orders table.');
    }

    // 10. Verify Admin Analytics database counts
    console.log('\n[10/10] Verifying database changes reflected in admin analytics...');
    // We can simulate an admin request using admin token
    // Admin login email: 'admin@vasavimart.com', password: 'admin123'
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@vasavimart.com', password: 'admin123' })
    });
    if (!adminLoginRes.ok) {
      const text = await adminLoginRes.text();
      console.error(`- Admin login failed with status ${adminLoginRes.status}. Response:`, text);
      throw new Error(`Admin login failed: status ${adminLoginRes.status}`);
    }
    const adminData = await adminLoginRes.json();
    const adminToken = adminData.token;

    const analyticsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (!analyticsRes.ok) {
      const text = await analyticsRes.text();
      console.error(`- Analytics fetch failed with status ${analyticsRes.status}. Response:`, text);
      throw new Error(`Analytics fetch failed: status ${analyticsRes.status}`);
    }
    const analytics = await analyticsRes.json();
    console.log(`- Total Revenue: ₹${analytics.stats?.totalRevenue}`);
    console.log(`- Total Orders: ${analytics.stats?.totalOrders}`);
    console.log(`- Total Customers: ${analytics.customers?.length}`);
    console.log(`- Pending Orders: ${analytics.stats?.pendingOrders}`);
    console.log(`- Placed Orders Count: ${analytics.orders?.length}`);

    console.log('\n=== E2E PROGRAMMATIC INTEGRATION TEST PASSED SUCCESSFULLY ===');
  } catch (error) {
    console.error('\n!!! TEST FAILED WITH ERROR:', error);
  }
}

runTests();
