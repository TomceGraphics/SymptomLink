// --- CONFIGURATION ---
const GEMINI_API_KEY = "";
const SUPABASE_URL = "";
const SUPABASE_KEY = "";

// Initialize Supabase Client (No build tool needed)
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- DOM ELEMENTS ---
const symptomInput = document.getElementById('symptomInput');
const aiStatus = document.getElementById('ai-status');
const aiStatusText = document.getElementById('ai-status-text');

// --- GLOBAL STATE ---
let state = {
    currentUser: null,
    appointments: [],
    doctors: [],
    selectedDoctor: null,
    searchMode: 'ai' // 'ai' or 'keyword'
};


// --- DATABASE LOADER (Supabase + Fallback) ---
async function initDatabase() {
    console.log("🔄 Connecting to Supabase...");

    const fallbackDoctors = [
        { id: 1, name: "Dr. Sarah Chen", username: "sarah", password: "123", specialty: "Neurologist", keywords: ["headache", "migraine", "head", "dizzy", "concussion"], rating: 4.9, img: "https://i.pravatar.cc/150?u=sarah" },
        { id: 2, name: "Dr. James Wilson", username: "james", password: "123", specialty: "Cardiologist", keywords: ["heart", "chest", "pain", "palpitations", "pressure"], rating: 4.8, img: "https://i.pravatar.cc/150?u=james" },
        { id: 3, name: "Dr. Elena Rodriguez", username: "elena", password: "123", specialty: "Dermatologist", keywords: ["skin", "rash", "itch", "red", "acne"], rating: 4.7, img: "https://i.pravatar.cc/150?u=elena" },
        { id: 4, name: "Dr. Lisa Park", username: "lisa", password: "123", specialty: "General Physician", keywords: ["flu", "fever", "cold", "cough", "stomach"], rating: 4.6, img: "https://i.pravatar.cc/150?u=lisa" }
    ];

    try {
        // 1. FETCH DOCTORS
        const { data: doctorsData, error: docError } = await db.from('doctors').select('*');
        if (docError) throw docError;

        // 2. FETCH APPOINTMENTS
        const { data: appData, error: appError } = await db.from('appointments').select('*');
        if (appError) throw appError;

        // Update State
        state.doctors = (doctorsData && doctorsData.length > 0) ? doctorsData : fallbackDoctors;

        // Map Supabase columns (patient_name) to UI properties (patient)
        state.appointments = appData.map(a => ({
            id: a.id,
            patient: a.patient_name,
            doctor: a.doctor_name,
            specialty: a.specialty,
            date: a.date_booked,
            time: a.time_booked
        }));

        renderDoctorCards(state.doctors);
        console.log("✅ Database initialized from Supabase.");

    } catch (err) {
        console.error("⚠️ Supabase Error (Using Offline Mode):", err.message);
        state.doctors = fallbackDoctors;
        state.appointments = []; // Empty apps in offline mode
        renderDoctorCards(state.doctors);
    }
}

// --- EVENT LISTENERS ---
if (symptomInput) {
    symptomInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') triggerSearch();
    });

    symptomInput.addEventListener('input', (e) => {
        if (!aiStatusText.innerText.includes("Transcribing")) {
            aiStatus.classList.add('opacity-0');
        }
    });
}

function triggerSearch() {
    const text = symptomInput.value;
    if (state.searchMode === 'ai') {
        performSmartSearch(text);
    } else {
        fallbackLocalSearch(text.toLowerCase().trim());
    }
}

function toggleSearchMenu() {
    const menu = document.getElementById('search-mode-menu');
    menu.classList.toggle('hidden');
}

function selectSearchMode(mode) {
    const menu = document.getElementById('search-mode-menu');
    const btnText = document.getElementById('current-mode-text');
    const btnIcon = document.getElementById('mode-icon');

    // UI Elements for Active State in Menu
    const btnAi = document.getElementById('btn-mode-ai');
    const btnKey = document.getElementById('btn-mode-key');

    menu.classList.add('hidden'); // Close menu

    if (mode === state.searchMode) return; // No change

    if (mode === 'keyword') {
        // Warning for Keyword Mode
        showToast("Keyword search is less advanced and relies on exact matches. Continue?", {
            type: 'warning',
            title: 'Search Disclaimer',
            showButtons: true,
            onOk: () => {
                state.searchMode = 'keyword';
                // Update Button UI
                btnText.innerText = "Keyword Match";
                btnIcon.className = "fas fa-key text-slate-500";

                // Update Menu Selection UI
                btnKey.className = "w-full text-left p-2.5 rounded-xl flex items-start gap-3 mb-1 transition-all bg-blue-50/60 border border-blue-200/50 ring-1 ring-blue-100 relative overflow-hidden";
                btnAi.className = "w-full text-left p-2.5 rounded-xl flex items-start gap-3 mb-1 transition-all hover:bg-slate-50 border border-transparent opacity-60 hover:opacity-100";

                showToast("Switched to Keyword Search");
            }
        });
    } else {
        // Switch to AI Mode
        state.searchMode = 'ai';
        // Update Button UI
        btnText.innerText = "Natural Language";
        btnIcon.className = "fas fa-sparkles text-blue-500";

        // Update Menu Selection UI
        btnAi.className = "w-full text-left p-2.5 rounded-xl flex items-start gap-3 mb-1 transition-all bg-blue-50/60 border border-blue-200/50 ring-1 ring-blue-100 relative overflow-hidden";
        btnKey.className = "w-full text-left p-2.5 rounded-xl flex items-start gap-3 mb-1 transition-all hover:bg-slate-50 border border-transparent opacity-60 hover:opacity-100";

        showToast("Switched to AI Natural Language");
    }
}

// --- LLM SIMULATION & SEARCH ---
function typeWriter(text, i = 0) {
    if (i < text.length) {
        symptomInput.value += text.charAt(i);
        setTimeout(() => typeWriter(text, i + 1), 50);
    } else {
        triggerSearch();
        aiStatus.classList.add('opacity-0');
    }
}

function simulateVoice() {
    symptomInput.value = "";
    aiStatus.classList.remove('opacity-0');
    aiStatusText.innerText = "Listening...";
    setTimeout(() => {
        aiStatusText.innerText = "Transcribing...";
        setTimeout(() => {
            typeWriter("I've had a really bad migraine since this morning");
        }, 500);
    }, 1500);
}

function simulateImage() {
    symptomInput.value = "";
    aiStatus.classList.remove('opacity-0');
    aiStatusText.innerText = "Scanning Image...";
    setTimeout(() => {
        aiStatusText.innerText = "Analyzing...";
        setTimeout(() => {
            typeWriter("Red itchy rash on left arm");
        }, 800);
    }, 1500);
}

async function performSmartSearch(sentence) {
    const query = sentence.toLowerCase().trim();
    aiStatus.classList.remove('opacity-0');
    aiStatusText.innerText = "Consulting AI...";

    if (!query) {
        showAllDoctors();
        aiStatus.classList.add('opacity-0');
        return;
    }

    // Prepare data for AI (Lite version to save tokens)
    const doctorListLite = state.doctors.map(d => ({
        id: d.id,
        specialty: d.specialty,
        keywords: d.keywords
    }));

    const prompt = `
        You are a medical triage assistant. 
        Here is the list of available doctors: ${JSON.stringify(doctorListLite)}.
        
        The patient describes their condition as: "${query}".
        
        Task: 
        1. Analyze the symptoms.
        2. Match them to the most appropriate specialists from the list.
        3. Return ONLY a JSON array of the matching doctor IDs. 
        
        Example Output format: [1, 3]
        Do not output markdown, explanations, or code blocks. Just the raw JSON array.
    `;

    console.log("🚀 Sending to Gemini 2.5:", query);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            console.warn("⚠️ API Error (Likely Quota Limit):", data.error?.message);
            throw new Error("API_FAIL");
        }

        let responseText = data.candidates[0].content.parts[0].text;
        console.log("🤖 AI Response:", responseText);

        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const matchedIds = JSON.parse(responseText);

        if (Array.isArray(matchedIds) && matchedIds.length > 0) {
            const results = state.doctors.filter(doc => matchedIds.includes(doc.id));
            renderDoctorCards(results);
            updateStatusPill(results.length);
        } else {
            updateStatusPill(0);
        }

    } catch (error) {
        console.log("🔄 Switching to Local Fallback (Quota hit or Error)");
        fallbackLocalSearch(query);
    } finally {
        aiStatus.classList.add('opacity-0');
    }
}

function fallbackLocalSearch(query) {
    const results = state.doctors.filter(doc =>
        doc.specialty.toLowerCase().includes(query) ||
        doc.keywords.some(k => query.includes(k))
    );
    renderDoctorCards(results);
    updateStatusPill(results.length);
}

function updateStatusPill(count) {
    const pill = document.getElementById('results-pill');
    const noResults = document.getElementById('no-results');
    const grid = document.getElementById('doctorGrid');

    if (count === 0) {
        grid.classList.add('hidden');
        noResults.classList.remove('hidden');
        pill.innerText = "No Matches";
        pill.className = "bg-slate-200 text-slate-500 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0";
    } else {
        grid.classList.remove('hidden');
        noResults.classList.add('hidden');
        pill.innerText = `Found ${count} Specialist${count > 1 ? 's' : ''}`;
        pill.className = "bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0";
    }
}

function showAllDoctors() {
    document.getElementById('symptomInput').value = '';
    renderDoctorCards(state.doctors);
    document.getElementById('doctorGrid').classList.remove('hidden');
    document.getElementById('no-results').classList.add('hidden');
    document.getElementById('results-pill').innerText = "Showing All";
    document.getElementById('results-pill').className = "bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0";
}

function renderDoctorCards(list) {
    const grid = document.getElementById('doctorGrid');
    grid.innerHTML = '';
    list.forEach(doc => {
        grid.innerHTML += `
            <div class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full fade-in">
                <div class="flex items-start justify-between mb-4">
                    <img src="${doc.img}" class="w-16 h-16 rounded-2xl object-cover shadow-md">
                    <span class="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <i class="fas fa-star text-amber-400 text-[10px]"></i>${doc.rating}
                    </span>
                </div>
                <h3 class="text-lg font-bold text-slate-800">${doc.name}</h3>
                <p class="text-blue-600 text-xs font-bold uppercase mb-4 tracking-wide">${doc.specialty}</p>
                <div class="flex gap-2 mb-6 flex-wrap">
                    ${doc.keywords.slice(0, 3).map(k => `<span class="bg-slate-50 text-slate-500 text-[10px] px-2 py-1 rounded-lg border border-slate-100 uppercase tracking-wide">${k}</span>`).join('')}
                </div>
                <button onclick="openModal(${doc.id})" class="mt-auto w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg">Request Appointment</button>
            </div>
        `;
    });
}

// --- AUTH & NAVIGATION ---

function handleLogin() {
    const user = document.getElementById('login-user').value.toLowerCase().trim();
    const pass = document.getElementById('login-pass').value;

    const matchedDoctor = state.doctors.find(d => d.username === user && d.password === pass);

    if (matchedDoctor) {
        state.currentUser = matchedDoctor;
        showToast(`Welcome back, ${matchedDoctor.name}`);
        navigateTo('/dashboard');

        document.getElementById('login-user').value = '';
        document.getElementById('login-pass').value = '';
    } else if (user === 'admin' && pass === 'admin') {
        showToast("Admin access granted");
        state.currentUser = { name: "Admin", role: "admin" };
        navigateTo('/admin');
    } else {
        showToast("Invalid credentials");
    }
}

function logout() {
    state.currentUser = null;
    navigateTo('/doctor');
    showToast("Logged out successfully");
}

// --- DASHBOARDS ---
function renderDoctorDashboard() {
    if (!state.currentUser) return;
    const list = document.getElementById('doctor-app-list');
    document.getElementById('doc-dash-title').innerText = `Welcome back, ${state.currentUser.name}`;

    // Filter appointments for the logged-in doctor
    const myApps = state.appointments.filter(a => a.doctor === state.currentUser.name);
    list.innerHTML = '';

    // Calculate Stats
    const totalApps = myApps.length;
    const todayApps = myApps.filter(a => a.date === new Date().toISOString().split('T')[0]).length;

    document.getElementById('stat-total').innerText = totalApps;
    document.getElementById('stat-waiting').innerText = totalApps; // Same for now
    document.getElementById('stat-today').innerText = todayApps;

    list.innerHTML = '';

    if (myApps.length === 0) {
        list.innerHTML = '<div class="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-100">No appointments yet.</div>';
        return;
    }

    myApps.forEach(app => {
        list.innerHTML += `
            <div class="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center fade-in">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">${app.patient[0]}</div>
                    <div>
                        <p class="font-bold text-slate-900">${app.patient}</p>
                        <p class="text-xs text-slate-400">Scheduled: ${app.date} at ${app.time}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="openPatientModal('${app.patient}')" class="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">View Record</button>
                    <button onclick="resolveAppointment(${app.id})" class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md">Resolve</button>
                </div>
            </div>
        `;
    });
}

function openPatientModal(name) {
    const modal = document.getElementById('patientModal');
    document.getElementById('report-patient-name').innerText = name;

    // Reset fields
    document.getElementById('report-notes').value = '';
    document.getElementById('report-diagnosis').value = '';
    document.getElementById('report-rx').value = '';

    // Load from localStorage if exists
    const savedData = localStorage.getItem(`report_${name}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('report-notes').value = data.notes || '';
        document.getElementById('report-diagnosis').value = data.diagnosis || '';
        document.getElementById('report-rx').value = data.rx || '';
    }

    modal.classList.remove('hidden');
}

function closePatientModal() {
    document.getElementById('patientModal').classList.add('hidden');
}

function savePatientReport() {
    const name = document.getElementById('report-patient-name').innerText;
    const notes = document.getElementById('report-notes').value;
    const diagnosis = document.getElementById('report-diagnosis').value;
    const rx = document.getElementById('report-rx').value;

    const reportData = {
        notes,
        diagnosis,
        rx,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage for demo persistence
    localStorage.setItem(`report_${name}`, JSON.stringify(reportData));

    showToast("Report saved successfully");
    closePatientModal();
}

async function resolveAppointment(id) {
    if (!confirm("Mark this appointment as resolved? This will remove it from your active list.")) return;

    const { error } = await db.from('appointments').delete().eq('id', id);
    if (error) {
        showToast("Error resolving appointment");
        return;
    }

    showToast("Appointment resolved and archived.");
    await initDatabase();
    renderDoctorDashboard();
}

function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';
    state.appointments.forEach(app => {
        tbody.innerHTML += `
            <tr class="border-b border-slate-50">
                <td class="p-6 font-bold">${app.patient}</td>
                <td class="p-6 text-sm">${app.doctor}</td>
                <td class="p-6 text-xs font-bold text-blue-600">${app.date} / ${app.time}</td>
                <td class="p-6 text-right">
                    <button onclick="cancelApp(${app.id})" class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    document.getElementById('admin-empty').classList.toggle('hidden', state.appointments.length > 0);
}

// --- ASYNC ACTIONS (SUPABASE) ---

async function cancelApp(id) {
    // 1. Delete from Supabase
    const { error } = await db.from('appointments').delete().eq('id', id);

    if (error) {
        console.error("Delete failed:", error);
        showToast("Error removing appointment");
        return;
    }

    // 2. Refresh local data
    await initDatabase(); // Re-fetch to keep UI in sync

    // 3. Re-render Admin Table
    renderAdminTable();
    showToast("Appointment Removed");
}

// --- BOOKING ---
// 1. Generate Future Dates (Next 14 days)
function renderDateOptions() {
    const container = document.getElementById('date-picker-container');
    container.innerHTML = '';

    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Start from tomorrow (i=1)
    for (let i = 1; i <= 14; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);

        const dateStr = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const dayName = days[futureDate.getDay()];
        const dayNum = futureDate.getDate();

        const btn = document.createElement('button');
        btn.className = `min-w-[70px] h-[80px] rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-1 transition-all snap-start hover:border-blue-400 focus:outline-none date-card`;
        btn.onclick = () => selectDate(btn, dateStr);

        btn.innerHTML = `
            <span class="text-xs font-medium text-slate-400 pointer-events-none">${dayName}</span>
            <span class="text-xl font-bold text-slate-800 pointer-events-none">${dayNum}</span>
        `;

        container.appendChild(btn);
    }
}

// 2. Generate Time Slots
function renderTimeOptions() {
    const container = document.getElementById('time-picker-container');
    container.innerHTML = '';

    const selectedDate = document.getElementById('selected-date-value').value;
    const selectedDoctor = state.selectedDoctor;

    // Simple business hours array
    const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"];

    // Find already booked slots for this doctor on this date
    const bookedSlots = state.appointments
        .filter(app => app.doctor === selectedDoctor.name && app.date === selectedDate)
        .map(app => app.time ? app.time.substring(0, 5) : ""); // Normalize HH:MM:SS to HH:MM with safety check

    times.forEach(time => {
        const isBooked = bookedSlots.includes(time);
        const btn = document.createElement('button');

        if (isBooked) {
            btn.className = `py-2 rounded-xl border border-slate-100 bg-slate-50 text-sm font-semibold text-slate-300 cursor-not-allowed time-card`;
            btn.disabled = true;
            btn.innerHTML = `${time}`;
        } else {
            btn.className = `py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer time-card bg-white`;
            btn.innerText = time;
            btn.onclick = () => selectTime(btn, time);
        }

        container.appendChild(btn);
    });
}

// 3. Selection Handlers
function selectDate(el, value) {
    // Reset all
    document.querySelectorAll('.date-card').forEach(c => {
        c.className = "min-w-[70px] h-[80px] rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-1 transition-all snap-start hover:border-blue-400 cursor-pointer date-card bg-white";
        c.querySelector('span:first-child').className = "text-xs font-medium text-slate-400";
        c.querySelector('span:last-child').className = "text-xl font-bold text-slate-800";
    });

    // Set Active
    el.className = "min-w-[70px] h-[80px] rounded-2xl border-2 border-blue-600 bg-blue-50 flex flex-col items-center justify-center gap-1 transition-all snap-start cursor-pointer date-card shadow-sm";
    el.querySelector('span:first-child').className = "text-xs font-bold text-blue-600";
    el.querySelector('span:last-child').className = "text-xl font-bold text-blue-700";

    document.getElementById('selected-date-value').value = value;

    // Re-render time options because availability depends on the date
    renderTimeOptions();
}

function selectTime(el, value) {
    // Reset all
    document.querySelectorAll('.time-card').forEach(c => {
        c.className = "py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer time-card bg-white";
    });

    // Set Active
    el.className = "py-2 rounded-xl border-2 border-blue-600 bg-blue-600 text-white text-sm font-bold shadow-md transition-all cursor-pointer time-card";

    document.getElementById('selected-time-value').value = value;
}

// --- UPDATED BOOKING FUNCTIONS ---

function openModal(id) {
    state.selectedDoctor = state.doctors.find(d => d.id === id);
    document.getElementById('modal-doc-name').innerText = state.selectedDoctor.name;
    document.getElementById('modal-doc-specialty').innerText = state.selectedDoctor.specialty;

    // Clear previous inputs
    document.getElementById('form-name').value = '';
    document.getElementById('selected-date-value').value = '';
    document.getElementById('selected-time-value').value = '';

    // Render the pickers
    renderDateOptions();
    renderTimeOptions();

    document.getElementById('bookingModal').classList.remove('hidden');
}

function closeModal() { document.getElementById('bookingModal').classList.add('hidden'); }

async function submitBooking() {
    const name = document.getElementById('form-name').value;
    // Get values from hidden inputs
    const date = document.getElementById('selected-date-value').value;
    const time = document.getElementById('selected-time-value').value;

    if (!name || !date || !time) return showToast("Please select a date, time, and enter name");

    // Insert into Supabase
    const { error } = await db.from('appointments').insert([{
        patient_name: name,
        doctor_name: state.selectedDoctor.name,
        specialty: state.selectedDoctor.specialty,
        date_booked: date,
        time_booked: time
    }]);

    if (error) {
        console.error("Booking failed:", error);
        showToast("Booking Failed: " + error.message);
        return;
    }

    showToast("Match Confirmed! Doctor notified.");
    closeModal();
    await initDatabase();
}

function showToast(msg, options = {}) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastTitle = document.getElementById('toast-title');
    const toastIcon = document.getElementById('toast-icon');
    const toastIconBg = document.getElementById('toast-icon-bg');
    const toastActions = document.getElementById('toast-actions');
    const btnOk = document.getElementById('toast-ok');
    const btnCancel = document.getElementById('toast-cancel');

    // Reset classes
    toastIconBg.className = "flex h-8 w-8 items-center justify-center rounded-full";
    toastActions.classList.add('hidden');

    // Set content
    toastMsg.innerText = msg;
    toastTitle.innerText = options.title || (options.type === 'warning' ? 'Warning' : 'Success');

    if (options.type === 'warning') {
        toastIconBg.classList.add('bg-orange-50', 'text-orange-600');
        toastIcon.className = "fas fa-exclamation-triangle text-sm";
    } else {
        toastIconBg.classList.add('bg-blue-50', 'text-blue-600');
        toastIcon.className = "fas fa-check text-sm";
    }

    if (options.showButtons) {
        toastActions.classList.remove('hidden');
        btnOk.onclick = () => {
            if (options.onOk) options.onOk();
            hideToast();
        };
        btnCancel.onclick = () => {
            if (options.onCancel) options.onCancel();
            hideToast();
        };
    }

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('opacity-100', 'translate-y-0');
    }, 10);

    // Auto hide if no buttons
    if (!options.showButtons) {
        setTimeout(hideToast, 3000);
    }
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('opacity-100', 'translate-y-0');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 300);
}

// --- CLIENT-SIDE ROUTING ---

const routes = {
    '/': 'patient-section',
    '/doctor': 'login-section',
    '/admin': 'admin-section',
    '/dashboard': 'doctor-dashboard'
};

document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (link) {
        e.preventDefault();
        navigateTo(link.getAttribute('href'));
    }
});

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

function router() {
    const path = window.location.pathname;

    // Auth Guard
    if (path === '/admin' && (!state.currentUser || state.currentUser.role !== 'admin')) {
        if (!state.currentUser) {
            showToast("Access Denied: Please Login");
            return navigateTo('/doctor');
        }
    }

    if (path === '/dashboard' && !state.currentUser) {
        return navigateTo('/doctor');
    }

    document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));

    const targetId = routes[path] || 'patient-section';
    const targetSection = document.getElementById(targetId);

    if (targetSection) targetSection.classList.remove('hidden');

    updateNav(path);

    if (path === '/admin') renderAdminTable();
    if (path === '/dashboard') renderDoctorDashboard();
}

function updateNav(path) {
    ['patient', 'doctor', 'admin'].forEach(name => {
        const btn = document.getElementById(`nav-${name}`);
        if (btn) btn.className = "nav-link text-sm font-semibold px-4 py-2 rounded-lg transition-all text-slate-500 hover:bg-slate-100";
    });

    let activeName = 'patient';
    if (path.includes('doctor') || path.includes('dashboard')) activeName = 'doctor';
    if (path.includes('admin')) activeName = 'admin';

    const activeBtn = document.getElementById(`nav-${activeName}`);
    if (activeBtn) activeBtn.className = "nav-link text-sm font-semibold px-4 py-2 rounded-lg transition-all text-blue-600 bg-blue-50";
}

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    initDatabase().then(() => {
        router();
    });
});