/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  console.log(' Hello :D ');
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success','Logged in successfully');
      window.setTimeout(() => { 
        location.assign('/'); // go to root directory automatically 
      }, 1500); // after 1.5second 

    }
    
  } 
  catch (err) {
    showAlert('error', err.response.data.message); // alert error if sth went wrong
  }
};

// LOG OUT

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout'
    });

    if ((res.data.status = 'success'))  showAlert('success','Logged out successfully'); location.reload(true); // automatically refresh page from Server not from browser cache.
  } 
  catch (err) { // error if there is no internet connection 
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
