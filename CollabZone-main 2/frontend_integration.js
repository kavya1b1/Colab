// frontend_integration.js

// API Base URL
const API_BASE_URL = 'http://localhost:3000';

// Utility function to fetch data from the API
async function fetchData(endpoint, method, body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
}

// Registration Handler
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await fetchData('/register', 'POST', { name, email, password });
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } catch (error) {
            alert(error.message);
        }
    });
}

// Login Handler
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await fetchData('/login', 'POST', { email, password });
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            window.location.href = 'profile.html';
        } catch (error) {
            alert(error.message);
        }
    });
}

// Profile Management
if (document.getElementById('profile-form')) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = 'login.html';
    }

    // Fetch and populate user data
    (async () => {
        try {
            const userData = await fetchData('/profile', 'GET', null, token);

            document.getElementById('name').value = userData.name;
            document.getElementById('skills').value = userData.skills;
            document.getElementById('travelHistory').value = userData.travelHistory;
        } catch (error) {
            alert(error.message);
            window.location.href = 'login.html';
        }
    })();

    // Update profile handler
    document.getElementById('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const skills = document.getElementById('skills').value;
        const travelHistory = document.getElementById('travelHistory').value;

        try {
            await fetchData('/update-profile', 'POST', { name, skills, travelHistory }, token);
            alert('Profile updated successfully!');
        } catch (error) {
            alert(error.message);
        }
    });

    // Logout handler
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    });
}
// Profile Icon Toggle
document.getElementById('profile-icon').addEventListener('click', async () => {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('visible');

    if (dropdown.classList.contains('visible')) {
        // Fetch and display user data
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not logged in. Redirecting to login page.');
            window.location.href = 'login.html';
        }

        try {
            const userData = await fetchData('/profile', 'GET', null, token);
            document.getElementById('dropdown-name').innerText = userData.name;
            document.getElementById('dropdown-skills').innerText = userData.skills || 'No skills added';
            document.getElementById('dropdown-travel').innerText = userData.travelHistory || 'No travel history';
        } catch (error) {
            alert(error.message);
        }
    }
});

// Logout Handler
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    window.location.href = 'login.html';
});
