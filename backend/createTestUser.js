const bcrypt = require('bcryptjs');
const User = require('./src/models/User.model');
const { sequelize } = require('./src/config/database');

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('✓ DB connected');

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { email: 'test@example.com' } 
    });

    if (existingUser) {
      console.log('✓ Test user already exists');
      console.log('Email:', existingUser.email);
      console.log('Role:', existingUser.role);
      
      // Update password to make sure it's correct
      const hashedPassword = await bcrypt.hash('test123', 10);
      await existingUser.update({ password: hashedPassword });
      console.log('✓ Password updated to: test123');
      
      process.exit(0);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Create the user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'customer'
    });

    console.log('✓ Test user created successfully!');
    console.log('Email:', user.email);
    console.log('Password: test123');
    console.log('Role:', user.role);
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();