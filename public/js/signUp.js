/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async (name, email, password, passwordConfirm) => {
  console.log(' Hello :D ');
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success','Account created successfully');
      window.setTimeout(() => { 
        location.assign('/'); // go to root directory automatically 
      }, 3000); // after 3second 

    }
    
  } 
  catch (err) {
    showAlert('error', err); // alert error if sth went wrong
  }
};
