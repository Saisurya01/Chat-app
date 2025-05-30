// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdLtVdMgsWhiWkMxbcIUckDYClO1IDNbk",
  authDomain: "chat-application-41950.firebaseapp.com",
  databaseURL: "https://chat-application-41950-default-rtdb.firebaseio.com",
  projectId: "chat-application-41950",
  storageBucket: "chat-application-41950.firebasestorage.app",
  messagingSenderId: "886868643517",
  appId: "1:886868643517:web:bbcc82a14549580deab1d4",
  measurementId: "G-Q9MTRQ4KSR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');

// Handle Auth State
auth.onAuthStateChanged(user => {
  if (user) {
    loginContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    loadMessages();
  } else {
    loginContainer.classList.remove('hidden');
    chatContainer.classList.add('hidden');
    chatBox.innerHTML = '';
  }
});

// Login
document.getElementById('loginBtn').onclick = () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) return alert("Enter both fields.");
  auth.signInWithEmailAndPassword(email, password)
    .catch(e => alert("Login failed: " + e.message));
};

// Signup
document.getElementById('signupBtn').onclick = () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) return alert("Enter both fields.");
  auth.createUserWithEmailAndPassword(email, password)
    .catch(e => alert("Signup failed: " + e.message));
};

// Logout
document.getElementById('logoutBtn').onclick = () => {
  auth.signOut();
};

// Send message
document.getElementById('sendBtn').onclick = () => {
  const input = document.getElementById('message');
  const text = input.value.trim();
  if (!text) return;
  db.ref('messages').push({
    user: auth.currentUser.email,
    text: text,
    timestamp: Date.now()
  });
  input.value = '';
};

// Load messages
function loadMessages() {
  const messagesRef = db.ref('messages');
  messagesRef.off(); // Remove previous listeners

  messagesRef.on('child_added', snapshot => {
    const msg = snapshot.val();
    const div = document.createElement('div');
    div.textContent = `${msg.user}: ${msg.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
