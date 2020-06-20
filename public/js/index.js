/* eslint-disable */
import '@babel/polyfill'; // Bring newer JS features to older browsers using babel.
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signUp } from './signUp';
import { updateSettings } from './updateSettings';
import { showAlert } from './alerts';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signUpForm = document.querySelector('.form--sign-up');
const logOutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations); // import locations data embeded inside dataset attribute of 'map' element.
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password); // use Login function from login.js
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData(); // create a form-data bz we need should use multipart/form-data to send photos and files.
    form.append('name', document.getElementById('name').value); // fill the first data in the form
    form.append('email', document.getElementById('email').value); // fill the second data in the form
    form.append('photo', document.getElementById('photo').files[0] ); // files in input HTML element are stored in an array.
    // this array is used here to access the first element `[0]` bz it is stricted to only accept 1 file in multer upload.Single() method
    console.log(form);

    updateSettings(form, 'data'); // forms are treated just as JS objects so it can be a data.
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Saving...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

  });
}

if (signUpForm) {
  signUpForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--create-acount').textContent = 'Creating...';
    document.querySelector('.btn--create-acount').classList.add('light-out');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    console.log(name, email, password, passwordConfirm);
    await signUp(name, email, password, passwordConfirm);

    document.querySelector('.btn--create-acount').textContent = 'Thanks!';
    document.querySelector('.btn--create-acount').classList.remove('light-out');
    document.getElementById('name').textContent = '';
    document.getElementById('email').textContent = '';
    document.getElementById('password').textContent = '';
    document.getElementById('password-confirm').textContent = '';

  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = "Processing...";
    /* javascript automatically converts the kebab-cased variables to camelCased variable  */
    /* so here instead of tour-id we use tourId alongwith ES6 destructuring */
    const { tourId } = e.target.dataset; 
    bookTour(tourId);
  });
}

// showing alert from url query.
const alertMessage = document.querySelector('body').dataset.alert; // read the alert messeage from middleware and set it to a variable.
if (alertMessage) showAlert('success', alertMessage, 20); // use showAlert to display message and customize it.
