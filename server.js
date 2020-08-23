const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { log } = console;

// process.on('uncaughtException', err => {
//   log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   log(err.name, err.message);
//   process.exit(1);
// });

dotenv.config({ path: './config.env' });
const app = require('./app');

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
  .then(() => log('MongoDb-Atlas connected successfully!'));

const port = process.env.PORT || 3500;
const server = app.listen(port, () => {
  log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  log('UNHANDLED REJECTION! 💥 Shutting down...');
  log(err.name, err.message);
  server.close(() => { // close the server right now.
    process.exit(1); // manually shutdown the application.
  });
});

process.on('SIGTERM', () => {
  log('SIGTERM RECEIVED 👋 Shutting down gracefully...');
  server.close(() => { // Allows all the pending request to get processed completely before shutdown.
    log('Process Terminated! 😢');
  });
});
