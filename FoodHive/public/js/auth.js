// Utility Functions
const showAlert = (message, type = 'info') => {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    alertContainer.innerHTML = alertHTML;

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }
    }, 5000);
};

const getAlertIcon = (type) => {
    const icons = {
        success: 'check-circle',
        danger: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
};

const showLoading = (show = true) => {
    const spinner = document.getElementById('loginSpinner') || document.getElementById('registerSpinner');
    const btn = document.getElementById('loginBtn') || document.getElementById('registerBtn');
    
    if (spinner && btn) {
        if (show) {
            spinner.classList.remove('d-none');
            btn.disabled = true;
            btn.style.opacity = '0.7';
        } else {
            spinner.classList.add('d-none');
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const validateName = (name) => {
    return name.trim().length >= 2;
};

// Form Validation
const validateForm = (formData, isLogin = false) => {
    const errors = [];

    if (!isLogin && !validateName(formData.nama)) {
        errors.push('Nama harus minimal 2 karakter');
    }

    if (!validateEmail(formData.email)) {
        errors.push('Email tidak valid');
    }

    if (!validatePassword(formData.password)) {
        errors.push('Password harus minimal 6 karakter');
    }

    return errors;
};

// Real-time form validation
const setupRealTimeValidation = () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const namaInput = document.getElementById('nama');

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            validateField(emailInput, validateEmail(emailInput.value), 'Email tidak valid');
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('blur', () => {
            validateField(passwordInput, validatePassword(passwordInput.value), 'Password minimal 6 karakter');
        });
    }

    if (namaInput) {
        namaInput.addEventListener('blur', () => {
            validateField(namaInput, validateName(namaInput.value), 'Nama minimal 2 karakter');
        });
    }
};

const validateField = (field, isValid, errorMessage) => {
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        if (feedback) feedback.remove();
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        
        if (!feedback) {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'invalid-feedback';
            feedbackDiv.textContent = errorMessage;
            field.parentNode.appendChild(feedbackDiv);
        }
    }
};

// Local Storage Functions
const saveUserData = (userData) => {
    const users = getUsersFromStorage();
    users.push({
        id: Date.now(),
        nama: userData.nama,
        email: userData.email,
        password: userData.password, // In real app, this should be hashed
        createdAt: new Date().toISOString()
    });
    
    try {
        localStorage.setItem('foodhive_users', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error saving user data:', error);
        return false;
    }
};

const getUsersFromStorage = () => {
    try {
        const users = localStorage.getItem('foodhive_users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error getting users from storage:', error);
        return [];
    }
};

const authenticateUser = (email, password) => {
    const users = getUsersFromStorage();
    return users.find(user => user.email === email && user.password === password);
};

const saveCurrentUser = (user) => {
    try {
        const userSession = {
            id: user.id,
            nama: user.nama,
            email: user.email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('foodhive_current_user', JSON.stringify(userSession));
        return true;
    } catch (error) {
        console.error('Error saving current user:', error);
        return false;
    }
};

const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('foodhive_current_user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

const logoutUser = () => {
    try {
        localStorage.removeItem('foodhive_current_user');
        return true;
    } catch (error) {
        console.error('Error logging out:', error);
        return false;
    }
};

// Registration Handler
const handleRegistration = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        nama: formData.get('nama'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Validate form
    const errors = validateForm(userData, false);
    if (errors.length > 0) {
        showAlert(errors.join('<br>'), 'danger');
        return;
    }

    // Check if user already exists
    const existingUsers = getUsersFromStorage();
    if (existingUsers.find(user => user.email === userData.email)) {
        showAlert('Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.', 'warning');
        return;
    }

    showLoading(true);

    // Simulate API call delay
    setTimeout(() => {
        const success = saveUserData(userData);
        
        showLoading(false);
        
        if (success) {
            showAlert(`Selamat datang, ${userData.nama}! Akun Anda berhasil dibuat.`, 'success');
            
            // Auto login after registration
            const user = authenticateUser(userData.email, userData.password);
            if (user) {
                saveCurrentUser(user);
                
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            }
        } else {
            showAlert('Terjadi kesalahan saat membuat akun. Silakan coba lagi.', 'danger');
        }
    }, 1500);
};

// Login Handler
const handleLogin = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Validate form
    const errors = validateForm(loginData, true);
    if (errors.length > 0) {
        showAlert(errors.join('<br>'), 'danger');
        return;
    }

    showLoading(true);

    // Simulate API call delay
    setTimeout(() => {
        const user = authenticateUser(loginData.email, loginData.password);
        
        showLoading(false);
        
        if (user) {
            saveCurrentUser(user);
            showAlert(`Selamat datang kembali, ${user.nama}!`, 'success');
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            showAlert('Email atau password salah. Silakan coba lagi.', 'danger');
        }
    }, 1500);
};

// Password Toggle
document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  togglePassword.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    // Ganti ikon mata
    if (isPassword) {
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash");
    } else {
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    }
  });
});

// Initialize Authentication
const initAuth = () => {
    // Setup password toggle
    setupPasswordToggle();
    
    // Setup real-time validation
    setupRealTimeValidation();
    
    // Setup form handlers
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Add smooth animations
    const authForm = document.querySelector('.auth-form');
    const brandSection = document.querySelector('.brand-section');
    
    if (authForm) {
        authForm.classList.add('slide-in-right');
    }
    
    if (brandSection) {
        brandSection.classList.add('slide-in-left');
    }
};

// Check Authentication Status
const checkAuthStatus = () => {
    const currentUser = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    
    if (currentUser && loginBtn) {
        loginBtn.innerHTML = `
            <i class="fas fa-user-circle me-2"></i>
            ${currentUser.nama}
        `;
        loginBtn.href = '#';
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                logoutUser();
                window.location.reload();
            }
        };
    }
};

// Demo Data Setup (for development)
const setupDemoData = () => {
    const users = getUsersFromStorage();
    
    if (users.length === 0) {
        const demoUsers = [
            {
                id: 1,
                nama: 'Demo User',
                email: 'demo@foodhive.com',
                password: 'demo123',
                createdAt: new Date().toISOString()
            }
        ];
        
        try {
            localStorage.setItem('foodhive_users', JSON.stringify(demoUsers));
        } catch (error) {
            console.error('Error setting up demo data:', error);
        }
    }
};

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    checkAuthStatus();
    setupDemoData();
    
    // Add some interactive effects
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentNode.style.transform = 'scale(1.02)';
            input.parentNode.style.transition = 'all 0.3s ease';
        });
        
        input.addEventListener('blur', () => {
            input.parentNode.style.transform = 'scale(1)';
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
});