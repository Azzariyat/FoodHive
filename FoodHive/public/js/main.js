// Smooth scrolling for navigation links
const initSmoothScrolling = () => {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Navbar scroll effect
const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }
};

// Intersection Observer for animations
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe cards
    const cards = document.querySelectorAll('.donation-card, .partner-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
};

// Counter animation for statistics
const initCounterAnimation = () => {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
};

// Mobile menu toggle
const initMobileMenu = () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
};

// Form validation helper
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'Field ini harus diisi');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
};

const showFieldError = (field, message) => {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
};

const clearFieldError = (field) => {
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
};

// Show toast notification
const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
};

const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
};

// Check authentication status
const checkAuthStatus = () => {
    const user = JSON.parse(localStorage.getItem('foodhive_current_user'));
    const loginBtn = document.getElementById('loginBtn');

    if (user && loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user-circle me-2"></i>${user.nama}`;
        loginBtn.href = '#';
        
        const logoutBtn = document.createElement('a');
        logoutBtn.className = 'btn btn-outline-danger rounded-pill px-4 ms-2';
        logoutBtn.textContent = 'Logout';
        logoutBtn.href = '#';
        logoutBtn.addEventListener('click', logout);

        loginBtn.parentNode.appendChild(logoutBtn);
    }
};

// Logout function
const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('foodhive_current_user');
    showToast('Berhasil logout', 'info');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
};

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initNavbarScroll();
    initScrollAnimations();
    initCounterAnimation();
    initMobileMenu();
    checkAuthStatus();
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    const swiper = new Swiper('.donation-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
                centeredSlides: false,
            },
            1024: {
                slidesPerView: 2.5,
                spaceBetween: 40,
                centeredSlides: true,
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 40,
                centeredSlides: true,
            }
        },
        effect: 'slide',
        speed: 600,
        grabCursor: true,
    });

    // Custom button navigation
    const prevBtn = document.querySelector('.custom-prev-btn');
    const nextBtn = document.querySelector('.custom-next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            swiper.slidePrev();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            swiper.slideNext();
        });
    }

    // Smooth scrolling for scrollable images
    const scrollableImages = document.querySelector('.scrollable-images');
    if (scrollableImages) {
        let isScrolling = false;
        
        scrollableImages.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            if (!isScrolling) {
                isScrolling = true;
                
                const scrollAmount = e.deltaY > 0 ? 150 : -150;
                
                scrollableImages.scrollTo({
                    top: scrollableImages.scrollTop + scrollAmount,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    isScrolling = false;
                }, 150);
            }
        });
        
        // Auto scroll animation
        let autoScrollDirection = 1;
        let autoScrollPaused = false;
        
        function autoScroll() {
            if (!autoScrollPaused) {
                const maxScroll = scrollableImages.scrollHeight - scrollableImages.clientHeight;
                const currentScroll = scrollableImages.scrollTop;
                
                if (currentScroll >= maxScroll - 5) {
                    autoScrollDirection = -1;
                } else if (currentScroll <= 5) {
                    autoScrollDirection = 1;
                }
                
                scrollableImages.scrollTop += autoScrollDirection * 0.5;
            }
        }
        
        // Pause auto scroll on hover
        scrollableImages.addEventListener('mouseenter', () => {
            autoScrollPaused = true;
        });
        
        scrollableImages.addEventListener('mouseleave', () => {
            autoScrollPaused = false;
        });
        
        // Start auto scroll
        setInterval(autoScroll, 50);
    }

    // Add hover effects to donation cards
    const donasiCards = document.querySelectorAll('.donasi-card');
    donasiCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('section');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleAnimation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);