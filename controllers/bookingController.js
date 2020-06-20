/* Stripe returns a function. initiate it with the secret key */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {apiVersion: ''});

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  console.log(tour);

  // 2) Create checkout session
  const envUrl =
    process.env.NODE_ENV === 'production'
      ? `${req.protocol}://${req.get('host')}/my-tours/?alert=booking`
      : `${req.protocol}://${req.get('host')}/my-tours/?tour=${
          req.params.tourId
        }&user=${req.user.id}&price=${tour.price}&alert=shaja`;

  const serverSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // DEV: In development we can use the following trick to read query parameters from Stripe checkout process.

    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,

    // Prod: In Production: use the following strategy.
    success_url: `${envUrl}`,
    /* use alert method in query to triger alerts using JS. */
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    serverSession
  });
});

// DEV: This is only TEMPORARY for development testing,
// because it's UNSECURE: everyone can make bookings without paying.
exports.createBookingCheckoutDEV = catchAsync(async (req, res, next) => {
  console.log('Hello from booking checkout :DEV ');
  if (process.env.NODE_ENV === 'production') return next();
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0] + `?alert=shaja`);
});

// <-- Dev: create the booking after successfull payment from Stripe success URL callback.

// Record in DB: Decode information from successfull payment session
const createBookingCheckoutWebhook = async session => {
  const tour = session.client_reference_id; // define the tour id

  // find user using their email address. Then find their userId.
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100; // Change the currency to Dollars not Cents, so divide it by 100.
  await Booking.create({ tour, user, price }); // Record in database to `Booking` model.
};

// Check incoming webhook from Stripe.
exports.webhookCheckout = (req, res, next) => {
  console.log('Hello from webHook receiver !');
  const signature = req.headers['stripe-signature']; // verify it is from Stripe.
  let event; // block variable 
  try {  // validate data using signature and secret
    event = stripe.webhooks.constructEvent(
      req.body, // which comes directly from Stripe in RAW format and parsed by bodyParser
      signature, // which is in the header
      `${process.env.STRIPE_WEBHOOK_KEY}`); // which is the key in our secure vault.
      console.log('here is the event :-) !', event);
  }
  catch (err) {
    console.log('here is the error :-( !', err);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') { // check if it was from a successfull payment.
    console.log('this is event data', event.data);
    createBookingCheckoutWebhook(event.data.object); // sending session object from `event` variable to create a booking in DB
  }
  res.status().json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
