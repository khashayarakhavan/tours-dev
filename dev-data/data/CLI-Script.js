const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')); // change them to JS objects.
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importTours = async () => {
  try {
    await Tour.create(tours); // upload data into Tour collection.

    console.log('Tours successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importUsers = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });

    console.log('Users successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importReviews = async () => {
  try {
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// DELETE ALL DATA FROM DB
// const deleteData = async () => {
//   try {
//     await Tour.deleteMany(); // deleteMany method all documents in the collections.
//     await User.deleteMany();
//     await Review.deleteMany();
//     console.log('Data successfully deleted!');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit(); // exit from CLI function
// };

const deleteTours = async () => {
  try {
    await Tour.deleteMany(); // deleteMany method all documents in the collections.
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // exit from CLI function
};

const deleteUser = async () => {
  try {
    await User.deleteMany();

    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // exit from CLI function
};

const deleteReviews = async () => {
  try {
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // exit from CLI function
};

if (process.argv[2] === '--importTours') { // Script to enter different options in the CLI.
  importTours();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--importUsers') {
  importUsers();
}

// switch (process.argv[2]) {
//   case '--importTours': {
//     importTours();
//   }

//   case '--importUser': {
//     importUser();
//   }
//   case '--importReviews': {
//     importReviews();
//   }
//   case '--deleteTours': {
//     deleteTours();
//   }
//   case '--deleteUser': {
//     deleteUser();
//   }
//   case '--deleteReviews': {
//     deleteReviews();
//   }
// }
