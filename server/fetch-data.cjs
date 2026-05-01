const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

async function run() {
  try {
    let uri = process.env.MONGO_URI;
    if (uri) uri = uri.replace(/"/g, '');
    
    await mongoose.connect(uri, { family: 4 });
    
    const User = mongoose.model('User', new mongoose.Schema({
      name: String, 
      emailOrRoll: String, 
      loginTime: Date
    }));

    const Submission = mongoose.model('Submission', new mongoose.Schema({
      name: String,
      rollNumber: String,
      score: Number,
      total: Number,
      submissionTime: Date
    }));

    const users = await User.find().sort({_id: -1}).limit(5);
    const submissions = await Submission.find().sort({_id: -1}).limit(5);
    
    console.log('=== RECENT USERS ===');
    console.table(users.map(u => ({Name: u.name, Roll: u.emailOrRoll, Date: u.loginTime})));
    
    console.log('\n=== RECENT SUBMISSIONS ===');
    console.table(submissions.map(s => ({Name: s.name, Roll: s.rollNumber, Score: s.score + '/' + s.total, Date: s.submissionTime})));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
