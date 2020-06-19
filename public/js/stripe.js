/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(`pk_test_51GvgM7Bg5OGP7RJDsP8v6xgwZJJ7Secx9DMgo2AtlsCEZfJjBfndkAe9MrJfGTlrSYBHqTsTOeibT0scv0s8kdzy00IFAFY5aB`);

export const bookTour = async tourId => {
  try {
    console.log('dalam :D');
    // 1) Get checkout session from API
    const clientSession = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Send `clientSession` to stripe checkout page to charge the bill.
    console.log('Hello from redirect to Stripe API !');
    await stripe.redirectToCheckout({
      sessionId: clientSession.data.serverSession.id
    });
  } 
  catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
