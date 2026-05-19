import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { supabase } from '../config/supabase.js';
import mailService from '../services/mailService.js';
import authService from '../services/authService.js';
import logger from '../utils/logger.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    // Hash password manually since we are using custom users table
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    logger.info(`Checking if user ${email} already exists...`);
    const { data: existingUser, error: existError } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
    if (existError) {
      logger.error('Error checking existing user:', existError);
    }
    if (existingUser) {
      logger.warn(`Signup failed: User ${email} already exists`);
      return res.status(400).json({ error: "User already exists" });
    }

    const nameParts = (name || '').split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ');

    logger.info(`Inserting new user ${email} into database...`);
    const { data, error } = await supabase.from('users').insert([{
      email,
      password_hash,
      first_name,
      last_name,
      role: 'user'
    }]).select().single();

    if (error) {
      logger.error(`Database error inserting user ${email}:`, error);
      throw error;
    }
    logger.info(`Successfully registered and inserted user ${email}`, data);

    // Async notifications
    mailService.sendWelcome(email, name).catch(e => logger.error(e));
    mailService.sendAdminAlert('New User Registration', `Customer: ${name} (${email})`, '', '#2F8F4C').catch(e => logger.error(e));

    const token = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    const user = { id: data.id, name: `${data.first_name} ${data.last_name || ''}`.trim(), email: data.email, role: data.role };
    res.status(201).json({ token, user });
  } catch (error) {
    logger.error('Signup error', error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check Hardcoded Admin
    if (email === 'admin@vasavimart.com' && password === 'admin123') {
       const token = jwt.sign({ id: 'admin_1', role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
       return res.status(200).json({ token, user: { id: 'admin_1', name: 'Store Owner', email, role: 'admin' } });
    }

    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (error || !data) return res.status(400).json({ error: "Invalid email or password" });

    const validPass = await bcrypt.compare(password, data.password_hash);
    if (!validPass) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    const user = { id: data.id, name: `${data.first_name} ${data.last_name || ''}`.trim(), email: data.email, role: data.role, phone: data.phone };
    
    res.status(200).json({ token, user });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ error: error.message });
  }
};

export const registerNotification = async (req, res) => {
  // Legacy route for compatibility if needed
  res.status(200).json({ success: true, message: "Use /signup instead" });
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const { rawToken } = await authService.createPasswordReset(email);
    await mailService.sendPasswordReset(email, name || 'Customer', rawToken);
    res.status(200).json({ success: true, message: "Reset link sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Fetching profile for user ${userId}...`);

    // Fetch user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, role')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !userData) {
      logger.error(`User not found: ${userId}`, userError);
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch addresses
    const { data: addressesData, error: addressesError } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId);

    if (addressesError) {
      logger.error(`Error fetching addresses for user ${userId}:`, addressesError);
    }

    const user = {
      id: userData.id,
      name: userData.first_name,
      lastName: userData.last_name || '',
      email: userData.email,
      mobile: userData.phone || '',
      role: userData.role,
      addresses: (addressesData || []).map(addr => ({
        id: addr.id,
        type: addr.type,
        name: `${userData.first_name} ${userData.last_name || ''}`.trim(),
        mobile: userData.phone || '',
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zip_code,
        isDefault: addr.is_default
      }))
    };

    res.status(200).json(user);
  } catch (error) {
    logger.error('Failed to get profile', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, lastName, mobile, addresses } = req.body;
    logger.info(`Updating profile for user ${userId}...`, req.body);

    const updateData = {};
    if (name !== undefined) updateData.first_name = name;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (mobile !== undefined) updateData.phone = mobile;

    if (Object.keys(updateData).length > 0) {
      const { error: userError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (userError) {
        logger.error(`Database error updating profile for user ${userId}:`, userError);
        throw userError;
      }
    }

    // If addresses are passed, we sync them
    if (addresses !== undefined && Array.isArray(addresses)) {
      // Delete addresses for user and re-insert/update them
      const { error: deleteError } = await supabase
        .from('addresses')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        logger.error(`Database error deleting addresses for user ${userId}:`, deleteError);
        throw deleteError;
      }

      if (addresses.length > 0) {
        const inserts = addresses.map(addr => ({
          user_id: userId,
          type: addr.type || 'Home',
          street: addr.street,
          city: addr.city,
          state: addr.state || 'Andhra Pradesh',
          zip_code: addr.zipCode,
          is_default: addr.isDefault || false
        }));

        const { error: insertError } = await supabase
          .from('addresses')
          .insert(inserts);

        if (insertError) {
          logger.error(`Database error inserting addresses for user ${userId}:`, insertError);
          throw insertError;
        }
      }
    }

    logger.info(`Successfully updated profile and addresses for user ${userId}`);
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Failed to update profile', error);
    res.status(500).json({ error: error.message });
  }
};
