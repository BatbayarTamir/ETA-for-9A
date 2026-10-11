// Initialize Supabase Client
const SUPABASE_URL = 'https://khgovytgemenmbhukyoy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WJ1VV4zF9oMdjbzc4YxgdA_X6AD0lql';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userDisplay = document.getElementById('user-display');

// Check active session on load
async function checkUser() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    showApp(session.user);
  } else {
    showAuth();
  }
}

function showApp(user) {
  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  userDisplay.textContent = `Logged in as: ${user.email}`;
}

function showAuth() {
  authSection.classList.remove('hidden');
  appSection.classList.add('hidden');
}

// Handle Sign Up
document.getElementById('signup-btn').addEventListener('click', async () => {
  const { error } = await supabaseClient.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value,
  });
  if (error) alert('Sign up error: ' + error.message);
  else alert('Check your email for confirmation (or log in directly if email confirmation is disabled).');
});

// Handle Login
document.getElementById('login-btn').addEventListener('click', async () => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });
  if (error) alert('Login error: ' + error.message);
  else showApp(data.user);
});

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  showAuth();
});

// Handle Form Submission
document.getElementById('submit-btn').addEventListener('click', async () => {
  let arrivalTime = document.getElementById('arrivalTime').value;
  const wornUniform = document.getElementById('wornUniform').checked;
  const lessonAutonomy = parseInt(document.getElementById('lessonAutonomy').value);
  const participation = parseInt(document.getElementById('participation').value);
  const projectWork = document.getElementById('projectWork').value;

  if (!arrivalTime) {
    alert('Please enter your arrival time.');
    return;
  }

  arrivalTime = new Date(arrivalTime).toISOString();

  const { error } = await supabaseClient
    .from('daily_submissions')
    .insert([
      {
        arrival_time: arrivalTime,
        worn_uniform: wornUniform,
        lesson_autonomy: lessonAutonomy,
        participation: participation,
        project_work: projectWork
      }
    ]);

  if (error) {
    alert('Submission failed: ' + error.message);
  } else {
    alert('Record submitted successfully!');
    // Clear project notes field after success
    document.getElementById('projectWork').value = '';
  }
});

// Run session check on page startup
checkUser();
