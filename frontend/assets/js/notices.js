document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../student-login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/students/notices', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch notices');
        
        const data = await response.json();
        renderNotices(data.notices);
        setupFilters(data.notices);
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading notices');
    }
});

function renderNotices(notices) {
    const container = document.getElementById('noticesContainer');
    container.innerHTML = notices.map(notice => `
        <div class="notice-card">
            <span class="notice-category ${notice.category.toLowerCase()}">
                ${notice.category}
            </span>
            <h3 class="notice-title">${notice.title}</h3>
            <div class="notice-date">
                <i class="far fa-calendar-alt"></i> 
                ${new Date(notice.date).toLocaleDateString()}
            </div>
            <p class="notice-content">${notice.content}</p>
            <div class="notice-footer">
                <a href="#" class="read-more" onclick="viewNoticeDetails('${notice._id}')">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
                <span class="notice-author">
                    <i class="far fa-user"></i> ${notice.author}
                </span>
            </div>
        </div>
    `).join('');
}

function setupFilters(notices) {
    const searchInput = document.getElementById('searchNotices');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');

    const filterNotices = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const dateRange = dateFilter.value;

        const filtered = notices.filter(notice => {
            const matchesSearch = notice.title.toLowerCase().includes(searchTerm) ||
                                notice.content.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || notice.category.toLowerCase() === category;
            const matchesDate = isWithinDateRange(notice.date, dateRange);
            
            return matchesSearch && matchesCategory && matchesDate;
        });

        renderNotices(filtered);
    };

    searchInput.addEventListener('input', filterNotices);
    categoryFilter.addEventListener('change', filterNotices);
    dateFilter.addEventListener('change', filterNotices);
}

function isWithinDateRange(date, range) {
    const noticeDate = new Date(date);
    const today = new Date();
    
    switch(range) {
        case 'today':
            return noticeDate.toDateString() === today.toDateString();
        case 'week':
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            return noticeDate >= weekAgo;
        case 'month':
            const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
            return noticeDate >= monthAgo;
        default:
            return true;
    }
}

function viewNoticeDetails(noticeId) {
    // Implement notice detail view functionality
    console.log('Viewing notice:', noticeId);
}
