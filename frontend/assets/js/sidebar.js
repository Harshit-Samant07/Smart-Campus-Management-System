document.addEventListener('DOMContentLoaded', async () => {
    // Load sidebar
    const sidebarDiv = document.getElementById('sidebar');
    const response = await fetch('../assets/components/sidebar.html');
    const html = await response.text();
    sidebarDiv.innerHTML = html;

    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
    document.querySelector(`[data-page="${currentPage}"]`)?.classList.add('active');

    // Logout handler
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/student-login.html';
    });

    // Auth check
    if (!localStorage.getItem('token')) {
        window.location.href = '/student-login.html';
    }
});
