const mongoose = require('mongoose');
require('dotenv').config({path: 'server/.env'});

async function run() {
  try {
    let uri = process.env.MONGO_URI;
    if (uri) uri = uri.replace(/"/g, '');
    
    await mongoose.connect(uri, { family: 4 });
    const User = mongoose.model('User', new mongoose.Schema({
      name: String, 
      emailOrRoll: String, 
      password: String
    }));
    
    await User.create({
      name: 'Direct Mongo Test', 
      emailOrRoll: 'mongotest-' + Date.now(), 
      password: 'abc'
    });
    
    console.log('SUCCESS_INSERT_USER');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
