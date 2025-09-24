// --- Referensi Utama ---
const auth = firebase.auth();
const db = firebase.database();
const appContent = document.getElementById('app-content');
const appNav = document.getElementById('app-nav');

// --- Pustaka Tampilan (HTML Templates) ---
const views = {
    loading: `<div class="container"><p>Memuat aplikasi...</p></div>`,
    login: `
        <div class="container">
            <h2>Login ke Akun Anda</h2>
            <input type="email" id="email" placeholder="Masukkan Email" required>
            <input type="password" id="password" placeholder="Masukkan Password" required>
            <button id="loginButton">Login</button>
            <p style="text-align: center; margin-top: 1rem;">
                Belum punya akun? <a href="#" onclick="navigateTo('register')">Daftar di sini</a>
            </p>
        </div>
    `,
    register: `
        <div class="container">
            <h2>Daftar Akun Baru</h2>
            <input type="text" id="name" placeholder="Nama Lengkap" required>
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password (min. 6 karakter)" required>
            <select id="role" required>
                <option value="" disabled selected>Pilih Peran Anda</option>
                <option value="Guru">Guru</option>
                <option value="Siswa">Siswa</option>
            </select>
            <button id="registerButton">Daftar</button>
            <p style="text-align: center; margin-top: 1rem;">
                Sudah punya akun? <a href="#" onclick="navigateTo('login')">Login di sini</a>
            </p>
        </div>
    `,
    teacherDashboard: `
        <div class="container" style="width: 800px; max-width: 90%;">
            <h2>Kelola Tugas</h2>
            <div id="taskList">Memuat tugas...</div>
        </div>
    `,
    studentDashboard: `
        <div class="container" style="width: 800px; max-width: 90%;">
            <h2>Tugas Anda</h2>
            <div id="taskList">Memuat tugas...</div>
        </div>
    `
};

// --- Fungsi Inisialisasi untuk Setiap Tampilan ---

function initLoginPage() {
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (!email || !password) return alert("Harap isi semua kolom.");
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => alert("Login Gagal: " + error.message));
    });
}

function initRegisterPage() {
    const registerButton = document.getElementById('registerButton');
    registerButton.addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        if (!name || !role || !email || !password) return alert("Harap isi semua kolom.");

        auth.createUserWithEmailAndPassword(email, password)
            .then(cred => db.ref('users/' + cred.user.uid).set({ name, email, role }))
            .then(() => {
                alert("Registrasi berhasil! Silakan login.");
                navigateTo('login');
            })
            .catch(error => alert("Registrasi Gagal: " + error.message));
    });
}

function initTeacherDashboard() {
    window.editTask = (taskId) => {
        const newTitle = prompt("Masukkan judul baru:", "");
        if (newTitle) db.ref('assignments/' + taskId).update({ title: newTitle });
    };
    window.deleteTask = (taskId, taskTitle) => {
        if (confirm(`Yakin ingin menghapus "${taskTitle}"?`)) db.ref('assignments/' + taskId).remove();
    };

    const taskListDiv = document.getElementById('taskList');
    db.ref('assignments').on('value', snapshot => {
        taskListDiv.innerHTML = '';
        const assignments = snapshot.val();
        if (assignments) {
            for (let taskId in assignments) {
                const task = assignments[taskId];
                const taskElement = document.createElement('div');
                taskElement.className = 'task-item';
                taskElement.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <small>Tenggat: ${task.dueDate}</small>
                    <div class="actions" style="margin-top: 1rem;">
                        <button onclick="editTask('${taskId}')">Edit</button>
                        <button onclick="deleteTask('${taskId}', '${task.title}')" style="background-color: #dc3545; margin-left: 0.5rem;">Hapus</button>
                    </div>
                `;
                taskListDiv.appendChild(taskElement);
            }
        } else {
            taskListDiv.innerHTML = '<p>Belum ada tugas.</p>';
        }
    });
}

function initStudentDashboard() {
    window.submitTask = (taskId) => {
        const currentUser = auth.currentUser;
        const link = prompt("Masukkan link tugas dari Google Drive (pastikan sudah di-share):", "https://");
        if (link && link !== "https://") {
            db.ref('submissions').push({
                assignmentId: taskId,
                studentId: currentUser.uid,
                submissionLink: link,
                submittedAt: firebase.database.ServerValue.TIMESTAMP
            }).then(() => alert("Tugas berhasil dikumpulkan!"));
        }
    };
    
    const taskListDiv = document.getElementById('taskList');
    const studentId = auth.currentUser.uid;
    
    db.ref('submissions').orderByChild('studentId').equalTo(studentId).on('value', subSnapshot => {
        const studentSubmissions = subSnapshot.val() || {};
        const submittedTaskIds = Object.values(studentSubmissions).map(sub => sub.assignmentId);

        db.ref('assignments').on('value', assignSnapshot => {
            taskListDiv.innerHTML = '';
            const assignments = assignSnapshot.val();
            if (assignments) {
                for (let taskId in assignments) {
                    const task = assignments[taskId];
                    const taskElement = document.createElement('div');
                    taskElement.className = 'task-item';
                    
                    let actionElement = '';
                    if (submittedTaskIds.includes(taskId)) {
                        actionElement = `<div style="margin-top: 1rem; color: #28a745; font-weight: bold;">Sudah Dikumpulkan</div>`;
                    } else {
                        actionElement = `<button onclick="submitTask('${taskId}')" style="margin-top: 1rem;">Kumpulkan Tugas</button>`;
                    }

                    taskElement.innerHTML = `
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <small>Tenggat: ${task.dueDate}</small>
                        ${actionElement}
                    `;
                    taskListDiv.appendChild(taskElement);
                }
            } else {
                taskListDiv.innerHTML = '<p>Hore, tidak ada tugas!</p>';
            }
        });
    });
}

// --- Router Utama ---
function navigateTo(path) {
    appContent.innerHTML = views[path];
    if (path === 'login') initLoginPage();
    if (path === 'register') initRegisterPage();
    if (path === 'teacherDashboard') initTeacherDashboard();
    if (path === 'studentDashboard') initStudentDashboard();
}

// --- Pengelola Status Login (Gatekeeper) ---
auth.onAuthStateChanged(user => {
    appContent.innerHTML = views.loading; // Tampilkan loading saat memeriksa status
    if (user) {
        appNav.innerHTML = `<button onclick="auth.signOut()">Logout</button>`;
        db.ref('users/' + user.uid).once('value', snapshot => {
            const userProfile = snapshot.val();
            if (userProfile && userProfile.role === 'Guru') {
                navigateTo('teacherDashboard');
            } else {
                navigateTo('studentDashboard');
            }
        });
    } else {
        appNav.innerHTML = '';
        navigateTo('login');
    }
});