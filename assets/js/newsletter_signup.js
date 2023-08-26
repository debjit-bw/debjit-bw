document.addEventListener('DOMContentLoaded', function() {
    const signupButton = document.getElementById('signup-button');
    const emailBox = document.getElementById('email-box');
    const call = document.getElementById('call');
    const subquote = document.getElementById('subquote');
  
    signupButton.addEventListener('click', function(event) {
        event.preventDefault();
        signupButton.textContent = 'Subscribing';
        const email = emailBox.value;
        
        grecaptcha.ready(function () {
            console.log("ready");
            grecaptcha.execute('6LeNhigmAAAAAOURwWroLKWb07nb7O0ZSEpxXNEn', { action: 'submit' }).then(function (token) {
                const data = {
                    email: email,
                    token: token
                };
                
                fetch('https://us-central1-my-project-5269-1684667148053.cloudfunctions.net/add_mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(data)
                })
                .then(response => response.json())
                .then(result => {
                if (result.success) {
                    call.textContent = "You're set!";
                    subquote.textContent = "The confirmation email is flying to your inbox.";
                    signupButton.textContent = 'Subscribed!';
                } else {
                    call.textContent = "Aww snap?";
                    subquote.textContent = result.message;
                }
                })
                .catch(error => {
                console.error('Error:', error);
                });
            });
        });
    })
});