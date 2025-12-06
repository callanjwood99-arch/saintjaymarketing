/**
 * Saint Jay Marketing - Premium Interactive Features
 * Smooth animations, polished interactions, professional feel
 */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initScrollReveal();
    initHeroTitleReveal();
    initCountUpAnimations();
    initFAQ();
    initSmoothScroll();
    initParallax();
    initButtonEffects();
    initCardTilt();
    initChartAnimation();
    initVisualCardsAnimation();
    updateYear();
});

/**
 * Preloader - Smooth page reveal
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    document.body.classList.add('loading');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
            
            // Trigger hero animations immediately
            const heroElements = document.querySelectorAll('.hero .reveal');
            heroElements.forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, i * 50);
            });
        }, 900);
    });
}

/**
 * Navigation - Scroll effects and mobile menu
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!nav) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    // Scroll behavior
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Mobile menu
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Scroll Reveal - Intersection Observer animations (repeatable)
 */
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use CSS transition-delay from data-delay attribute
                entry.target.classList.add('visible');
            } else {
                // Remove visible class when out of view to replay animation
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements (except hero which is handled by preloader)
    const revealElements = document.querySelectorAll(
        '.reveal-fade, .reveal-scale, .reveal-slide-up, .reveal-slide-right'
    );
    
    revealElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Hero Title Reveal (repeatable)
 */
function initHeroTitleReveal() {
    const heroTitle = document.querySelector('.hero-title');
    
    if (!heroTitle) return;
    
    // Small delay for initial load to sync with preloader
    let initialLoad = true;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = initialLoad ? 1000 : 50;
                initialLoad = false;
                
                setTimeout(() => {
                    heroTitle.classList.add('animated');
                }, delay);
            } else {
                heroTitle.classList.remove('animated');
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(heroTitle);
}

/**
 * Problems Chart Animation (repeatable)
 */
function initVisualCardsAnimation() {
    const problemBars = document.querySelectorAll('.problem-bar');
    const statValues = document.querySelectorAll('.problems-chart .stat-value');
    
    if (!problemBars.length && !statValues.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate bars
                problemBars.forEach((barContainer, i) => {
                    const barFill = barContainer.querySelector('.bar-fill');
                    const height = barContainer.style.getPropertyValue('--height') || '50%';
                    
                    barFill.style.transition = 'none';
                    barFill.style.height = '0';
                    
                    setTimeout(() => {
                        barFill.style.transition = 'height 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                        barFill.style.height = height;
                    }, i * 50);
                });
                
                // Animate numbers after bars start
                statValues.forEach((statEl, i) => {
                    animateNumber(statEl, 200 + i * 100);
                });
            } else {
                // Reset bars
                problemBars.forEach(barContainer => {
                    const barFill = barContainer.querySelector('.bar-fill');
                    barFill.style.transition = 'none';
                    barFill.style.height = '0';
                });
                
                // Reset numbers
                statValues.forEach(statEl => {
                    const prefix = statEl.dataset.prefix || '';
                    const suffix = statEl.dataset.suffix || '';
                    statEl.textContent = prefix + '0' + suffix;
                });
            }
        });
    }, { threshold: 0.3 });
    
    const problemsChart = document.querySelector('.problems-chart');
    if (problemsChart) {
        observer.observe(problemsChart);
    }
}

/**
 * Animate number counting - using requestAnimationFrame
 */
function animateNumber(element, delay = 0) {
    const target = parseFloat(element.dataset.target);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 1000;
    
    setTimeout(() => {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            let displayValue;
            if (target < 0) {
                displayValue = Math.abs(Math.round(target * easeProgress));
                element.textContent = prefix + '-' + displayValue + suffix;
            } else {
                displayValue = Math.round(target * easeProgress);
                element.textContent = prefix + displayValue + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (target < 0) {
                    element.textContent = prefix + '-' + Math.abs(target) + suffix;
                } else {
                    element.textContent = prefix + target + suffix;
                }
            }
        }
        
        requestAnimationFrame(update);
    }, delay);
}

/**
 * Count Up Animations (repeatable)
 */
function initCountUpAnimations() {
    const countElements = document.querySelectorAll('.count-up');
    
    if (!countElements.length) return;
    
    // Track initial page load
    let initialLoad = true;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay on initial page load to sync with preloader
                const baseDelay = initialLoad ? 1200 : 0;
                initialLoad = false;
                
                const elements = entry.target.querySelectorAll('.count-up');
                elements.forEach((el, i) => {
                    animateCountUp(el, baseDelay + i * 100);
                });
            } else {
                // Reset when out of view
                const elements = entry.target.querySelectorAll('.count-up');
                elements.forEach(el => {
                    const prefix = el.dataset.prefix || '';
                    const suffix = el.dataset.suffix || '';
                    el.textContent = prefix + '0' + suffix;
                });
            }
        });
    }, { threshold: 0.3 });
    
    // Observe the hero stats container
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

/**
 * Animate count up effect - using requestAnimationFrame for smoothness
 */
function animateCountUp(element, delay = 0) {
    const target = parseFloat(element.dataset.target);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 1200;
    
    // Reset first
    element.textContent = prefix + '0' + suffix;
    
    setTimeout(() => {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic for smooth deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(target * easeProgress);
            
            element.textContent = prefix + currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = prefix + target + suffix;
            }
        }
        
        requestAnimationFrame(update);
    }, delay);
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
            
            // Toggle current
            item.classList.toggle('active');
            
            // ARIA
            question.setAttribute('aria-expanded', !isActive);
        });
        
        // Keyboard accessibility
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = document.getElementById('nav')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax Effects
 */
function initParallax() {
    const orbs = document.querySelectorAll('.hero-orb');
    const ctaOrb = document.querySelector('.cta-orb');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                
                // Hero orbs
                orbs.forEach((orb, i) => {
                    const speed = (i + 1) * 0.1;
                    orb.style.transform = `translate(${Math.sin(scrollY * 0.001) * 20}px, ${scrollY * speed}px)`;
                });
                
                // CTA orb
                if (ctaOrb) {
                    const rect = ctaOrb.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        ctaOrb.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.05}px))`;
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Button Ripple Effects - Simplified
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 500);
        });
    });
}

/**
 * Card Tilt Effect - Smoother with RAF
 */
function initCardTilt() {
    const cards = document.querySelectorAll('.result-card, .audience-card, .solution-feature');
    
    cards.forEach(card => {
        let rafId = null;
        let targetRotateX = 0;
        let targetRotateY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;
        
        card.style.transition = 'box-shadow 0.2s ease, border-color 0.2s ease';
        card.style.willChange = 'transform';
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            targetRotateX = (y - centerY) / 30;
            targetRotateY = (centerX - x) / 30;
            
            if (!rafId) {
                rafId = requestAnimationFrame(animate);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            targetRotateX = 0;
            targetRotateY = 0;
            
            if (!rafId) {
                rafId = requestAnimationFrame(animate);
            }
        });
        
        function animate() {
            currentRotateX += (targetRotateX - currentRotateX) * 0.15;
            currentRotateY += (targetRotateY - currentRotateY) * 0.15;
            
            const translateY = Math.abs(targetRotateX) > 0.1 || Math.abs(targetRotateY) > 0.1 ? -4 : 0;
            
            card.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateY(${translateY}px) translateZ(0)`;
            
            if (Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
                rafId = requestAnimationFrame(animate);
            } else {
                rafId = null;
                if (targetRotateX === 0 && targetRotateY === 0) {
                    card.style.transform = '';
                }
            }
        }
    });
}

/**
 * Chart Animation (repeatable)
 */
function initChartAnimation() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    if (!chartBars.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate in
                chartBars.forEach((bar, i) => {
                    bar.style.transition = 'none';
                    bar.style.height = '0';
                    
                    setTimeout(() => {
                        bar.style.transition = 'height 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                        bar.style.height = bar.style.getPropertyValue('--height');
                    }, i * 60);
                });
            } else {
                // Reset when out of view
                chartBars.forEach(bar => {
                    bar.style.transition = 'none';
                    bar.style.height = '0';
                });
            }
        });
    }, { threshold: 0.3 });
    
    const dashboard = document.querySelector('.dashboard-chart');
    if (dashboard) {
        observer.observe(dashboard);
    }
}

/**
 * Update Year
 */
function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/**
 * Intersection Observer for general elements
 */
function observeElements(selector, callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...options
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, defaultOptions);
    
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

/**
 * Throttle utility
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce utility
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Handle resize
window.addEventListener('resize', debounce(() => {
    // Reset any transforms on resize
    document.querySelectorAll('.result-card, .audience-card, .solution-feature').forEach(card => {
        card.style.transform = '';
    });
}, 250));

// Prevent FOUC
document.documentElement.style.visibility = 'visible';
