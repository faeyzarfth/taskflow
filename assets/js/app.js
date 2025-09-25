import { createApp } from 'https://unpkg.com/vue@3/dist/vue.global.prod.js';
import { showAppToast, formatDate, isValidUrl } from './utils.js';
import { monitorAuthState, registerStudent, loginUser, logoutUser } from './auth.js';
import * as studentApi from './student.js';
import * as adminApi from './admin.js';

const app = createApp({
    data() {
        return {
            currentView: 'login', // 'login', 'studentDashboard', 'adminDashboard'
            isLoading: true,
            currentUser: null,
            toast: { title: '', message: '', icon: '' },
            
            // Forms
            loginForm: { email: '', password: '' },
            registerForm: { email: '', password: '', fullName: '', studentClass: '' },
            
            // Modals
            showRegister: false,
            showSubmissionModal: false,
            showAssignmentModal: false,

            // Student Data
            studentAssignments: [],
            studentSubmissions: [],
            submissionForm: { assignment: null, link: '', notes: '' },
            
            // Admin Data
            adminSection: 'overview', // 'overview', 'assignments', 'students', 'submissions'
            assignments: [],
            students: [],
            submissions: [],
            assignmentForm: { id: null, title: '', subject: '', description: '', targetClass: '', deadline: '' },

            // Real-time listeners
            listeners: []
        }
    },
    computed: {
        studentStats() {
            const total = this.studentAssignments.length;
            const completed = this.studentSubmissions.length;
            return {
                total,
                completed,
                pending: total - completed
            };
        }
    },
    methods: {
        formatDate, // make it available in template
        // -- AUTHENTICATION --
        handleLogin() {
            this.isLoading = true;
            loginUser(this.loginForm.email, this.loginForm.password)
                .catch(err => {
                    showAppToast(err.message, 'error');
                    this.isLoading = false;
                });
        },
        handleRegister() {
            this.isLoading = true;
            registerStudent(this.registerForm)
                .then(() => {
                    showAppToast('Pendaftaran berhasil! Silakan login.');
                    this.showRegister = false;
                    this.registerForm = { email: '', password: '', fullName: '', studentClass: '' };
                })
                .catch(err => showAppToast(err.message, 'error'))
                .finally(() => this.isLoading = false);
        },
        handleLogout() {
            logoutUser();
        },
        cleanupListeners() {
            this.listeners.forEach(unsubscribe => unsubscribe());
            this.listeners = [];
        },

        // -- STUDENT DASHBOARD --
        isSubmitted(assignmentId) {
            return this.studentSubmissions.some(sub => sub.assignmentId === assignmentId);
        },
        getAssignmentStatus(assignmentId) {
            if(this.isSubmitted(assignmentId)) {
                return { text: 'Selesai', badgeClass: 'bg-success'};
            }
            // Add overdue logic here if needed
            return { text: 'Belum Selesai', badgeClass: 'bg-warning'};
        },
        openSubmissionModal(assignment) {
            this.submissionForm.assignment = assignment;
            this.showSubmissionModal = true;
        },
        closeSubmissionModal() {
            this.showSubmissionModal = false;
            this.submissionForm = { assignment: null, link: '', notes: '' };
        },
        handleSubmission() {
            if (!isValidUrl(this.submissionForm.link)) {
                return showAppToast('URL yang Anda masukkan tidak valid.', 'error');
            }
            this.isLoading = true;
            const data = {
                assignmentId: this.submissionForm.assignment.id,
                userId: this.currentUser.uid,
                link: this.submissionForm.link,
                notes: this.submissionForm.notes,
                studentName: this.currentUser.fullName,
                studentClass: this.currentUser.studentClass,
            };
            studentApi.submitAssignment(data)
                .then(() => {
                    showAppToast('Tugas berhasil dikumpulkan!');
                    this.closeSubmissionModal();
                })
                .catch(err => showAppToast(err.message, 'error'))
                .finally(() => this.isLoading = false);
        },
        
        // -- ADMIN DASHBOARD --
        openAssignmentModal(assignment = null) {
            if (assignment) {
                // Editing existing assignment
                const deadlineDate = assignment.deadline.toDate ? assignment.deadline.toDate() : new Date();
                this.assignmentForm = {
                    id: assignment.id,
                    title: assignment.title,
                    subject: assignment.subject,
                    description: assignment.description,
                    targetClass: assignment.targetClass,
                    deadline: deadlineDate.toISOString().split('T')[0] // Format for input[type=date]
                };
            } else {
                // Creating new one
                this.assignmentForm = { id: null, title: '', subject: '', description: '', targetClass: '', deadline: '' };
            }
            this.showAssignmentModal = true;
        },
        closeAssignmentModal() {
            this.showAssignmentModal = false;
        },
        handleSaveAssignment() {
            this.isLoading = true;
            const dataToSave = {
                ...this.assignmentForm,
                deadline: new Date(this.assignmentForm.deadline) // Convert back to Date object for Firebase
            };
            
            let promise;
            if (dataToSave.id) {
                // Update
                const id = dataToSave.id;
                delete dataToSave.id;
                promise = adminApi.updateAssignment(id, dataToSave);
            } else {
                // Create
                delete dataToSave.id;
                promise = adminApi.createAssignment(dataToSave);
            }
            
            promise.then(() => {
                showAppToast('Tugas berhasil disimpan.');
                this.closeAssignmentModal();
            })
            .catch(err => showAppToast(err.message, 'error'))
            .finally(() => this.isLoading = false);
        },
        handleDeleteAssignment(id) {
            if(confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
                this.isLoading = true;
                adminApi.deleteAssignment(id)
                    .then(() => showAppToast('Tugas berhasil dihapus.'))
                    .catch(err => showAppToast(err.message, 'error'))
                    .finally(() => this.isLoading = false);
            }
        }
    },
    created() {
        monitorAuthState(user => {
            this.cleanupListeners(); // Clear previous listeners on auth state change
            if (user) {
                this.currentUser = user;
                if (user.role === 'admin') {
                    this.currentView = 'adminDashboard';
                    // Setup admin listeners
                    this.listeners.push(adminApi.getAllAssignments(data => this.assignments = data));
                    // Add other admin listeners here (students, submissions)
                } else {
                    this.currentView = 'studentDashboard';
                    // Setup student listeners
                    this.listeners.push(studentApi.getAssignments(user.studentClass, data => this.studentAssignments = data));
                    this.listeners.push(studentApi.getSubmissions(user.uid, data => this.studentSubmissions = data));
                }
            } else {
                this.currentUser = null;
                this.currentView = 'login';
            }
            this.loginForm = { email: '', password: '' };
            this.isLoading = false;
        });
    }
});

// Mount the app and make it globally accessible for utils
window.app = app.mount('#app');
