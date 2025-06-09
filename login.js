// Make sure firebase is initialized in firebase-config.js

const auth = firebase.auth();

const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await auth.signInWithEmailAndPassword(email, password);
    // Login success — redirect to upload page
    window.location.href = "upload.html";
  } catch (error) {
    // Show error message
    errorMsg.textContent = error.message;
  }
});
