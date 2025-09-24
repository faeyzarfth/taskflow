// Referensi ke layanan Auth yang sudah diinisialisasi di index.html
const auth = firebase.auth();

const loginButton = document.getElementById('loginButton');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Harap isi email dan password Anda.");
        return;
    }

    console.log("Mencoba login dengan email:", email);

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Login Berhasil!", userCredential.user);
            alert("Selamat datang kembali!");
            
            // Arahkan ke dasbor guru setelah login berhasil
            // Ganti 'manage-tasks.html' jika halaman utama guru Anda berbeda
            window.location.href = "manage-tasks.html";
        })
        .catch((error) => {
            console.error("Login Gagal:", error.message);
            alert("Error: " + error.message);
        });
});