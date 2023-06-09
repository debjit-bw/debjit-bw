// Define an array of sentences
// var sentences = [
//     "What's your best hotfix?",
//     "Favourite hype word to trick VCs?",
//     "You fellow rustacean?",
//     "Can you code in assembly?",
// ];

var prompts = [
    "Who are you?",
    "Where do you work currently?",
    "What do you do?",
    "Tell me about some projects you worked on.",
    "Why did you start blogging?",
    "What's your favourite domain?",
    "Are you an AI?",
    "What's your favourite programming language?",
    "What do you want to do next?",
    "What book are you reading?",
    "Explain the code in your fire fighting robot.",
    "Why did you choose mental health for one of your projects?",
    "Have you worked with embedded systems?",
    "Why are you doing mechanical engineering?",
]

var chat_id = null;

// document.addEventListener('DOMContentLoaded', function () {
// Update the initial text every 3 seconds
var input = document.getElementById('user-input');
var currentWord = '';
var currentSentenceIndex = Math.floor(Math.random() * prompts.length);
var intervalId;
var t1;
var t2;

function typeSentence() {
    var randomPrompt = prompts[currentSentenceIndex];
    var words = randomPrompt.split(' ');
    var currentWordIndex = 0;

    t1 = setTimeout(function () {
        intervalId = setInterval(function () {
            if (currentWordIndex < words.length) {
                currentWord += words[currentWordIndex] + ' ';
                input.value = currentWord;
                currentWordIndex++;
            } else {
                clearInterval(intervalId);
                currentWord = '';
                currentSentenceIndex = (currentSentenceIndex + 1) % prompts.length;
                typeSentence(); // Call the function recursively to type the next sentence
            }
        }, 100); // Adjust the interval time (in milliseconds) to control the typing speed
    }, 2000); // Adjust the delay time (in milliseconds) before typing each sentence
}

// Start typing the first sentence after a delay
t2 = setTimeout(function () {
    typeSentence();
}, 1); // Adjust the delay time (in milliseconds) before starting the typing animation

document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('send-button').click();
    }
});

document.getElementById('user-input').addEventListener('focus', function () {
    clearTimeout(t1); // Cancel the timeout
    clearTimeout(t2); // Cancel the timeout
    clearInterval(intervalId); // Cancel the interval
});


var ws;

document.getElementById('send-button').addEventListener('click', function () {
    // Hide the send icon and show the loading icon
    document.getElementById('send-icon').style.display = 'none';
    document.getElementById('loading-icon').style.display = '';

    var userInput = document.getElementById('user-input').value;

    // Disable the send button while waiting for the API response
    document.getElementById('send-button').disabled = true;

    grecaptcha.ready(function () {
        console.log("ready");
        grecaptcha.execute('6LeNhigmAAAAAOURwWroLKWb07nb7O0ZSEpxXNEn', { action: 'submit' }).then(function (token) {
            // Make the API call with the user's input and the reCAPTCHA token
            console.log("token: " + token);
            var message = {
                input: userInput,
                recaptchaToken: token,
                chat_id: chat_id
            };

            // Create a new WebSocket connection if it doesn't already exist
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                ws = new WebSocket('wss://mygpt2-7kxt74l7iq-uc.a.run.app/chat');
                ws.onmessage = function (event) {
                    var data = JSON.parse(event.data);
                    console.log(data)
                    if (data.type === 'token') {
                        // Handle incoming token here
                        console.log(data.message); // Print the received token

                        // Store the chat_id
                        chat_id = data.chat_id;

                        // Check if the spacer is already present
                        var spacerExists = document.getElementById('spacer');

                        if (!spacerExists) {
                            // Create the spacer div and give it an id
                            var spacerDiv = document.createElement('div');
                            spacerDiv.id = 'spacer';
                            spacerDiv.className = 'spacer';

                            // Insert the spacer div before the input field
                            var inputField = document.getElementById('user-input');
                            inputField.parentNode.insertBefore(spacerDiv, inputField);
                        }

                        // Add the received word to the response div
                        responseDiv.textContent += data.message;
                    } else if (data.type === 'end') {
                        // Handle end of message here
                        console.log('End of message');

                        // Clear the input field and enable the send button
                        document.getElementById('user-input').value = '';
                        document.getElementById('send-button').disabled = false;
                        document.getElementById('user-input').focus();

                        // Show the send icon and hide the loading icon
                        document.getElementById('send-icon').style.display = '';
                        document.getElementById('loading-icon').style.display = 'none';
                    } else if (data.type === 'error') {
                        // Handle error here
                        console.log('Error: ' + data.message);

                        // Clear the input field and enable the send button
                        document.getElementById('user-input').value = '';
                        document.getElementById('send-button').disabled = false;
                        document.getElementById('user-input').focus();

                        // format the error message properly
                        responseDiv.textContent = "something bad happened in the clouds :/";

                        // Show the send icon and hide the loading icon
                        document.getElementById('send-icon').style.display = '';
                        document.getElementById('loading-icon').style.display = 'none';
                    } else if (data.type === 'message') {
                        // Handle message here
                        console.log('Message: ' + data.message);

                        // Add the received message to the response div
                        responseDiv.textContent += data.message + " ";
                    }
                };
            } else if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
                document.getElementById('user-input').value = '';
                console.log("sent")
            }

            // Send the user's message through the WebSocket connection
            ws.onopen = function (event) {
                console.log("connected")
                ws.send(JSON.stringify(message));
                document.getElementById('user-input').value = '';
                console.log("sent")
            };

            // Create and append user's message div
            var messageDiv = document.createElement('div');
            messageDiv.textContent = userInput;
            messageDiv.classList.add("user-message");
            document.getElementById('messages').appendChild(messageDiv);

            // Create a new response div and append it to the chatbox
            responseDiv = document.createElement('div');
            responseDiv.classList.add("ai-response");
            document.getElementById('messages').appendChild(responseDiv);
        });
    });
});
// });