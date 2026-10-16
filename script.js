/* =====================================================================
   SmartHire AI — fictional-data recruitment prototype (prototype only,
   no real AI). Data persists in localStorage on this browser/device.
   ===================================================================== */

// ---------- Icons (inline SVG paths) ----------
const ICON = {
  dashboard: '<path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z"/>',
  jobs: '<path d="M4 7h16v13H4zM9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
  candidates: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  matching: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3M9 12l2 2 4-4"/>',
  insights: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.74c.6.5 1 1.26 1 2.06V18h6v-1.2c0-.8.4-1.56 1-2.06A7 7 0 0 0 12 2z"/>',
  pipeline: '<path d="M3 3v18h18M7 16l4-5 3 3 5-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M11 4H4v16h16v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14H6L5 6"/>',
  close: '<path d="M18 6L6 18M6 6l12 12"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  empty: '<path d="M4 7h16v13H4zM4 7l2-3h12l2 3"/>'
};
const svg = (name, extra='') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICON[name]||''}</svg>`;

// ---------- Pipeline stages ----------
const STAGES = [
  { key: 'New',       color: '#8a93a3' },
  { key: 'Review',    color: '#3d5afe' },
  { key: 'Interview', color: '#c77700' },
  { key: 'Offer',     color: '#8b5cf6' },
  { key: 'Hired',     color: '#0f9d58' }
];
const stageColor = k => (STAGES.find(s => s.key === k) || STAGES[0]).color;

// ---------- Storage (safe) ----------
const KEY = 'smarthire.v1';
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ---------- Seed (fictional) ----------
function seed() {
  const jobs = [
    { id: uid(), title: 'Senior Frontend Engineer', dept: 'Engineering', level: 'Senior',
      skills: ['JavaScript','React','TypeScript','CSS','Accessibility'],
      desc: 'Build and maintain the candidate-facing product surface and internal dashboards.' },
    { id: uid(), title: 'Data Analyst', dept: 'Analytics', level: 'Mid',
      skills: ['SQL','Python','Tableau','Statistics','Excel'],
      desc: 'Turn hiring and funnel data into reports the leadership team can act on.' },
    { id: uid(), title: 'People Operations Lead', dept: 'HR', level: 'Lead',
      skills: ['Recruiting','Onboarding','Communication','HRIS','Policy'],
      desc: 'Own the end-to-end hiring process and candidate experience across teams.' },
    { id: uid(), title: 'Product Designer', dept: 'Design', level: 'Mid',
      skills: ['Figma','Prototyping','User Research','UI Design','Design Systems'],
      desc: 'Design clear, usable flows for recruiters and hiring managers.' }
  ];
  const candidates = [
    { id: uid(), name: 'Amara Diallo', exp: 6, edu: 'MSc Computer Science',
      skills: ['JavaScript','React','TypeScript','CSS','Node.js'], stage: 'Interview' },
    { id: uid(), name: 'Jonas Berg', exp: 4, edu: 'BSc Statistics',
      skills: ['SQL','Python','Excel','Power BI'], stage: 'Review' },
    { id: uid(), name: 'Priya Nair', exp: 9, edu: 'MBA, Human Resources',
      skills: ['Recruiting','Onboarding','Communication','HRIS','Policy','Mentoring'], stage: 'Offer' },
    { id: uid(), name: 'Luca Moretti', exp: 3, edu: 'BA Interaction Design',
      skills: ['Figma','Prototyping','UI Design','Illustration'], stage: 'New' },
    { id: uid(), name: 'Sofia Haas', exp: 7, edu: 'MSc Data Science',
      skills: ['SQL','Python','Tableau','Statistics','Machine Learning'], stage: 'Review' },
    { id: uid(), name: 'Daniel Okoye', exp: 2, edu: 'BSc Software Engineering',
      skills: ['JavaScript','React','HTML','CSS'], stage: 'New' }
  ];
  return { jobs, candidates, seeded: true };
}

let state = load() || seed();
if (!state.jobs) state.jobs = [];
if (!state.candidates) state.candidates = [];
save();

// ---------- Helpers ----------
const $ = sel => document.querySelector(sel);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parseSkills = str => String(str || '').split(',').map(s => s.trim()).filter(Boolean);
const initials = name => name.trim().split(/\s+/).map(w => w[0]).slice(0,2).join('').toUpperCase();
function avatarColor(str) {
  let h = 0; for (let i=0;i<str.length;i++) h = str.charCodeAt(i) + ((h<<5)-h);
  return `hsl(${Math.abs(h)%360} 55% 50%)`;
}
function toast(msg) {
  const wrap = $('#toastWrap');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = svg('check') + '<span>' + esc(msg) + '</span>';
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .2s'; setTimeout(() => t.remove(), 220); }, 2000);
}

// ---------- Matching logic (transparent, rule-based — not real AI) ----------
function matchResult(job, cand) {
  const required = (job.skills || []).map(s => s.toLowerCase());
  const have = (cand.skills || []).map(s => s.toLowerCase());
  const haveSet = new Set(have);
  const hits = (job.skills || []).filter(s => haveSet.has(s.toLowerCase()));
  const misses = (job.skills || []).filter(s => !haveSet.has(s.toLowerCase()));
  const pct = required.length ? Math.round((hits.length / required.length) * 100) : 0;
  return { hits, misses, pct, total: required.length };
}

// ---------- Navigation ----------
const VIEWS = [
  { id: 'dashboard', label: 'Dashboard', title: 'Dashboard', sub: 'Overview of hiring activity', count: false },
  { id: 'jobs', label: 'Jobs', title: 'Jobs', sub: 'Open roles and requirements', count: () => state.jobs.length },
  { id: 'candidates', label: 'Candidates', title: 'Candidates', sub: 'People in the pipeline', count: () => state.candidates.length },
  { id: 'matching', label: 'Matching', title: 'Matching', sub: 'Compare a candidate against a role', count: false },
  { id: 'insights', label: 'Insights', title: 'Insights', sub: 'Interview prep from job requirements', count: false },
  { id: 'pipeline', label: 'Hiring Pipeline', title: 'Hiring Pipeline', sub: 'Move candidates through stages', count: false }
];
let current = 'dashboard';

function renderNav() {
  const nav = $('#nav');
  nav.innerHTML = '<div class="nav-label">Workspace</div>' + VIEWS.map(v => {
    const c = typeof v.count === 'function' ? `<span class="nav-count">${v.count()}</span>` : '';
    return `<button class="nav-item ${v.id===current?'active':''}" data-view="${v.id}">${svg(v.id)}<span>${v.label}</span>${c}</button>`;
  }).join('');
  nav.querySelectorAll('.nav-item').forEach(b => b.onclick = () => go(b.dataset.view));
}
function go(id) {
  current = id;
  const v = VIEWS.find(x => x.id === id);
  $('#pageTitle').textContent = v.title;
  $('#pageSub').textContent = v.sub;
  renderNav();
  render();
  closeSidebar();
  $('#content').scrollTo?.(0,0);
  window.scrollTo(0,0);
}

// ---------- Per-view transient UI state ----------
let ui = { jobSearch: '', candSearch: '', candStage: 'All', matchJob: '', matchCand: '', insightJob: '' };

// ---------- Render dispatch ----------
function render() {
  const c = $('#content');
  if (current === 'dashboard') c.innerHTML = viewDashboard();
  else if (current === 'jobs') c.innerHTML = viewJobs();
  else if (current === 'candidates') c.innerHTML = viewCandidates();
  else if (current === 'matching') c.innerHTML = viewMatching();
  else if (current === 'insights') c.innerHTML = viewInsights();
  else if (current === 'pipeline') c.innerHTML = viewPipeline();
  wire();
}

// ---------- Dashboard ----------
function viewDashboard() {
  const counts = {};
  STAGES.forEach(s => counts[s.key] = 0);
  state.candidates.forEach(c => { if (counts[c.stage] != null) counts[c.stage]++; });
  const maxStage = Math.max(1, ...Object.values(counts));
  const hired = counts['Hired'] || 0;
  const active = state.candidates.length - hired;

  const stats = [
    { label: 'Open Jobs', num: state.jobs.length, meta: `${new Set(state.jobs.map(j=>j.dept)).size} departments` },
    { label: 'Candidates', num: state.candidates.length, meta: `${active} in progress` },
    { label: 'In Interview', num: counts['Interview'] + counts['Offer'], meta: 'interview + offer stage' },
    { label: 'Hired', num: hired, meta: state.candidates.length ? `${Math.round(hired/state.candidates.length*100)}% of pool` : '—' }
  ];

  const funnel = STAGES.map(s => {
    const n = counts[s.key];
    const w = Math.round((n / maxStage) * 100);
    return `<div class="funnel-row">
      <div class="stage">${s.key}</div>
      <div class="funnel-bar-track"><div class="funnel-bar" style="width:${Math.max(w, n>0?8:0)}%;background:${s.color}">${n||''}</div></div>
    </div>`;
  }).join('');

  const recent = state.candidates.slice(-4).reverse().map(c => `
    <div class="recent-item">
      <div class="avatar" style="background:${avatarColor(c.name)}">${initials(c.name)}</div>
      <div style="min-width:0">
        <div class="who">${esc(c.name)}</div>
        <div class="role">${esc(c.edu)} · ${c.exp} yrs</div>
      </div>
      <span class="pill ${c.stage==='Hired'?'good':c.stage==='New'?'':'accent'}" style="margin-left:auto">${c.stage}</span>
    </div>`).join('') || `<p style="color:var(--ink-faint);font-size:13px">No candidates yet.</p>`;

  return `
    <div class="banner">${svg('alert')}<div><strong>Prototype.</strong> All data is fictional and stored only in this browser. Matching uses a transparent rule-based formula, not real AI.</div></div>
    <div class="stat-grid">
      ${stats.map(s => `<div class="stat"><div class="label">${s.label}</div><div class="num">${s.num}</div><div class="meta">${s.meta}</div></div>`).join('')}
    </div>
    <div class="dash-cols">
      <div class="card funnel">
        <h3>Candidates by stage</h3>
        ${funnel}
      </div>
      <div class="card panel">
        <h3>Recently added</h3>
        ${recent}
      </div>
    </div>`;
}

// ---------- Jobs ----------
function viewJobs() {
  const q = ui.jobSearch.toLowerCase();
  const list = state.jobs.filter(j =>
    !q || j.title.toLowerCase().includes(q) || j.dept.toLowerCase().includes(q) ||
    (j.skills||[]).some(s => s.toLowerCase().includes(q)));

  const rows = list.map(j => `
    <tr>
      <td>
        <div class="cell-title">${esc(j.title)}</div>
        <div class="cell-sub">${esc(j.desc||'')}</div>
      </td>
      <td>${esc(j.dept)}</td>
      <td><span class="pill">${esc(j.level)}</span></td>
      <td><div class="chip-row">${(j.skills||[]).map(s=>`<span class="chip">${esc(s)}</span>`).join('')||'—'}</div></td>
      <td><div class="row-actions">
        <button data-edit-job="${j.id}" title="Edit">${svg('edit')}</button>
        <button class="del" data-del-job="${j.id}" title="Delete">${svg('trash')}</button>
      </div></td>
    </tr>`).join('');

  const body = list.length
    ? `<div class="table-wrap"><table>
        <thead><tr><th>Role</th><th>Department</th><th>Level</th><th>Required skills</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>`
    : `<div class="empty">${svg('empty')}<p>${state.jobs.length ? 'No jobs match your search.' : 'No jobs yet. Add your first role.'}</p></div>`;

  return `
    <div class="section-head">
      <div class="search">${svg('search')}<input id="jobSearch" placeholder="Search roles, departments, skills…" value="${esc(ui.jobSearch)}"></div>
      <div class="spacer"></div>
      <button class="btn btn-primary" id="addJob">${svg('plus')} Add job</button>
    </div>
    ${body}`;
}

// ---------- Candidates ----------
function viewCandidates() {
  const q = ui.candSearch.toLowerCase();
  const list = state.candidates.filter(c => {
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.edu.toLowerCase().includes(q) ||
      (c.skills||[]).some(s => s.toLowerCase().includes(q));
    const matchS = ui.candStage === 'All' || c.stage === ui.candStage;
    return matchQ && matchS;
  });

  const rows = list.map(c => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar" style="background:${avatarColor(c.name)}">${initials(c.name)}</div>
          <div><div class="cell-title">${esc(c.name)}</div><div class="cell-sub">${esc(c.edu)}</div></div>
        </div>
      </td>
      <td style="font-variant-numeric:tabular-nums">${c.exp} yrs</td>
      <td><div class="chip-row">${(c.skills||[]).map(s=>`<span class="chip">${esc(s)}</span>`).join('')||'—'}</div></td>
      <td><span class="pill ${c.stage==='Hired'?'good':c.stage==='New'?'':c.stage==='Offer'?'accent':''}">${esc(c.stage)}</span></td>
      <td><div class="row-actions">
        <button data-edit-cand="${c.id}" title="Edit">${svg('edit')}</button>
        <button class="del" data-del-cand="${c.id}" title="Delete">${svg('trash')}</button>
      </div></td>
    </tr>`).join('');

  const body = list.length
    ? `<div class="table-wrap"><table>
        <thead><tr><th>Candidate</th><th>Experience</th><th>Skills</th><th>Stage</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>`
    : `<div class="empty">${svg('empty')}<p>${state.candidates.length ? 'No candidates match your filters.' : 'No candidates yet. Add your first one.'}</p></div>`;

  const stageOpts = ['All', ...STAGES.map(s=>s.key)].map(s =>
    `<option ${ui.candStage===s?'selected':''}>${s}</option>`).join('');

  return `
    <div class="section-head">
      <div class="search">${svg('search')}<input id="candSearch" placeholder="Search name, education, skills…" value="${esc(ui.candSearch)}"></div>
      <select id="candStage" style="padding:7px 11px;border:1px solid var(--line-strong);border-radius:8px;background:var(--surface);color:var(--ink)">${stageOpts}</select>
      <div class="spacer"></div>
      <button class="btn btn-primary" id="addCand">${svg('plus')} Add candidate</button>
    </div>
    ${body}`;
}

// ---------- Matching ----------
function viewMatching() {
  const jobOpts = '<option value="">Select a job…</option>' +
    state.jobs.map(j => `<option value="${j.id}" ${ui.matchJob===j.id?'selected':''}>${esc(j.title)}</option>`).join('');
  const candOpts = '<option value="">Select a candidate…</option>' +
    state.candidates.map(c => `<option value="${c.id}" ${ui.matchCand===c.id?'selected':''}>${esc(c.name)}</option>`).join('');

  let result = '';
  const job = state.jobs.find(j => j.id === ui.matchJob);
  const cand = state.candidates.find(c => c.id === ui.matchCand);

  if (job && cand) {
    const r = matchResult(job, cand);
    const C = 2 * Math.PI * 64;
    const off = C * (1 - r.pct/100);
    const ringColor = r.pct >= 70 ? 'var(--good)' : r.pct >= 40 ? 'var(--warn)' : 'var(--crit)';
    result = `
      <div class="match-result">
        <div class="card score-card">
          <div class="ring">
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="64" fill="none" stroke="var(--line)" stroke-width="13"/>
              <circle cx="75" cy="75" r="64" fill="none" stroke="${ringColor}" stroke-width="13"
                stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
            </svg>
            <div class="pct">${r.pct}<small>%</small></div>
          </div>
          <div style="font-weight:700;font-size:13px">${esc(cand.name)}</div>
          <div style="font-size:12px;color:var(--ink-faint)">for ${esc(job.title)}</div>
          <div style="margin-top:10px"><span class="pill ${r.pct>=70?'good':r.pct>=40?'warn':'crit'}">${r.hits.length} of ${r.total} skills matched</span></div>
        </div>
        <div>
          <div class="skill-cols">
            <div class="card skill-box">
              <h4 style="color:var(--good)">${svg('checkCircle')} Matching skills</h4>
              ${r.hits.length ? r.hits.map(s=>`<span class="skill-tag hit">${esc(s)}</span>`).join('') : '<span style="font-size:12.5px;color:var(--ink-faint)">None of the required skills were found.</span>'}
            </div>
            <div class="card skill-box">
              <h4 style="color:var(--warn)">${svg('alert')} Not confirmed by profile</h4>
              ${r.misses.length ? r.misses.map(s=>`<span class="skill-tag miss">${esc(s)}</span>`).join('') : '<span style="font-size:12.5px;color:var(--ink-faint)">All required skills are listed on the profile.</span>'}
            </div>
          </div>
          <div class="formula">
            <strong>How this score is calculated.</strong> Each required skill on the job is checked, case-insensitively, against the skills listed on the candidate's profile.
            <span class="big">score = matched skills ÷ required skills × 100 = ${r.hits.length} ÷ ${r.total} × 100 = ${r.pct}%</span>
            A "not confirmed" skill only means it is absent from the listed profile — not that the candidate lacks it. This is a transparent screening aid, not a hiring decision.
          </div>
        </div>
      </div>`;
  } else {
    result = `<div class="empty">${svg('matching')}<p>Select a job and a candidate to compare their skills.</p></div>`;
  }

  return `
    <div class="match-pick">
      <div class="field"><label>Job</label><select id="matchJob">${jobOpts}</select></div>
      <div class="field"><label>Candidate</label><select id="matchCand">${candOpts}</select></div>
    </div>
    ${result}`;
}

// ---------- Insights ----------
function viewInsights() {
  const jobOpts = '<option value="">Select a job…</option>' +
    state.jobs.map(j => `<option value="${j.id}" ${ui.insightJob===j.id?'selected':''}>${esc(j.title)}</option>`).join('');
  const job = state.jobs.find(j => j.id === ui.insightJob);

  let body = `<div class="empty">${svg('insights')}<p>Select a job to generate interview questions and clarification points.</p></div>`;

  if (job) {
    const skills = job.skills || [];
    const questions = [];
    questions.push(`Walk me through a recent project where you worked as a ${job.title.replace(/^(Senior|Lead|Junior|Mid)\s+/i,'').toLowerCase()}. What was your specific contribution?`);
    skills.slice(0,3).forEach(s => questions.push(`Describe a situation where your ${s} experience made a measurable difference to a project.`));
    if (job.level === 'Senior' || job.level === 'Lead') questions.push(`Tell me about a time you mentored others or set technical direction for a ${job.dept} team.`);
    else questions.push(`How do you decide when to ask for help versus pushing through a problem on your own?`);
    questions.push(`Why does this ${job.dept} role interest you specifically, and where do you want to grow?`);

    const clar = [];
    clar.push(`Confirm how the candidate's listed skills were used in practice, not just named on a résumé.`);
    if (skills.length) clar.push(`Probe depth on "${skills[0]}" — the central requirement for this role.`);
    clar.push(`Clarify the gap between stated years of experience and the seniority this ${job.level} role expects.`);
    clar.push(`Check availability, notice period, and alignment on working arrangements.`);

    body = `
      <div class="insight-grid">
        <div class="card panel">
          <h3>Suggested interview questions</h3>
          <ol class="q-list">${questions.map((q,i)=>`<li><span class="n">${i+1}</span><span>${esc(q)}</span></li>`).join('')}</ol>
        </div>
        <div class="card panel">
          <h3>Details to clarify</h3>
          <ul class="clar-list">${clar.map(c=>`<li>${svg('alert')}<span>${esc(c)}</span></li>`).join('')}</ul>
          <div class="formula" style="margin-top:14px">Questions are generated from the role title, level, department, and required skills you entered — a prompt sheet to prepare with, reviewed by a human before any interview.</div>
        </div>
      </div>`;
  }

  return `
    <div class="section-head" style="max-width:420px">
      <div class="field" style="flex:1"><label>Job</label><select id="insightJob">${jobOpts}</select></div>
    </div>
    ${body}`;
}

// ---------- Pipeline ----------
function viewPipeline() {
  const cols = STAGES.map(s => {
    const people = state.candidates.filter(c => c.stage === s.key);
    const cards = people.map(c => `
      <div class="pcard">
        <div class="pname">${esc(c.name)}</div>
        <div class="pmeta">${esc(c.edu)} · ${c.exp} yrs</div>
        <select data-stage-for="${c.id}">
          ${STAGES.map(st => `<option ${st.key===c.stage?'selected':''}>${st.key}</option>`).join('')}
        </select>
      </div>`).join('') || `<div style="font-size:12px;color:var(--ink-faint);padding:6px 2px">Empty</div>`;
    return `
      <div class="col">
        <div class="col-head">
          <span class="col-dot" style="background:${s.color}"></span>
          <span class="name">${s.key}</span>
          <span class="ct">${people.length}</span>
        </div>
        ${cards}
      </div>`;
  }).join('');
  return `<div class="banner">${svg('pipeline')}<div>Change a candidate's stage with the dropdown on their card. Counts and the Dashboard funnel update instantly.</div></div><div class="board">${cols}</div>`;
}

// ---------- Modals ----------
function openModal(title, bodyHTML, onSave) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-head"><h3>${esc(title)}</h3><button class="x" aria-label="Close">${svg('close')}</button></div>
      <div class="modal-body">${bodyHTML}</div>
      <div class="modal-foot">
        <button class="btn" data-cancel>Cancel</button>
        <button class="btn btn-primary" data-save>${svg('check')} Save</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  const close = () => bg.remove();
  bg.querySelector('.x').onclick = close;
  bg.querySelector('[data-cancel]').onclick = close;
  bg.onclick = e => { if (e.target === bg) close(); };
  bg.querySelector('[data-save]').onclick = () => { if (onSave(bg) !== false) close(); };
  const first = bg.querySelector('input, select, textarea');
  if (first) first.focus();
  return bg;
}

function jobForm(job) {
  return `
    <div class="field"><label>Job title</label><input id="f_title" value="${esc(job?.title||'')}" placeholder="e.g. Backend Engineer"></div>
    <div class="form-2col">
      <div class="field"><label>Department</label><input id="f_dept" value="${esc(job?.dept||'')}" placeholder="e.g. Engineering"></div>
      <div class="field"><label>Experience level</label>
        <select id="f_level">${['Junior','Mid','Senior','Lead'].map(l=>`<option ${job?.level===l?'selected':''}>${l}</option>`).join('')}</select>
      </div>
    </div>
    <div class="field"><label>Required skills</label><input id="f_skills" value="${esc((job?.skills||[]).join(', '))}" placeholder="Comma-separated, e.g. SQL, Python, Tableau"><span class="hint">Separate each skill with a comma.</span></div>
    <div class="field"><label>Description</label><textarea id="f_desc" placeholder="What this role is responsible for">${esc(job?.desc||'')}</textarea></div>`;
}
function readJobForm(bg) {
  const title = bg.querySelector('#f_title').value.trim();
  if (!title) { bg.querySelector('#f_title').focus(); return null; }
  return {
    title,
    dept: bg.querySelector('#f_dept').value.trim() || 'General',
    level: bg.querySelector('#f_level').value,
    skills: parseSkills(bg.querySelector('#f_skills').value),
    desc: bg.querySelector('#f_desc').value.trim()
  };
}

function candForm(c) {
  return `
    <div class="field"><label>Full name</label><input id="c_name" value="${esc(c?.name||'')}" placeholder="e.g. Alex Rivera"></div>
    <div class="form-2col">
      <div class="field"><label>Years of experience</label><input id="c_exp" type="number" min="0" max="50" value="${c?.exp ?? ''}" placeholder="e.g. 5"></div>
      <div class="field"><label>Stage</label><select id="c_stage">${STAGES.map(s=>`<option ${c?.stage===s.key?'selected':''}>${s.key}</option>`).join('')}</select></div>
    </div>
    <div class="field"><label>Education</label><input id="c_edu" value="${esc(c?.edu||'')}" placeholder="e.g. BSc Computer Science"></div>
    <div class="field"><label>Skills</label><input id="c_skills" value="${esc((c?.skills||[]).join(', '))}" placeholder="Comma-separated, e.g. React, CSS, Git"><span class="hint">Separate each skill with a comma.</span></div>`;
}
function readCandForm(bg) {
  const name = bg.querySelector('#c_name').value.trim();
  if (!name) { bg.querySelector('#c_name').focus(); return null; }
  return {
    name,
    exp: Math.max(0, parseInt(bg.querySelector('#c_exp').value, 10) || 0),
    edu: bg.querySelector('#c_edu').value.trim() || '—',
    skills: parseSkills(bg.querySelector('#c_skills').value),
    stage: bg.querySelector('#c_stage').value
  };
}

// ---------- Delete confirmation (built into the page) ----------

function deleteModal(label, onYes) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal" style="max-width:400px">
      <div class="modal-head"><h3>Delete ${esc(label)}?</h3></div>
      <div class="modal-body"><p style="margin:0;color:var(--ink-soft)">This removes it from the prototype data stored on this browser. It can't be undone.</p></div>
      <div class="modal-foot">
        <button class="btn" data-cancel>Cancel</button>
        <button class="btn btn-primary" style="background:var(--crit);border-color:var(--crit)" data-yes>${svg('trash')} Delete</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  const close = () => bg.remove();
  bg.querySelector('[data-cancel]').onclick = close;
  bg.onclick = e => { if (e.target === bg) close(); };
  bg.querySelector('[data-yes]').onclick = () => { onYes(); close(); };
}

// ---------- Wire up events after each render ----------
function wire() {
  // Jobs
  const addJob = $('#addJob');
  if (addJob) addJob.onclick = () => openModal('Add job', jobForm(null), (bg) => {
    const d = readJobForm(bg); if (!d) return false;
    state.jobs.push({ id: uid(), ...d }); save(); renderNav(); render(); toast('Job added');
  });
  document.querySelectorAll('[data-edit-job]').forEach(b => b.onclick = () => {
    const job = state.jobs.find(j => j.id === b.dataset.editJob);
    openModal('Edit job', jobForm(job), (bg) => {
      const d = readJobForm(bg); if (!d) return false;
      Object.assign(job, d); save(); render(); toast('Job updated');
    });
  });
  document.querySelectorAll('[data-del-job]').forEach(b => b.onclick = () => {
    const job = state.jobs.find(j => j.id === b.dataset.delJob);
    deleteModal(job.title, () => { state.jobs = state.jobs.filter(j => j.id !== job.id); save(); renderNav(); render(); toast('Job deleted'); });
  });
  const js = $('#jobSearch');
  if (js) js.oninput = e => { ui.jobSearch = e.target.value; const pos = e.target.selectionStart; render(); const el = $('#jobSearch'); if (el){ el.focus(); el.setSelectionRange(pos,pos);} };

  // Candidates
  const addCand = $('#addCand');
  if (addCand) addCand.onclick = () => openModal('Add candidate', candForm(null), (bg) => {
    const d = readCandForm(bg); if (!d) return false;
    state.candidates.push({ id: uid(), ...d }); save(); renderNav(); render(); toast('Candidate added');
  });
  document.querySelectorAll('[data-edit-cand]').forEach(b => b.onclick = () => {
    const c = state.candidates.find(x => x.id === b.dataset.editCand);
    openModal('Edit candidate', candForm(c), (bg) => {
      const d = readCandForm(bg); if (!d) return false;
      Object.assign(c, d); save(); render(); toast('Candidate updated');
    });
  });
  document.querySelectorAll('[data-del-cand]').forEach(b => b.onclick = () => {
    const c = state.candidates.find(x => x.id === b.dataset.delCand);
    deleteModal(c.name, () => { state.candidates = state.candidates.filter(x => x.id !== c.id); save(); renderNav(); render(); toast('Candidate deleted'); });
  });
  const cs = $('#candSearch');
  if (cs) cs.oninput = e => { ui.candSearch = e.target.value; const pos = e.target.selectionStart; render(); const el = $('#candSearch'); if (el){ el.focus(); el.setSelectionRange(pos,pos);} };
  const cstage = $('#candStage');
  if (cstage) cstage.onchange = e => { ui.candStage = e.target.value; render(); };

  // Matching
  const mj = $('#matchJob'); if (mj) mj.onchange = e => { ui.matchJob = e.target.value; render(); };
  const mc = $('#matchCand'); if (mc) mc.onchange = e => { ui.matchCand = e.target.value; render(); };

  // Insights
  const ij = $('#insightJob'); if (ij) ij.onchange = e => { ui.insightJob = e.target.value; render(); };

  // Pipeline
  document.querySelectorAll('[data-stage-for]').forEach(sel => sel.onchange = e => {
    const c = state.candidates.find(x => x.id === sel.dataset.stageFor);
    if (c) { c.stage = e.target.value; save(); renderNav(); render(); toast(c.name + ' → ' + e.target.value); }
  });
}

// ---------- Theme toggle ----------
function currentTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr) return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function setThemeUI() {
  const dark = currentTheme() === 'dark';
  $('#themeIcon').innerHTML = dark ? ICON.sun : ICON.moon;
  $('#themeLabel').textContent = dark ? 'Light mode' : 'Dark mode';
}
$('#themeBtn').onclick = () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('smarthire.theme', next); } catch(e) {}
  setThemeUI();
};
try { const saved = localStorage.getItem('smarthire.theme'); if (saved) document.documentElement.setAttribute('data-theme', saved); } catch(e) {}

// ---------- Mobile sidebar ----------
function closeSidebar() { $('#sidebar').classList.remove('open'); $('#backdrop').classList.remove('show'); }
$('#menuToggle').onclick = () => { $('#sidebar').classList.add('open'); $('#backdrop').classList.add('show'); };
$('#backdrop').onclick = closeSidebar;

// ---------- Boot ----------
renderNav();
render();
setThemeUI();
