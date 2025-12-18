// script.js — minimal AJAX interactions
const api = (path, data={}, method='POST') => {
  const opts = { method };
  if (method==='GET') {
    const q = new URLSearchParams(data).toString();
    return fetch(path + (q?('?'+q):''), {credentials:'include'}).then(r=>r.json());
  }
  const form = new FormData();
  for (const k in data) form.append(k, data[k]);
  return fetch(path, {method:'POST', body: form, credentials:'include'}).then(r=>r.json());
};

// register
const regForm = document.getElementById('registerForm');
if (regForm) {
  regForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const f = new FormData(regForm);
    const res = await api('backend/auth.php', Object.fromEntries(f));
    document.getElementById('msg').textContent = res.error?res.error:'Registered — please login';
  });
}

// login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const f = new FormData(loginForm);
    const res = await api('backend/auth.php?action=login', Object.fromEntries(f));
    document.getElementById('msg').textContent = res.error?res.error:'Logged in';
    if (res.success) window.location.href = (res.user.role==='admin')? 'dashboard-admin.html':'dashboard-student.html';
  });
}

// populate departments in forms
async function loadDepartments(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const depts = await api('backend/departments.php', {}, 'GET');
  sel.innerHTML = '';
  depts.forEach(d=>{ const opt = document.createElement('option'); opt.value=d.id; opt.textContent=d.name; sel.appendChild(opt); });
}
loadDepartments('deptSelect'); loadDepartments('fbDept');

// student booking
const bookForm = document.getElementById('bookForm');
if (bookForm) {
  bookForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const f = new FormData(bookForm);
    const data = Object.fromEntries(f);
    const res = await api('backend/appointments.php', data);
    alert(res.error?res.error:`Booked! Queue #${res.queue_number}`);
    if (res.success) loadMyAppointments();
  });
}

async function loadMyAppointments(){
  const res = await api('backend/appointments.php', {mine:1}, 'GET');
  const container = document.getElementById('myAppointments');
  if (!container) return;
  container.innerHTML = '';
  res.forEach(a=>{
    const div = document.createElement('div'); div.className='appt';
    div.innerHTML = `<strong>#${a.queue_number}</strong> ${a.department} ${a.date} ${a.time} — ${a.status}`;
    container.appendChild(div);
  });
}
loadMyAppointments();

// admin: load today's queues
async function loadQueues(){
  const res = await api('backend/appointments.php', {today:1}, 'GET');
  const container = document.getElementById('queues');
  if (!container) return;
  container.innerHTML = '';
  // group by department
  const byDept = {};
  res.forEach(a=>{ if (!byDept[a.department]) byDept[a.department]=[]; byDept[a.department].push(a); });
  Object.keys(byDept).forEach(deptName=>{
    const group = byDept[deptName];
    const hdr = document.createElement('div'); hdr.className='dept-group';
    const deptId = group[0].department_id || '';
    hdr.innerHTML = `<h4>${deptName} <button data-dept="${deptId}" class="serve-next">Serve Next</button></h4>`;
    container.appendChild(hdr);
    group.forEach(a=>{
      const div = document.createElement('div'); div.className='appt';
      div.innerHTML = `#${a.queue_number} ${a.student_name} ${a.time} [${a.status}] <button data-id="${a.id}" class="serve">Serve</button>`;
      container.appendChild(div);
    });
  });
  // attach handlers
  document.querySelectorAll('.serve').forEach(b=>b.addEventListener('click', async ev=>{
    const id = ev.target.dataset.id;
    await fetch('backend/appointments.php', {method:'PUT', body: new URLSearchParams({id,action:'serve'})});
    loadQueues();
  }));
  document.querySelectorAll('.serve-next').forEach(b=>b.addEventListener('click', async ev=>{
    const dept = ev.target.dataset.dept;
    if (!dept) { alert('No department id'); return; }
    const r = await fetch('backend/appointments.php', {method:'PUT', body: new URLSearchParams({action:'serve-next',department_id:dept})});
    const res = await r.json();
    if (res.error) alert(res.error); else alert('Serving: '+(res.appointment?('#'+res.appointment.queue_number+' '+res.appointment.student_name):'done'));
    loadQueues();
  }));
}
loadQueues();

// feedback
const fbForm = document.getElementById('feedbackForm');
if (fbForm) {
  fbForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(fbForm));
    const res = await api('backend/feedback.php', data);
    alert(res.error?res.error:'Thanks for feedback');
  });
}

// simple helper to show logged-in user (if any)
async function showUser(){
  // Not implemented server endpoint to return session; simple attempt to fetch appointments
}
showUser();
