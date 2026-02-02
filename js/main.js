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
        appointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
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
            });
        });
    }

    // Contact form handling
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
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
            });
        });
    }
});

// Smooth active nav link on scroll
document.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

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
});
