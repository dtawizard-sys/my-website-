document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileMenuBtn.querySelector('i');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            menuIcon.classList.replace('bx-menu', 'bx-x');
            document.body.style.overflow = 'hidden';
        } else {
            menuIcon.classList.replace('bx-x', 'bx-menu');
            document.body.style.overflow = '';
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Intersection Observer for Fade-up Animations
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Accordion Logic for Lead Gen Section
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            
            // Close other active items
            const activeItem = document.querySelector('.accordion-item.active');
            if (activeItem && activeItem !== currentItem) {
                activeItem.classList.remove('active');
            }
            
            // Toggle current item
            currentItem.classList.toggle('active');
        });
    });

    // Animate Dashboard Bars slightly on load
    const bars = document.querySelectorAll('.bar');
    setTimeout(() => {
        bars.forEach(bar => {
            const currentHeight = bar.style.height;
            bar.style.height = '0%';
            setTimeout(() => {
                bar.style.height = currentHeight;
            }, 100);
        });
    }, 500);
});
