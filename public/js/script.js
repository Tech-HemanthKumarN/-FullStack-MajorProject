//novalidate--> bootstrap class
//THIS VALIDATION IS FROM-->BOOTSTRAP-->UNDER FORM UNDER VALIDATION
//form bootstap i have created this for button purpose

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

// Selects forms

// js
// const forms = document.querySelectorAll('.needs-validation')
// It grabs every form with the class needs-validation (this is the Bootstrap convention for enabling their validation styling).

// Adds a submit listener
// For each such form, it listens for the "submit" event.

// Checks validity before sending

// js
// if (!form.checkValidity()) {
//     event.preventDefault()
//     event.stopPropagation()
// }

// form.checkValidity() is an HTML5 method that returns false if any input fails its validation constraints (like required, min, max, pattern, etc.).
// If the form is invalid, it prevents the default submission (preventDefault()) and stops the event from bubbling up (stopPropagation()).
// Triggers Bootstrap’s validation styles

// js
// form.classList.add('was-validated');

// This class tells Bootstrap to visually mark:
// Valid inputs in green with ✅
// Invalid inputs in red with ❌
// …based on the required, pattern, and other HTML validation attributes.

// 💡 In short:
// This script stops the form from submitting until all fields pass HTML5 validation, and applies Bootstrap’s “valid/invalid” styles so the user sees which fields need fixing.
