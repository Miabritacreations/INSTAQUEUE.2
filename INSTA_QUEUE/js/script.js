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
  let depts = [];
  try {
    depts = await api('backend/departments.php', {}, 'GET') || [];
  } catch(e){ depts = []; }
  // fallback static departments
  const fallback = [
    {id:1,name:'Registrar',description:'Records & enrollment'},
    {id:2,name:'Finance / Fees Office',description:'Payments & billing'},
    {id:3,name:'ICT / Technical Support',description:'Tech support'},
    {id:4,name:'Library Services',description:'Research & borrowing'},
    {id:5,name:'Health Unit',description:'Medical services'},
    {id:6,name:'Student Affairs',description:'Welfare & housing'},
    {id:7,name:'Examination Office',description:'Exams & results'},
    {id:8,name:'Admissions Office',description:'Applications'}
  ];
  if (!Array.isArray(depts) || depts.length===0) depts = fallback;
  sel.innerHTML = '';
  depts.forEach(d=>{ const opt = document.createElement('option'); opt.value=d.id; opt.textContent=d.name; sel.appendChild(opt); });
}
loadDepartments('deptSelect'); loadDepartments('fbDept');

// Render services / department cards on landing and wire to booking modal
async function renderDepartmentsGrid(){
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  let depts = [];
  try {
    depts = await api('backend/departments.php', {}, 'GET') || [];
  } catch(e){ depts = []; }
  const fallback = [
    {id:1,name:'Registrar',description:'Handles academic records, enrollment, and certification matters.'},
    {id:2,name:'Finance / Fees Office',description:'Manages student financial records, payments, and billing issues.'},
    {id:3,name:'ICT / Technical Support',description:'Provides technical support for campus digital systems and devices.'},
    {id:4,name:'Library Services',description:'Supports academic research and learning resources.'},
    {id:5,name:'Health Unit',description:'Offers healthcare and wellness services to students.'},
    {id:6,name:'Student Affairs',description:'Handles student welfare, accommodation, and extracurricular matters.'},
    {id:7,name:'Examination Office',description:'Manages examination processes and assessment records.'},
    {id:8,name:'Admissions Office',description:'Handles admission-related processes and student onboarding.'}
  ];
  if (!Array.isArray(depts) || depts.length===0) depts = fallback;
  grid.innerHTML = '';
  // lightweight service suggestions per department (client-side fallback)
  const suggestions = {
    'Registrar':['Records & Transcripts','Registration Help','Certificates'],
    'Finance / Fees Office':['Fees Payment','Account Inquiry','Scholarships'],
    'ICT / Technical Support':['Password Reset','Software Access','Device Support'],
    'Library Services':['Borrowing','Research Help','Study Spaces'],
    'Health Unit':['Consultation','Vaccination','Medical Records'],
    'Student Affairs':['Accommodation','Counselling','Clubs & Societies'],
    'Examination Office':['Exam Queries','Results','Invigilation'],
    'Admissions Office':['Application Status','Documents','Offers']
  };
  depts.forEach(d=>{
    const el = document.createElement('div'); el.className='service card pop fade-in';
    const icon = document.createElement('div'); icon.className='service-icon'; icon.innerHTML = '<i class="fa fa-building-columns"></i>';
    const h = document.createElement('h3'); h.textContent = d.name;
    const p = document.createElement('p'); p.textContent = d.description || '';
    el.appendChild(icon); el.appendChild(h); el.appendChild(p);
    el.addEventListener('click', ()=>openBookingModal(d.id,d.name));
    grid.appendChild(el);
  });
}
renderDepartmentsGrid();

function openBookingModal(deptId, deptName){
  const backdrop = document.getElementById('bookingModal');
  if (!backdrop) return;
  document.getElementById('modalDeptId').value = deptId;
  // populate services dropdown using suggestions or fallback
  const sel = document.getElementById('serviceSelect');
  sel.innerHTML = '';
  const suggestions = {
    'Registrar':['Records & Transcripts','Registration Help','Certificates'],
    'Finance / Fees Office':['Fees Payment','Account Inquiry','Scholarships'],
    'ICT / Technical Support':['Password Reset','Software Access','Device Support'],
    'Library Services':['Borrowing','Research Help','Study Spaces'],
    'Health Unit':['Consultation','Vaccination','Medical Records'],
    'Student Affairs':['Accommodation','Counselling','Clubs & Societies'],
    'Examination Office':['Exam Queries','Results','Invigilation'],
    'Admissions Office':['Application Status','Documents','Offers']
  };
  // try to match by visible name
  const visibleName = deptName;
  const opts = suggestions[visibleName] || Object.values(suggestions).flat() || ['General Inquiry'];
  opts.forEach(s => { const o = document.createElement('option'); o.value = s; o.textContent = s; sel.appendChild(o); });
  backdrop.style.display = 'flex';
  setTimeout(()=> document.querySelector('.modal').classList.add('open'), 20);
}

function closeBookingModal(){
  const backdrop = document.getElementById('bookingModal'); if (!backdrop) return;
  document.querySelector('.modal').classList.remove('open');
  setTimeout(()=> backdrop.style.display='none', 220);
}

// student booking
const bookForm = document.getElementById('bookForm');
if (bookForm) {
  bookForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const f = new FormData(bookForm);
    const data = Object.fromEntries(f);
    const res = await api('backend/appointments.php', data);
    if (res.error) {
      alert(res.error);
    } else {
      alert(`Booked! Queue #${res.queue_number}`);
      try{ closeBookingModal(); }catch(e){}
      if (typeof loadMyAppointments === 'function') loadMyAppointments();
      if (typeof loadQueues === 'function') loadQueues();
    }
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
