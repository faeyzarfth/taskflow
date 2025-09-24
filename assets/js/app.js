// Inisialisasi Firebase
const auth = firebase.auth();
const db = firebase.database();

// Membuat aplikasi Vue
const app = Vue.createApp({
    // --- DATA ---
    // Di sinilah semua data reaktif aplikasi disimpan
    data() {
        return {
            currentView: 'loading', // Tampilan yang sedang aktif
            user: null, // Data pengguna yang login
            loginForm: { email: '', password: '' },
            registerForm: { name: '', email: '', password: '', role: '' }
        };
    },
    // --- METHODS ---
    // Di sinilah semua fungsi/logika aplikasi ditempatkan
    methods: {
        handleLogin() {
            auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
                .catch(error => alert("Login Gagal: " + error.message));
        },
        handleRegister() {
            const form = this.registerForm;
            if (!form.name || !form.role || !form.email || !form.password) {
                return alert("Harap isi semua kolom.");
            }
            auth.createUserWithEmailAndPassword(form.email, form.password)
                .then(cred => db.ref('users/' + cred.user.uid).set({ name: form.name, email: form.email, role: form.role }))
                .then(() => {
                    alert("Registrasi berhasil! Silakan login.");
                    this.currentView = 'login'; // Pindahkan ke halaman login
                })
                .catch(error => alert("Registrasi Gagal: " + error.message));
        },
        handleLogout() {
            auth.signOut();
        }
    },
    // --- LIFECYCLE HOOK ---
    // Kode di sini akan berjalan saat aplikasi Vue siap
    mounted() {
        auth.onAuthStateChanged(user => {
            if (user) {
                // Pengguna Login
                db.ref('users/' + user.uid).once('value', snapshot => {
                    this.user = {
                        uid: user.uid,
                        email: user.email,
                        profile: snapshot.val()
                    };
                    // Arahkan ke dasbor yang sesuai
                    if (this.user.profile.role === 'Guru') {
                        this.currentView = 'teacherDashboard';
                    } else {
                        this.currentView = 'studentDashboard';
                    }
                });
            } else {
                // Pengguna Logout
                this.user = null;
                this.currentView = 'login';
            }
        });
    }
});

// Menghubungkan aplikasi Vue ke elemen #app di HTML
app.mount('#app');