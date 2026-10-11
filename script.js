const supabaseUrl = 'https://khgovytgemenmbhukyoy.supabase.co';
const supabaseAnonKey = 'sb_publishable_WJ1VV4zF9oMdjbzc4YxgdA_X6AD0lql';

const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Predefined Team Members
const teamMemberList = [
  'Bat-Orgil', 'Bolor', 'Bolormaa', 'Gerelt-Od', 'Indra',
  'Inkhbayar', 'Mandakhnar', 'Munkhtugs', 'Naranbadral',
  'Odbilig', 'Orgil', 'Tamir', 'Tuguldur', 'Khuselbayar',
  'Chinbilig', 'Ezlen', 'Erdenetugs', 'Selenge'
];

// DOM Element References (All camelCase)
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const adminSection = document.getElementById('adminSection');
const leaderboardSection = document.getElementById('leaderboardSection');
const userGrid = document.getElementById('userGrid');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplayName = document.getElementById('userDisplayName');
const adminBadge = document.getElementById('adminBadge');
const submissionStatusBadge = document.getElementById('submissionStatusBadge');
const currentDateDisplay = document.getElementById('currentDateDisplay');
const arrivalTimeInput = document.getElementById('arrivalTimeInput');
const nowBtn = document.getElementById('nowBtn');
const pointsPreviewNotice = document.getElementById('pointsPreviewNotice');
const wornUniformCheckbox = document.getElementById('wornUniformCheckbox');
const lessonAutonomyCheckbox = document.getElementById('lessonAutonomyCheckbox');
const participationSelect = document.getElementById('participationSelect');
const projectWorkTextArea = document.getElementById('projectWorkTextArea');
const projectScoreSelect = document.getElementById('projectScoreSelect');
const submitRecordBtn = document.getElementById('submitRecordBtn');
const leaderboardBody = document.getElementById('leaderboardBody');
const adminSubmissionList = document.getElementById('adminSubmissionList');

let currentUser = null;
let currentUserProfile = null;

// Helpers: Timezone-aware date & time string generation for Asia/Ulaanbaatar (UTC+8)
function getUbDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ulaanbaatar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value;
  const d = parts.find(p => p.type === 'day').value;
  return `${y}-${m}-${d}`;
}

function getUbTimeString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ulaanbaatar',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);
  let h = parts.find(p => p.type === 'hour').value;
  if (h === '24') h = '00';
  const min = parts.find(p => p.type === 'minute').value;
  return `${h.padStart(2, '0')}:${min.padStart(2, '0')}`;
}

// Converts name to nest[cleanName]@nhs.edu.mn
// e.g. Bat-Orgil -> nestbatorgil@nhs.edu.mn, Selenge -> nestselenge@nhs.edu.mn
function nameToEmail(name) {
  const textToNum = name;
  switch (textToNum) {
    case 'Bat-Orgil':
      cleanSlug = 'idk'
      break;
    case 'Bolor':
      cleanSlug = 'idk'
      break;
    case 'Bolormaa':
      cleanSlug = 'idk'
      break;
    case 'Gerelt-Od':
      cleanSlug = 'idk'
      break;
    case 'Indra':
      cleanSlug = 'idk'
      break;  
    case 'Inkhbayar':
      cleanSlug = 'idk'
      break;  
    case 'Mandakhnar':
      cleanSlug = 'idk'
      break;  
    case 'Munkhtugs':
      cleanSlug = '23301008'
      break; 
    case 'Naranbadral':
      cleanSlug = '23301041'
      break;  
    case 'Odbilig':
      cleanSlug = 'idk'
      break;  
    case 'Orgil':
      cleanSlug = 'idk'
      break;  
    case 'Tamir':
      cleanSlug = '23301038'
      break;  
    case 'Tuguldur':
      cleanSlug = 'idk'
      break;  
    case 'Khuselbayar':
      cleanSlug = 'idk'
      break;  
    case 'Chinbilig':
      cleanSlug = 'idk'
      break; 
    case 'Ezlen':
      cleanSlug = 'idk'
      break; 
    case 'Erdenetugs':
      cleanSlug = 'idk'
      break; 
    case 'Selenge':
      cleanSlug = 'selenge'
      return `${cleanSlug}@nhs.edu.mn`;
      break; 
    default:
      break;
  }
  // const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `nest${cleanSlug}@nhs.edu.mn`;
}

// Render User Selection Pills
function renderUserGrid() {
  userGrid.innerHTML = '';
  const savedUser = localStorage.getItem('savedTrackerUser');

  teamMemberList.forEach(name => {
    const pill = document.createElement('div');
    const isAdmin = name.toLowerCase() === 'selenge';
    pill.className = `userPill ${isAdmin ? 'admin' : ''}`;
    pill.textContent = isAdmin ? `👑 ${name}` : name;

    if (savedUser && savedUser.toLowerCase() === name.toLowerCase()) {
      pill.classList.add('active');
      emailInput.value = nameToEmail(name);
    }

    pill.addEventListener('click', () => {
      document.querySelectorAll('.userPill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      emailInput.value = nameToEmail(name);
      passwordInput.focus();
      if (rememberMeCheckbox.checked) {
        localStorage.setItem('savedTrackerUser', name);
      }
    });

    userGrid.appendChild(pill);
  });
}

// Arrival Preview Calculation
function updateArrivalPointsPreview() {
  const time = arrivalTimeInput.value;
  if (!time) {
    pointsPreviewNotice.textContent = '';
    return;
  }
  if (time <= '07:50') {
    pointsPreviewNotice.innerHTML = '<span style="color: #16a34a;">✨ +3 Points (Optimal arrival!)</span>';
  } else if (time <= '08:20') {
    pointsPreviewNotice.innerHTML = '<span style="color: #d97706;">⏱️ 0 Points (Within 30-min window)</span>';
  } else {
    pointsPreviewNotice.innerHTML = '<span style="color: #dc2626;">⚠️ -1 Point (Late arrival penalty)</span>';
  }
}

arrivalTimeInput.addEventListener('input', updateArrivalPointsPreview);
nowBtn.addEventListener('click', () => {
  arrivalTimeInput.value = getUbTimeString(new Date());
  updateArrivalPointsPreview();
});

// App Lifecycle
async function checkAuthSession() {
  renderUserGrid();
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session && session.user) {
    await initializeApp(session.user);
  } else {
    showAuthSection();
  }
}

async function initializeApp(user) {
  currentUser = user;

  // Fetch Profile to verify if user is admin
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  currentUserProfile = profile;
  userDisplayName.textContent = profile?.display_name || user.email;

  if (profile?.isAdmin) {
    adminBadge.classList.remove('hidden');
    adminSection.classList.remove('hidden');
    await loadAdminSubmissions();
  } else {
    adminBadge.classList.add('hidden');
    adminSection.classList.add('hidden');
  }

  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  leaderboardSection.classList.remove('hidden');

  const todayUb = getUbDateString();
  currentDateDisplay.textContent = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ulaanbaatar',
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  if (!arrivalTimeInput.value) {
    arrivalTimeInput.value = getUbTimeString(new Date());
  }
  updateArrivalPointsPreview();

  await checkTodaySubmission(todayUb);
  await loadLeaderboard();
  subscribeToUpdates();
}

function showAuthSection() {
  currentUser = null;
  currentUserProfile = null;
  authSection.classList.remove('hidden');
  appSection.classList.add('hidden');
  adminSection.classList.add('hidden');
  leaderboardSection.classList.add('hidden');
}

// Check existing submission for today
async function checkTodaySubmission(todayUb) {
  const { data, error } = await supabaseClient
    .from('daily_submissions')
    .select('*')
    .eq('user_id', currentUser.id)
    .eq('submission_date', todayUb)
    .maybeSingle();

  if (error) {
    console.error('Error fetching today submission:', error);
    return;
  }

  if (data) {
    submissionStatusBadge.className = 'badge badgeDone';
    submissionStatusBadge.textContent = 'Status: Submitted Today (Updates Allowed)';
    submitRecordBtn.textContent = 'Update Record';

    arrivalTimeInput.value = getUbTimeString(new Date(data.arrival_time));
    updateArrivalPointsPreview();
    wornUniformCheckbox.checked = data.worn_uniform;
    lessonAutonomyCheckbox.checked = data.lesson_autonomy;
    participationSelect.value = data.participation;
    projectWorkTextArea.value = data.project_work_text || '';
    projectScoreSelect.value = data.project_score;
  } else {
    submissionStatusBadge.className = 'badge badgePending';
    submissionStatusBadge.textContent = 'Status: Not submitted today';
    submitRecordBtn.textContent = 'Submit Record';
  }
}

// Authentication Handlers
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert('Please enter your email and password.');
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    alert(`Login failed: ${error.message}`);
  } else {
    if (rememberMeCheckbox.checked) {
      const matchedName = teamMemberList.find(n => nameToEmail(n) === email.toLowerCase());
      if (matchedName) localStorage.setItem('savedTrackerUser', matchedName);
    }
    await initializeApp(data.user);
  }
});

signupBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert('Please provide both email and password to sign up.');
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    alert(`Sign up failed: ${error.message}`);
  } else {
    alert('Account created! Logging you in...');
    await initializeApp(data.user);
  }
});

logoutBtn.addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  showAuthSection();
});

// Submit / Upsert Record
submitRecordBtn.addEventListener('click', async () => {
  const timeVal = arrivalTimeInput.value;
  if (!timeVal) {
    alert('Please specify your arrival time.');
    return;
  }

  submitRecordBtn.disabled = true;
  submitRecordBtn.textContent = 'Saving...';

  const todayUb = getUbDateString();
  const arrivalIso = new Date(`${todayUb}T${timeVal}:00+08:00`).toISOString();

  const { error } = await supabaseClient
    .from('daily_submissions')
    .upsert({
      user_id: currentUser.id,
      arrival_time: arrivalIso,
      worn_uniform: wornUniformCheckbox.checked,
      lesson_autonomy: lessonAutonomyCheckbox.checked,
      participation: parseInt(participationSelect.value),
      project_work_text: projectWorkTextArea.value,
      project_score: parseInt(projectScoreSelect.value)
    }, {
      onConflict: 'user_id,submission_date'
    });

  submitRecordBtn.disabled = false;

  if (error) {
    alert(`Save failed: ${error.message}`);
    submitRecordBtn.textContent = 'Submit Record';
  } else {
    alert('Submission saved successfully!');
    await checkTodaySubmission(todayUb);
    await loadLeaderboard();
    if (currentUserProfile?.isAdmin) await loadAdminSubmissions();
  }
});

// Load Leaderboard Data
async function loadLeaderboard() {
  const { data, error } = await supabaseClient
    .from('leaderboard')
    .select('*');

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return;
  }

  leaderboardBody.innerHTML = '';
  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    let rankBadge = `#${index + 1}`;
    if (index === 0) rankBadge = '🥇';
    else if (index === 1) rankBadge = '🥈';
    else if (index === 2) rankBadge = '🥉';

    const isCurrent = currentUser && currentUser.id === row.user_id;

    tr.innerHTML = `
      <td><b>${rankBadge}</b></td>
      <td>
        ${row.user_name} ${row.isAdmin ? '👑' : ''}
        ${isCurrent ? '<small style="color: var(--primary); font-weight: bold;">(You)</small>' : ''}
      </td>
      <td style="text-align: right; font-weight: bold; color: var(--primary);">
        ${row.total_points} pts
      </td>
    `;
    leaderboardBody.appendChild(tr);
  });
}

// Admin Feature: Load & Override Today's Submissions (Selenge only)
async function loadAdminSubmissions() {
  const todayUb = getUbDateString();
  const { data, error } = await supabaseClient
    .from('daily_submissions')
    .select('*, profiles(display_name, email)')
    .eq('submission_date', todayUb);

  if (error) {
    console.error('Admin fetch error:', error);
    return;
  }

  adminSubmissionList.innerHTML = '';
  if (!data || data.length === 0) {
    adminSubmissionList.innerHTML = '<em>No submissions registered yet for today.</em>';
    return;
  }

  data.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.style.cssText = 'background: white; border: 1px solid #e9d5ff; border-radius: 8px; padding: 10px; margin-bottom: 8px;';
    const name = item.profiles?.display_name || item.profiles?.email || 'User';
    const timeFormatted = getUbTimeString(new Date(item.arrival_time));

    itemCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>${name}</strong> (Arrived: ${timeFormatted})
        <button class="btnSecondary" style="width: auto; padding: 4px 8px; font-size: 0.75rem; margin: 0;">Adjust Score</button>
      </div>
      <div style="font-size: 0.8rem; color: #666; margin-top: 4px;">
        Part: ${item.participation}/5 | Proj: ${item.project_score}/5 | Uniform: ${item.worn_uniform ? '✅' : '❌'} | Autonomy: ${item.lesson_autonomy ? '✅' : '❌'}
      </div>
    `;

    itemCard.querySelector('button').addEventListener('click', async () => {
      const newPart = prompt(`Update participation score (1-5) for ${name}:`, item.participation);
      if (newPart === null) return;
      const parsedPart = parseInt(newPart);
      if (isNaN(parsedPart) || parsedPart < 1 || parsedPart > 5) {
        alert('Score must be between 1 and 5.');
        return;
      }

      const { error: updateError } = await supabaseClient
        .from('daily_submissions')
        .update({ participation: parsedPart })
        .eq('id', item.id);

      if (updateError) alert(`Update failed: ${updateError.message}`);
      else {
        alert('Updated successfully!');
        await loadAdminSubmissions();
        await loadLeaderboard();
      }
    });

    adminSubmissionList.appendChild(itemCard);
  });
}

// Supabase Realtime Listener
function subscribeToUpdates() {
  supabaseClient
    .channel('daily_updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_submissions' }, async () => {
      await loadLeaderboard();
      if (currentUserProfile?.isAdmin) await loadAdminSubmissions();
    })
    .subscribe();
}

// Start Application
checkAuthSession();
