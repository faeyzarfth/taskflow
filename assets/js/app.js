// Inisialisasi Firebase
const auth = firebase.auth();
const db = firebase.database();

// Membuat aplikasi Vue
const app = Vue.createApp({
    data() {
        return {
            currentView: 'loading',
            user: null,
            loginForm: { email: '', password: '' },
            registerForm: { name: '', email: '', password: '', role: '' },
            assignments: {},
            submissions: {},
            users: {}
        };
    },
    methods: {
        // ... (Fungsi handleLogin, handleRegister, handleLogout tetap sama)
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
                    this.currentView = 'login';
                })
                .catch(error => alert("Registrasi Gagal: " + error.message));
        },
        handleLogout() {
            auth.signOut();
        }
    },
    mounted() {
        auth.onAuthStateChanged(user => {
            this.currentView = 'loading';
            if (user) {
                db.ref('users/' + user.uid).once('value', snapshot => {
                    this.user = {
                        uid: user.uid,
                        email: user.email,
                        profile: snapshot.val()
                    };
                    if (this.user.profile.role === 'Guru') {
                        this.currentView = 'teacherDashboard';
                    } else {
                        this.currentView = 'studentDashboard';
                    }
                });
            } else {
                this.user = null;
                this.currentView = 'login';
            }
        });
    }
});

// Pindahkan template HTML ke dalam #app di index.html
// dan mount aplikasi Vue ke elemen #app
app.mount('#app');