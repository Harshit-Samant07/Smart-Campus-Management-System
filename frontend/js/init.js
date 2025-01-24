document.addEventListener('DOMContentLoaded', function() {
    // Check if system is initialized
    if (!localStorage.getItem('ims_initialized')) {
        console.log('Initializing IMS system...');
        
        // Initialize DataStore
        DataStore.initializeData();
        
        // Set initialization flag
        localStorage.setItem('ims_initialized', 'true');
        
        // Set initial admin credentials
        console.log('Default Admin Credentials:', {
            id: 'ADMIN001',
            password: 'admin123'
        });
        
        console.log('Default Student Credentials:', {
            id: '2021CSE001',
            password: 'student123'
        });
    }

    // Check for expired sessions
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    if (token) {
        const decoded = JSON.parse(atob(token));
        if (decoded.exp < Date.now()) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/frontend/student-login.html') {
                window.location.href = '/frontend/student-login.html';
            }
        }
    }
    
    if (adminToken) {
        const decoded = JSON.parse(atob(adminToken));
        if (decoded.exp < Date.now()) {
            localStorage.removeItem('adminToken');
            if (window.location.pathname !== '/frontend/admin-login.html') {
                window.location.href = '/frontend/admin-login.html';
            }
        }
    }
});
