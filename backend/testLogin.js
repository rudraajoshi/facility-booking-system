const bcrypt = require('bcryptjs');
const User = require('./src/models/User.model');
const { sequelize } = require('./src/config/database');

async function testLogin() {
  try {
    await sequelize.authenticate();
    console.log('✓ DB connected\n');

    const email = 'test@example.com';
    const password = 'test123';

    console.log('Testing login with:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('');

    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('✗ User not found');
      process.exit(1);
      return;
    }

    console.log('✓ User found:', user.email);
    console.log('User ID:', user.user_id);
    console.log('Role:', user.role);
    console.log('');

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (isPasswordValid) {
      console.log('✓ Password is correct!');
      console.log('✓ Login should work');
    } else {
      console.log('✗ Password is incorrect');
    }

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

testLogin();