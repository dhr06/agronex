// ================================
// AgroNex Demo Login Script
// ================================

// Demo Email & Password
// ================================
// AgroNex Production Script
// ================================

// Password Toggle Only


if (togglePassword) {
  const passwordInput = document.getElementById("password");
  const eyeOpen = document.querySelector(".eye-open");
  const eyeClosed = document.querySelector(".eye-closed");

  togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      if (eyeOpen) eyeOpen.style.display = "none";
      if (eyeClosed) eyeClosed.style.display = "block";
    } else {
      passwordInput.type = "password";
      if (eyeOpen) eyeOpen.style.display = "block";
      if (eyeClosed) eyeClosed.style.display = "none";
    }
  });
}
// Form Elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailGroup = document.getElementById("emailGroup");
const passwordGroup = document.getElementById("passwordGroup");

const submitBtn = document.getElementById("submitBtn");

// Password Toggle Button
const togglePassword = document.getElementById("togglePassword");
const eyeOpen = document.querySelector(".eye-open");
const eyeClosed = document.querySelector(".eye-closed");

// ================================
// Show Error Function
// ================================
function showError(group, message) {
  const errorSpan = group.querySelector(".error-message");
  errorSpan.textContent = message;
  group.classList.add("error");
}

// ================================
// Clear Error Function
// ================================
function clearError(group) {
  const errorSpan = group.querySelector(".error-message");
  errorSpan.textContent = "";
  group.classList.remove("error");
}

// ================================
// Toggle Password Visibility
// ================================
togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeOpen.style.display = "none";
    eyeClosed.style.display = "block";
  } else {
    passwordInput.type = "password";
    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";
  }
});

// ================================
// Form Submit Event
// ================================
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Clear previous errors
  clearError(emailGroup);
  clearError(passwordGroup);

  let valid = true;

  // Input Values
  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  // Email Validation
  if (emailValue === "") {
    showError(emailGroup, "Email is required.");
    valid = false;
  }

  // Password Validation
  if (passwordValue === "") {
    showError(passwordGroup, "Password is required.");
    valid = false;
  }

  if (!valid) return;

  // Button Loading Animation
  submitBtn.classList.add("loading");

  setTimeout(() => {
    submitBtn.classList.remove("loading");

    // ================================
    // Demo Login Check
    // ================================
    if (emailValue === demoEmail && passwordValue === demoPassword) {
      alert("✅ Login Successful! Redirecting to Dashboard...");

      // ✅ Redirect to Dashboard Page
      window.location.href = "dashboard";
    } else {
      alert("❌ Invalid Email or Password!");

      showError(emailGroup, "Use admin@agronex.com");
      showError(passwordGroup, "Use password: 4jana");
    }
  }, 1500);
});

// ================================
// Auto Fill Demo Credentials (Optional)
// ================================
window.addEventListener("load", () => {
  emailInput.value = demoEmail;
  passwordInput.value = demoPassword;
});  