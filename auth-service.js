// auth-service.js
const API_URL = 'http://localhost:8000/api/users'; // Adjust to match your backend URL

// Register a new user
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include', // Important for cookies
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Login user
async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Important for cookies
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Logout user
async function logoutUser() {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'GET',
      credentials: 'include', // Important for cookies
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Get logged in user details
async function getUserDetails() {
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      credentials: 'include', // Important for cookies
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user details');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Check if user is authenticated
async function isAuthenticated() {
  try {
    const data = await getUserDetails();
    return { isAuthenticated: true, user: data.user };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
}

// Update user profile
async function updateUserProfile(profileData) {
  try {
    const response = await fetch(`${API_URL}/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
      credentials: 'include', // Important for cookies
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Profile update failed');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Export the functions to be used globally
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getUserDetails = getUserDetails;
window.isAuthenticated = isAuthenticated;
window.updateUserProfile = updateUserProfile;