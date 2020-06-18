/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el); // remote element from its parent element
};

// type is 'success' or 'error'
export const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`; // set an alert div using 'type' to add different classes to the html and then have different CSS styles based on this type to differentiate between success and error alerts.
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup); // add markup code right after 'body' element begins
  window.setTimeout(hideAlert, time * 1000); // automatically run hidealert after 5sec.
};
