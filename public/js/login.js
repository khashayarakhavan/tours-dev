/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  console.log(' Hello from login.js :D ');
  console.log('login: email is:',email);
  console.log('login: password is:',password);
  
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    
    console.log('client: response from server is :', res.data);

    if (res.data.status === 'success') {
      console.log('WoooW!!! we did it  :-) ');
      showAlert('success','Logged in successfully');
      window.setTimeout(() => { 
        location.assign('/'); // go to root directory automatically 
      }, 1500); // after 1.5second 

    }
    
  } 
  catch (err) {
    console.log('OooOps!!! sth happened :-( ');
    showAlert('error', err.response.data.message); // alert error if sth went wrong
  }
};

// LOG OUT

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });

    if (res.data.status = 'success') {
      showAlert('success', 'Logged out successfully'); 
      window.setTimeout(() => {
        location.assign('/'); // go to root directory automatically 
      }, 500); // after 0.5second }
      //  location.reload(true); // automatically refresh page from Server not from browser cache.
    } 
  }
  catch (err) { // error if there is no internet connection 
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
