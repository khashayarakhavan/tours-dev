/* eslint-disable */
import '@babel/polyfill'; // Bring newer JS features to older browsers using babel.
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signUp } from './signUp';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signUpForm = document.querySelector('.form--sign-up');
const logOutBtn = document.querySelector('.nav__el--logout');
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
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({name, email}, 'data');
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
