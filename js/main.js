// =============================================
// PLAN B HIDROIZOLACIJA - Main JavaScript
// =============================================

// =============================================
// MOBILE MENU
// =============================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
    });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
        if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
});

// =============================================
// HEADER SCROLL EFFECT
// =============================================
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =============================================
// TESTIMONIAL SLIDER
// =============================================
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    testimonials.forEach((t, i) => {
        t.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });

    if (testimonials[index]) {
        testimonials[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % testimonials.length;
    showSlide(currentSlide);
}

function startSlider() {
    if (testimonials.length > 1) {
        slideInterval = setInterval(nextSlide, 5000);
    }
}

function stopSlider() {
    clearInterval(slideInterval);
}

if (testimonials.length > 0) {
    showSlide(0);
    startSlider();
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopSlider();
        currentSlide = index;
        showSlide(currentSlide);
        startSlider();
    });
});

// =============================================
// GALLERY LIGHTBOX
// =============================================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <img src="${img.src}" alt="${img.alt || ''}">
            <span class="lightbox-close">&times;</span>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Click to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                closeLightbox(lightbox);
            }
        });

        // ESC key to close
        function escHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox(lightbox);
                document.removeEventListener('keydown', escHandler);
            }
        }
        document.addEventListener('keydown', escHandler);
    });
});

function closeLightbox(lightbox) {
    if (document.body.contains(lightbox)) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        }, 200);
    }
}

// =============================================
// CONTACT FORM - WHATSAPP REDIRECT
// =============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameInput = this.querySelector('#name');
        const phoneInput = this.querySelector('#phone');
        const emailInput = this.querySelector('#email');
        const serviceInput = this.querySelector('#service');
        const messageInput = this.querySelector('#message');

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const service = serviceInput ? serviceInput.value : '';
        const message = messageInput ? messageInput.value.trim() : '';

        // Validation
        if (!name || !phone || !message) {
            alert('Molimo popunite obavezna polja: Ime, Telefon i Poruka.');
            return;
        }

        // Phone number for WhatsApp (Plan B)
        const whatsappNumber = '38164613468';

        // Create message
        let whatsappMessage = `Poruka sa sajta Plan B Hidroizolacija:\n\n`;
        whatsappMessage += `Ime: ${name}\n`;
        whatsappMessage += `Telefon: ${phone}\n`;
        if (email) whatsappMessage += `Email: ${email}\n`;
        if (service) whatsappMessage += `Usluga: ${service}\n`;
        whatsappMessage += `\nPoruka:\n${message}`;

        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Open WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

        // Reset form
        this.reset();

        // Show success message
        showNotification('Hvala! WhatsApp se otvara sa vašom porukom.');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #059669;
        color: white;
        padding: 16px 32px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideUp 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// =============================================
// SCROLL ANIMATIONS
// =============================================
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// =============================================
// CURRENT YEAR IN FOOTER
// =============================================
const yearSpan = document.querySelector('.current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// =============================================
// ACTIVE NAV LINK
// =============================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// =============================================
// LAZY LOAD IMAGES
// =============================================
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '100px'
});

lazyImages.forEach(img => imageObserver.observe(img));

// =============================================
// PHONE NUMBER CLICK TRACKING (optional)
// =============================================
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track phone call clicks (for analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'Phone Call'
            });
        }
    });
});

// =============================================
// SERVICE CARD HOVER EFFECT
// =============================================
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// =============================================
// CONSOLE MESSAGE
// =============================================
console.log('%cPlan B Hidroizolacija', 'color: #059669; font-size: 24px; font-weight: bold;');
console.log('%cSuv dom bez brige o prokisnjavanju', 'color: #6B7280; font-size: 14px;');
console.log('%cKontakt: +381 64 613 7468', 'color: #059669; font-size: 12px;');
