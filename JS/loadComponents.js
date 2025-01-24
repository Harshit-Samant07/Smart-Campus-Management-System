async function loadSidebar() {
    try {
        const response = await fetch('../components/sidebar.html');
        const html = await response.text();
        document.querySelector('.dashboard-container').insertAdjacentHTML('afterbegin', html);
        
        // Set active page
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        const sidebarLinks = document.querySelectorAll('.sidebar a');
        
        sidebarLinks.forEach(link => {
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            }
        });

        // Setup logout handler
        document.getElementById('logout').addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../admin-login.html';
        });
    } catch (error) {
        console.error('Error loading sidebar:', error);
    }
}
