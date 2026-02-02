window.addEventListener("scroll", () => {
    const nav = document.getElementById("mainNav");
    if (nav) {
        if (window.scrollY > 60) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const scheduleBtn = document.getElementById("scheduleBtn");
    const appointmentModalEl = document.getElementById('appointmentModal');
    const confirmationModalEl = document.getElementById('confirmationModal');
    const contactSuccessModalEl = document.getElementById('contactSuccessModal');

    const appointmentModal = appointmentModalEl ? new bootstrap.Modal(appointmentModalEl) : null;
    const confirmationModal = confirmationModalEl ? new bootstrap.Modal(confirmationModalEl) : null;
    const contactSuccessModal = contactSuccessModalEl ? new bootstrap.Modal(contactSuccessModalEl) : null;

    // Open appointment modal
    if (scheduleBtn && appointmentModal) {
        scheduleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            appointmentModal.show();
        });
    }

    // Handle appointment form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        const apptSubmit = appointmentForm.querySelector('[type="submit"]');
        appointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (apptSubmit) { apptSubmit.disabled = true; apptSubmit.dataset.orig = apptSubmit.innerHTML; apptSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...'; }
            const formData = new FormData(appointmentForm);

            fetch(appointmentForm.action, {
                method: "POST",
                body: formData
            })
            .then(response => response.json().catch(() => ({})))
            .then(data => {
                if (data && data.success) {
                    if (appointmentModal) appointmentModal.hide();
                    if (confirmationModal) confirmationModal.show();
                    appointmentForm.reset();
                } else {
                    alert(data.message || "Something went wrong. Please try again.");
                }
            })
            .catch(() => {
                alert("Server error. Please try again later.");
            })
            .finally(() => {
                if (apptSubmit) { apptSubmit.disabled = false; apptSubmit.innerHTML = apptSubmit.dataset.orig || 'Submit'; }
            });
        });
    }

    // Contact form handling
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const contactSubmit = contactForm.querySelector('[type="submit"]');
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (contactSubmit) { contactSubmit.disabled = true; contactSubmit.dataset.orig = contactSubmit.innerHTML; contactSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...'; }
            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: "POST",
                body: formData
            })
            .then(res => res.json().catch(() => ({})))
            .then(data => {
                if (data && data.success) {
                    if (contactSuccessModal) contactSuccessModal.show();
                    else alert('Message sent successfully.');
                    contactForm.reset();
                } else {
                    alert(data.message || "Submission failed. Please try again.");
                }
            })
            .catch(() => {
                alert("Server error. Please try again later.");
            })
            .finally(() => {
                if (contactSubmit) { contactSubmit.disabled = false; contactSubmit.innerHTML = contactSubmit.dataset.orig || 'Submit'; }
            });
        });
    }

    // Social sidebar toggle - mobile
    const socialToggle = document.getElementById('socialToggle');
    const socialSidebar = document.querySelector('.social-sidebar');
    if (socialToggle && socialSidebar) {
        socialToggle.addEventListener('click', (e) => { e.stopPropagation(); const open = socialSidebar.classList.toggle('open'); socialToggle.setAttribute('aria-expanded', open); socialSidebar.setAttribute('aria-hidden', !open); });
        // Close when clicking outside on small screens
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && socialSidebar.classList.contains('open')) {
                if (!socialSidebar.contains(e.target) && e.target !== socialToggle) {
                    socialSidebar.classList.remove('open');
                    socialToggle.setAttribute('aria-expanded','false');
                    socialSidebar.setAttribute('aria-hidden','true');
                }
            }
        });
        // Close after clicking any social link on mobile
        socialSidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                socialSidebar.classList.remove('open');
                socialToggle.setAttribute('aria-expanded','false');
                socialSidebar.setAttribute('aria-hidden','true');
            }
        }));
    }
});

// Smooth active nav link on scroll + back-to-top + counters + mobile CTA
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById('backToTop');
const mobileCta = document.getElementById('mobileCta');

function updateActiveNav(){
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
}

document.addEventListener('scroll', () => {
    updateActiveNav();
    // Show/hide back to top
    if (backToTop) {
        if (window.scrollY > 300) backToTop.classList.add('show');
        else backToTop.classList.remove('show');
    }

    // Navbar scrolled class
    const nav = document.getElementById('mainNav');
    if (nav) {
        if (window.scrollY > 60) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    }
});

// Smooth nav link scrolling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Back to top action
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Mobile CTA opens appointment modal
if (mobileCta) mobileCta.addEventListener('click', (e) => { e.preventDefault(); const appt = document.getElementById('appointmentModal'); if (appt) new bootstrap.Modal(appt).show(); });

// Counters
const counters = document.querySelectorAll('.counter');
if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                animateCounter(el, parseFloat(el.dataset.target || 0), 1400);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(c => counterObserver.observe(c));
}

function animateCounter(el, target, duration){
    const isFloat = (target % 1 !== 0);
    const start = 0;
    const range = target - start;
    const startTime = performance.now();
    function step(now){
        const progress = Math.min((now - startTime) / duration, 1);
        const value = start + range * progress;
        el.textContent = isFloat ? value.toFixed(1) : Math.floor(value);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
