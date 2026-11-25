
// ===================================
// HEALTH CENTER QUEUE SYSTEM
// ===================================

// Load saved information
let patients = JSON.parse(
    localStorage.getItem("healthPatients") || "[]"
);

let queueCounter = Number(
    localStorage.getItem("queueCounter") || 1
);

let currentPatientId =
    localStorage.getItem("currentPatientId") || null;

// Save information
function saveData() {
    localStorage.setItem(
        "healthPatients",
        JSON.stringify(patients)
    );

    localStorage.setItem(
        "queueCounter",
        queueCounter
    );

    localStorage.setItem(
        "currentPatientId",
        currentPatientId || ""
    );
}

// Get current patient
function getCurrentPatient() {
    return patients.find(
        p => p.id === currentPatientId &&
             p.status === "Serving"
    ) || null;
}

// ===================================
// NAVIGATION
// ===================================

document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", function() {

        document.querySelectorAll(".nav-btn")
            .forEach(btn => btn.classList.remove("active"));

        document.querySelectorAll(".page")
            .forEach(page => page.classList.remove("active"));

        this.classList.add("active");

        document.getElementById(
            this.dataset.page
        ).classList.add("active");

        updateDashboard();
    });
});

// ===================================
// PATIENT REGISTRATION
// ===================================

document.getElementById("patientForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("patientName")
        .value.trim();

    const age = Number(
        document.getElementById("patientAge").value
    );

    const gender = document.getElementById("patientGender")
        .value;

    const service = document.getElementById("patientService")
        .value;

    if (!name || age < 1 || age > 120 ||
        !gender || !service) {
        alert("Please enter valid patient information.");
        return;
    }

    const number = "HC-" +
        String(queueCounter).padStart(3, "0");

    const patient = {
        id: Date.now().toString() + "-" + queueCounter,
        number: number,
        name: name,
        age: age,
        gender: gender,
        service: service,
        status: "Waiting",
        date: new Date().toLocaleDateString()
    };

    patients.push(patient);
    queueCounter++;

    saveData();

    const ticket = document.getElementById("ticket");

    ticket.classList.remove("hidden");

    ticket.innerHTML = `
        <h3>Registration Successful!</h3>
        <h1>${patient.number}</h1>
        <p><strong>${escapeHTML(patient.name)}</strong></p>
        <p>Service: ${escapeHTML(patient.service)}</p>
        <p>Status: Waiting</p>
        <p>Please wait for your number to be called.</p>
    `;

    this.reset();

    updateDashboard();
});

// Prevent user-provided text from becoming HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// ===================================
// ADMIN: CALL NEXT PATIENT
// ===================================

document.getElementById("nextBtn")
.addEventListener("click", function() {

    if (getCurrentPatient()) {
        alert("Please complete or skip the current patient first.");
        return;
    }

    const nextPatient = patients.find(
        patient => patient.status === "Waiting"
    );

    if (!nextPatient) {
        alert("There are no patients waiting.");
        return;
    }

    nextPatient.status = "Serving";

    currentPatientId = nextPatient.id;

    saveData();
    updateDashboard();

    alert("Now serving " + nextPatient.number);
});

// ===================================
// ADMIN: COMPLETE PATIENT
// ===================================

document.getElementById("completeBtn")
.addEventListener("click", function() {

    const patient = getCurrentPatient();

    if (!patient) {
        alert("No patient is currently being served.");
        return;
    }

    patient.status = "Completed";
    patient.completedAt = new Date().toISOString();

    currentPatientId = null;

    saveData();
    updateDashboard();

    alert(patient.name + " has completed the service.");
});

// ===================================
// ADMIN: SKIP PATIENT
// ===================================

document.getElementById("skipBtn")
.addEventListener("click", function() {

    const patient = getCurrentPatient();

    if (!patient) {
        alert("No patient is currently being served.");
        return;
    }

    if (!confirm("Skip " + patient.name + "?")) {
        return;
    }

    patient.status = "Skipped";
    currentPatientId = null;

    saveData();
    updateDashboard();

    alert("Patient has been skipped.");
});

// ===================================
// UPDATE DASHBOARD
// ===================================

function updateDashboard() {

    const current = getCurrentPatient();

    const waiting = patients.filter(
        p => p.status === "Waiting"
    );

    const completed = patients.filter(
        p => p.status === "Completed"
    );

    // Statistics
    document.getElementById("totalPatients")
        .textContent = patients.length;

    document.getElementById("waitingPatients")
        .textContent = waiting.length;

    document.getElementById("completedPatients")
        .textContent = completed.length;

    // Current queue number
    document.getElementById("patientNowServing")
        .textContent = current ? current.number : "---";

    document.getElementById("adminNowServing")
        .textContent = current ? current.number : "---";

    document.getElementById("servingName")
        .textContent = current
        ? current.name + " - " + current.service
        : "No patient currently serving.";

    document.getElementById("patientWaitingCount")
        .textContent = waiting.length;

    // Patient table
    displayPatients();

}

// ===================================
// DISPLAY PATIENT TABLE
// ===================================
function displayPatients() {

    const search = document.getElementById("searchPatient")
        .value.toLowerCase().trim();

    const table = document.getElementById("patientTable");

    const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(search) ||
        patient.number.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5">No patients found.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = filtered.map(patient => `
        <tr>
            <td>${escapeHTML(patient.number)}</td>
            <td>${escapeHTML(patient.name)}</td>
            <td>${patient.age}</td>
            <td>${escapeHTML(patient.service)}</td>
            <td>
                <span class="status ${patient.status}">
                    ${patient.status}
                </span>
            </td>
        </tr>
    `).join("");
}

// Search patients
document.getElementById("searchPatient")
.addEventListener("input", displayPatients);

// ===================================
// RESET DAILY QUEUE
// ===================================

document.getElementById("resetBtn")
.addEventListener("click", function() {

    if (!confirm(
        "Are you sure you want to delete all queue records?"
    )) {
        return;
    }

    patients = [];
    queueCounter = 1;
    currentPatientId = null;

    saveData();

    document.getElementById("ticket")
        .classList.add("hidden");

    updateDashboard();

    alert("Daily queue has been reset.");
});

// ===================================
// INITIALIZE APPLICATION
// ===================================

updateDashboard();
