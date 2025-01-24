document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/frontend/student-login.html';
        return;
    }

    // Load sidebar
    const sidebarContainer = document.getElementById('sidebar');
    try {
        const response = await fetch('/frontend/assets/components/sidebar.html');
        const html = await response.text();
        sidebarContainer.innerHTML = html;

        // Highlight current page
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
        document.querySelector(`[data-page="${currentPage}"]`)?.classList.add('active');

        // Add sidebar toggle functionality
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-sidebar';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.querySelector('.main-content').prepend(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
        });

        // Add logout functionality
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = '/frontend/student-login.html';
        });
    } catch (error) {
        console.error('Error loading sidebar:', error);
    }
});
