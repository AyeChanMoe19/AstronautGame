// Function to handle user registration
function register() {
    
    const username = document.querySelector('#UsernameInput').value;
    const email = document.querySelector('#EmailInput').value;
    const phonenumber = document.querySelector('#PhoneNumberInput').value;
    const address = document.getElementById('AddressInput').value;
    const password = document.querySelector('#PasswordInput').value;
    const confirmPassword = document.querySelector('#ConfirmPasswordInput').value;

    // Validate data
    if (!username || !email || !phonenumber || !address || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Check if user already exists
    if (localStorage.getItem(username)) {
        alert('Username is already registered. Please log in.');
        return;
    }

    // Store data
    const user = {
        username: username,
        email: email,
        password: password,
        phonenumber: phonenumber,
        address: address,
        role: 'user', // Default role
        topScore: 0, // Initial score
        latestScore: 0
    };

    localStorage.setItem(username, JSON.stringify(user));

    alert('User registered successfully!');

    window.location.href = "../html/login.html";
}

// Function to handle user login
function login(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get the input values
    const username = document.querySelector('#UsernameInput').value;
    const password = document.querySelector('#PasswordInput').value;

    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem(username));

    // Check if user exists and the password matches
    if (user && user.password === password) {
        // If login is successful, store the current user in localStorage
        localStorage.setItem("currentUser", username); 
        localStorage.setItem('loggedIn', 'true'); 
        
        window.location.href = "../index.html"; 
    } else {
        // If login fails, alert the user
        alert('Invalid UserName or Password. Please try again.');
    }
}

// Update User's Score on Game End
function updateUserScore(newScore, newTime) {
    const username = localStorage.getItem("currentUser");
    if (!username) return; // Ensure a user is logged in

    // Retrieve user data from localStorage
    let userData = JSON.parse(localStorage.getItem(username)) || {
        latestScore: 0,
        topScore: 0,
        bestTime: Infinity
    };

    // Update latest score
    userData.latestScore = newScore;

    // Update top score if the new score is higher
    if (newScore > userData.topScore) {
        userData.topScore = newScore;
    }

    // Update best time if the new time is lower
    if (newTime < userData.bestTime) {
        userData.bestTime = newTime;
    }

    // Save the updated user data back to localStorage
    localStorage.setItem(username, JSON.stringify(userData));
}

// Function to handle user logout
function logout() {
    localStorage.removeItem("currentUser"); 
    localStorage.setItem('loggedIn', 'false'); 
    alert('Logged out successfully!');
    window.location.href = './html/register.html'; 
}

// Check login status on page load
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    const navbar = document.getElementById('navbar');
    const registerLink = document.getElementById('registerLink');
    const loginLink = document.getElementById('loginLink');
    const scoreboardLink = document.getElementById('scoreboardLink');
    const logoutLink = document.getElementById('logoutLink');

    if (isLoggedIn) {
        registerLink.style.display = 'none';
        loginLink.style.display = 'none';
        scoreboardLink.style.display = 'block';
        logoutLink.style.display = 'block';
    }
}

// Call the function to check login status on page load
document.addEventListener('DOMContentLoaded', checkLoginStatus);