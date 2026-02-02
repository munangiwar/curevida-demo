window.addEventListener("scroll", () => {
    const nav = document.getElementById("mainNav");
    if (window.scrollY > 60) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const scheduleBtn = document.getElementById("scheduleBtn");
    const appointmentModalEl = document.getElementById('appointmentModal');
    const confirmationModalEl = document.getElementById('confirmationModal');

    const appointmentModal = new bootstrap.Modal(appointmentModalEl);
    const confirmationModal = new bootstrap.Modal(confirmationModalEl);

    // Open appointment modal
    scheduleBtn.addEventListener("click", (e) => {
        e.preventDefault(); // stop default link navigation
        appointmentModal.show();
    });

    // Handle form submission
    const form = document.getElementById('appointmentForm');
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Close form modal and open confirmation modal
        appointmentModal.hide();
        confirmationModal.show();

        // Reset the form
        form.reset();
    });
});

document.getElementById("appointmentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = this;
  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById("appointmentModal").style.display = "none";
        document.getElementById("confirmationModal").style.display = "flex";
        form.reset();
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    })
    .catch(() => {
      alert("Server error. Please try again later.");
    });
});

/* Close confirmation modal */
document.getElementById("closeConfirmationModal").addEventListener("click", () => {
  document.getElementById("confirmationModal").style.display = "none";
});


const contactForm = document.getElementById("contactForm");
const successModal = document.getElementById("contactSuccessModal");
const closeSuccessModal = document.getElementById("closeContactSuccessModal");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(contactForm);

  fetch(contactForm.action, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        successModal.style.display = "flex";
        contactForm.reset();
      } else {
        alert(data.message || "Submission failed. Please try again.");
      }
    })
    .catch(() => {
      alert("Server error. Please try again later.");
    });
});

closeSuccessModal.addEventListener("click", () => {
  successModal.style.display = "none";
});