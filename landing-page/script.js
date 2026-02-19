document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect and active link highlighting
    const sections = document.querySelectorAll('section');
    const nav_links = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.9)';
            nav.style.boxShadow = 'none';
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        nav_links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card-detailed, .pricing-card, .testimonial, .step, .faq-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Spark Animation
    const sparkAnimation = document.querySelector('.spark-animation');
    if (sparkAnimation) {
        for (let i = 0; i < 100; i++) {
            const spark = document.createElement('div');
            spark.classList.add('spark');
            spark.style.top = `${Math.random() * 100}%`;
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.animationDelay = `${Math.random() * 2}s`;
            sparkAnimation.appendChild(spark);
        }
    }

    // Scroll to top button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
});

// Hero Form Submission
document.getElementById('heroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    if (!email) {
        alert('Please enter your email');
        return;
    }
    
    const params = new URLSearchParams({
        email: email,
        source: 'landing',
        plan: 'scale'
    });
    
    window.location.href = `https://app.brandspark.com/register?${params}`;
});

// Pricing Plan Selection
function startTrial(plan = 'scale') {
    const email = document.getElementById('email')?.value || '';
    
    const params = new URLSearchParams({
        plan: plan,
        source: 'landing'
    });
    
    if (email) params.append('email', email);
    
    window.location.href = `https://app.brandspark.com/register?${params}`;
}

// Simple analytics tracking
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // Replace with your actual analytics provider (e.g., GA, Mixpanel)
}

// Track form submissions
document.getElementById('heroForm').addEventListener('submit', function() {
    trackEvent('Landing Page Form Submit', {
        form_location: 'hero',
        email: document.getElementById('email').value
    });
});

// Track pricing plan clicks
document.querySelectorAll('.pricing-cta').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.pricing-card');
        const planName = card.querySelector('.pricing-title').textContent.toLowerCase();
        
        trackEvent('Pricing Plan Selected', {
            plan: planName,
            location: 'pricing_section'
        });
    });
});

// Page view tracking
trackEvent('Landing Page View');