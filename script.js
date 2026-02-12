// Scroll Progress Bar
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// Initialize page animations on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure styles are painted
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initPageAnimations();
        });
    });
});

// Initialize page animations
function initPageAnimations() {
    // Animate navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        setTimeout(() => navbar.classList.add('loaded'), 100);
    }

    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('animate');
            const aboutImageContainer = document.querySelector('.about-image-container');
            if (aboutImageContainer) {
                setTimeout(() => aboutImageContainer.classList.add('animate'), 300);
            }
        }, 200);
    }

    // Set up scroll-triggered reveal animations
    initRevealAnimations();

    // Set up section title animations
    initSectionTitleAnimations();

    // Set up navbar scroll effect
    initNavbarScroll();

    // Set up project card tilt effect
    initCardTilt();
}

// Direction-aware reveal animations using Intersection Observer
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply stagger delay based on sibling index
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('[data-reveal]');
                let index = 0;
                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) index = i;
                });

                const delay = index * 80;
                entry.target.style.transitionDelay = delay + 'ms';
                entry.target.classList.add('revealed');

                // Clean up delay after animation completes
                setTimeout(() => {
                    entry.target.style.transitionDelay = '0ms';
                }, delay + 700);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Section title underline animation
function initSectionTitleAnimations() {
    const titles = document.querySelectorAll('.section-title');

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                titleObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    titles.forEach(title => titleObserver.observe(title));
}

// Smooth navbar background transition on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.pageYOffset > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Subtle 3D tilt effect on project cards
function initCardTilt() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link based on scroll position
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id') || 'about';
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` ||
            (current === '' && link.getAttribute('href') === '#about')) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// Profile Image Loading
const profileImage = document.getElementById('profileImage');
const imagePlaceholder = document.getElementById('imagePlaceholder');

if (profileImage && imagePlaceholder) {
    profileImage.onload = function () {
        profileImage.classList.add('loaded');
        imagePlaceholder.classList.add('hidden');
    };

    profileImage.onerror = function () {
        profileImage.classList.remove('loaded');
        imagePlaceholder.classList.remove('hidden');
    };

    const img = new Image();
    img.onload = function () {
        profileImage.classList.add('loaded');
        imagePlaceholder.classList.add('hidden');
    };
    img.onerror = function () {
        profileImage.classList.remove('loaded');
        imagePlaceholder.classList.remove('hidden');
    };
    img.src = profileImage.src;
}
