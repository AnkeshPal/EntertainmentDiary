// Make sure firebase is initialized with firebase-config.js

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ✅ Check if admin is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    alert("Not authorized. Please login.");
    window.location.href = "login.html";
  }
});

// 🆙 Upload logic
document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const link = document.getElementById("link").value.trim();
  const description = document.getElementById("description").value.trim();
  const thumbnailFile = document.getElementById("thumbnail").files[0];
  const statusEl = document.getElementById("uploadStatus");

  if (!thumbnailFile) {
    statusEl.textContent = "Thumbnail file is required!";
    return;
  }

  statusEl.textContent = "Uploading thumbnail...";

  try {
    // Upload thumbnail to Firebase Storage
    const storageRef = storage.ref(`thumbnails/${Date.now()}_${thumbnailFile.name}`);
    const snapshot = await storageRef.put(thumbnailFile);
    const thumbnailURL = await snapshot.ref.getDownloadURL();

    statusEl.textContent = "Saving data to Firestore...";

    // Save data to Firestore
    await db.collection("contents").add({
      title,
      link,
      description,
      thumbnailURL,
      uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    statusEl.textContent = `✅ "${title}" uploaded successfully!`;
    document.getElementById("uploadForm").reset();

  } catch (err) {
    console.error("Upload failed", err);
    statusEl.textContent = "❌ Upload failed. Check console for errors.";
  }
});
