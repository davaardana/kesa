// ============================================
// PT. Kharisma Elsyadai Sukses Abadi
// Main JavaScript File
// ============================================

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// Scroll to top button
const scrollTopBtn = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
});
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Fade-in animation with Intersection Observer
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
fadeEls.forEach(el => observer.observe(el));

// Counter animation
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
}
const counters = document.querySelectorAll('.count[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// Contact form - send via Formspree (email) + WhatsApp
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = this.querySelector('.btn-submit');
        const statusEl = this.querySelector('.form-status');
        const name = this.querySelector('[name="name"]').value;
        const email = this.querySelector('[name="email"]').value;
        const phone = this.querySelector('[name="phone"]').value;
        const message = this.querySelector('[name="message"]').value;
        const formAction = this.getAttribute('action');

        // Show loading state
        btn.textContent = 'Sending...';
        btn.disabled = true;
        if (statusEl) { statusEl.className = 'form-status'; statusEl.textContent = ''; }

        // If Formspree action is configured, send via email
        if (formAction && formAction.includes('formspree.io')) {
            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, message })
                });
                const data = await response.json();
                if (response.ok) {
                    if (statusEl) {
                        statusEl.className = 'form-status success';
                        statusEl.textContent = 'Message sent successfully! We will contact you soon.';
                    }
                    this.reset();
                } else {
                    throw new Error(data.errors ? data.errors.map(e => e.message).join(', ') : 'Failed to send');
                }
            } catch (err) {
                if (statusEl) {
                    statusEl.className = 'form-status error';
                    statusEl.textContent = 'Failed to send email. Redirecting to WhatsApp...';
                }
                setTimeout(() => sendWhatsApp(name, email, phone, message), 1500);
            }
        } else {
            // No Formspree configured — fallback to WhatsApp
            sendWhatsApp(name, email, phone, message);
        }

        btn.textContent = 'Send Message';
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled = false;
    });
}

function sendWhatsApp(name, email, phone, message) {
    const waNumber = '6283808925282';
    const waText = encodeURIComponent(`Hello, my name is ${name} (${email}, ${phone}).\n\n${message}`);
    window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
}

// Close mobile menu when clicking a link
navItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
    });
});

// Lazy load images
document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
