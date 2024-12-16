const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

const uri = process.env.DATABASE_URI;

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri);

    console.log(
      'Pinged your deployment. You successfully connected to Database!',
    );
  } catch (err) {
    console.error('There was an issue connecting with Database');
    console.error('ERROR - ', err.errorResponse.errmsg);
  }
}
run();

// Handling unhandled/rejected promises
process.on('unhandledRejection', (err) => {
  console.log('Error: A Promise was rejected');
});
