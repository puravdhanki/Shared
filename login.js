// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');

// Toggle between login and register forms
function toggleForm(event) {
  event.preventDefault();
  
  if (loginForm.classList.contains('hidden')) {
    // Switch to login form
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    formTitle.textContent = 'Welcome to EduMosaic';
    formSubtitle.textContent = 'Sign in to your account';
  } else {
    // Switch to register form
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    formTitle.textContent = 'Create an Account';
    formSubtitle.textContent = 'Join EduMosaic today';
  }
}

// Display error message
function showError(message) {
  alert(message);
}

// Display success message
function showSuccess(message) {
  alert(message);
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();
  
  // Get form values
  const college = document.getElementById('loginCollege').value;
  const role = document.getElementById('loginRole').value;
  const department = document.getElementById('loginDepartment').value;
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  // Form validation
  if (!college || !role || !department || !email || !password) {
    showError('Please fill in all required fields');
    return;
  }
  
  try {
    // Call login API with just email and password as required by backend
    const response = await loginUser({ 
      email, 
      password
    });
    
    if (response.success) {
      // Get the user object from the response
      const user = response.user;
      
      // Check if user role, college and department match what was selected
      if (user.college !== college || user.department !== department) {
        await logoutUser();
        showError('Invalid credentials for the selected college or department');
        return;
      }
      
      // We don't need to check role explicitly since your backend will return the proper role
      
      // Store user info in localStorage for role-based redirects
      localStorage.setItem('user', JSON.stringify(user));
      
      showSuccess(response.message);
      
      // Redirect based on role
      switch(user.role.toLowerCase()) {
        case 'student':
          window.location.href = '/student/dashboard.html';
          break;
        case 'teacher':
          window.location.href = '/teacher/dashboard.html';
          break;
        case 'admin':
          window.location.href = '/admin/dashboard.html';
          break;
        default:
          window.location.href = '/dashboard.html';
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    showError(`Login failed: ${error.message}`);
  }
}

// Handle register form submission
async function handleRegister(event) {
  event.preventDefault();
  
  // Get form values
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('registerEmail').value; // Fixed - was 'email'
  const phoneNumber = document.getElementById('phone').value; // Match backend field name
  const college = document.getElementById('registerCollege').value;
  const department = document.getElementById('registerDepartment').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  const genderElements = document.getElementsByName('gender');
  let gender = null;
  for (const element of genderElements) {
    if (element.checked) {
      gender = element.value;
      break;
    }
  }
  
  // Form validation
  if (!fullName || !email || !phoneNumber || !password || !confirmPassword || !gender || !college || !department) {
    showError('Please fill in all required fields');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }
  
  if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
    showError('Please enter a valid 10-digit phone number');
    return;
  }
  
  try {
    // Register user with all required fields for your backend API
    const userData = {
      fullName,
      email,
      password,
      phoneNumber,
      college,
      department,
      gender // Though not required by your backend, good to collect
    };
    
    // Call the register API
    const response = await registerUser(userData);
    
    if (response.success) {
      showSuccess(response.message);
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to appropriate dashboard based on role
      // Since new users might not have a role assigned yet, default to regular dashboard
      // or you can redirect to profile completion
      if (response.user.role) {
        switch(response.user.role.toLowerCase()) {
          case 'student':
            window.location.href = '/student/dashboard.html';
            break;
          case 'teacher':
            window.location.href = '/teacher/dashboard.html';
            break;
          case 'admin':
            window.location.href = '/admin/dashboard.html';
            break;
          default:
            window.location.href = '/dashboard.html';
        }
      } else {
        // If no role assigned yet, go to profile completion
        window.location.href = '/profile-completion.html';
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    showError(`Registration failed: ${error.message}`);
  }
}

// Check if user is already logged in
async function checkAuthentication() {
  try {
    const { isAuthenticated, user } = await isAuthenticated();
    
    if (isAuthenticated && user) {
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      if (user.role && user.role.toLowerCase() === 'student') {
        window.location.href = '/student/dashboard.html';
      } else if (user.role && user.role.toLowerCase() === 'teacher') {
        window.location.href = '/teacher/dashboard.html';
      } else if (user.role && user.role.toLowerCase() === 'admin') {
        window.location.href = '/admin/dashboard.html';
      } else {
        window.location.href = '/dashboard.html';
      }
    }
  } catch (error) {
    console.error('Authentication check error:', error);
  }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', checkAuthentication);

// Make functions globally available
window.toggleForm = toggleForm;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;