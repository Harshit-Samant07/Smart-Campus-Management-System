document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = '';
    
    try {
        const formData = new FormData(e.target);
        const response = await fetch('http://localhost:5000/api/students/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('student', JSON.stringify(data.student));
            window.location.href = './student-dashboard.html';
        } else {
            errorElement.textContent = data.message || 'Invalid email or password';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorElement.textContent = 'Server error. Please try again later.';
        errorElement.style.display = 'block';
    }
});

// Add password toggle functionality
document.querySelector('.toggle-password').addEventListener('click', function() {
    const passwordInput = document.querySelector('input[type="password"]');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Prevent direct access to dashboard
if (!localStorage.getItem('token')) {
    window.location.href = '/frontend/student-login.html';
}
