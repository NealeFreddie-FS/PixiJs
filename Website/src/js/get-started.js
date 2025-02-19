// Toggle between Login and Signup forms
document.getElementById("show-signup").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
});

// Login Form Submission
document.getElementById("login").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  // Add your login logic here
  console.log("Login:", { email, password });
  alert("Login successful! Redirecting to your feed...");
  // Redirect to FYP page
  window.location.href = "fyp.html";
});

// Signup Form Submission
document.getElementById("signup").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  // Add your signup logic here
  console.log("Signup:", { username, email, password });
  alert("Signup successful! Redirecting to your feed...");
  // Redirect to FYP page
  window.location.href = "fyp.html";
});
