/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either password or data
export const updateSettings = async (data, type) => {
    
    console.log("Hello from updataSettings :D")

    try {
        const url = type === 'password'
            ? '/api/v1/users/updateMyPassword'
            : '/api/v1/users/updateMe';
        
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        
        if (res.data.status === 'success') {
          showAlert('success', `${type.toUpperCase()} updated successfully!`);
          window.setTimeout(() => {
            location.assign('/me'); // go to root directory automatically
          }, 10); // after 10 mSecond
        }
    }
    catch (err) {
        showAlert('error', err.response.data.message);
    }
};