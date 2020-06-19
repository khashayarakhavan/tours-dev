const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// We use a seperate route before parsing data with `express.json` bz Stripe forces us 
// to use a non-json or so called `raw` parsing using express.raw 
// or you can use `bodyParser.raw` method from body-parser NPM package to do the same job.
// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
app.post( 
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
  );
  
app.enable('trust proxy'); // trust proxies e.x. Heroku platfrom, Firebase & suchlike
// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors()); // Enable Cross-Origin-Resource-Sharing for all incoming requests.
// Add header to req: Access-Control-Allow-Origin *

// Only allow some specific origins
// e.x. if client is: www.aio.io 
// and API is: api.aio.io
// or want to give access to only special domains to use your service 

// app.use(cors({
//   origin: 'https://www.aio.io'
// }));

// respond to options request to non-simple/preflied requests other than `get` & `post`
// like `delete` or `patch`
app.options('*', cors());

// allow specific routes protection from non-simple requests
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // parse data from body 
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // parse data from urlencoded forms html requests.
app.use(cookieParser()); // parse data from cookies

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// AJAX API requests compression 
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
