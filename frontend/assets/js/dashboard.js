document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        const student = JSON.parse(localStorage.getItem('student') || '{}');

        if (!token || !student) {
            throw new Error('Not authenticated');
        }

        console.log('Fetching data with token:', token);
        
        const response = await fetch('http://localhost:5000/api/students/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Dashboard data received:', result);

        if (!result.success || !result.data) {
            throw new Error(result.message || 'Invalid data received');
        }

        // Update the UI
        const mainContent = document.getElementById('mainContent');
        const loading = document.getElementById('loading');

        // Update student info
        document.querySelector('.student-info h1').textContent = `Welcome, ${result.data.student.name}`;
        document.querySelector('.student-details').innerHTML = `
            <span class="detail-item"><i class="fas fa-id-card"></i> ID: ${result.data.student.student_id}</span>
            <span class="detail-item"><i class="fas fa-user-circle"></i> Roll No: ${result.data.student.roll_no}</span>
        `;

        // Update stats
        updateStats(result.data.stats);
        // Update chart
        updateAttendanceChart(result.data.stats.attendance);
        // Update activities
        updateActivities(result.data.activities);

        // Show dashboard
        loading.style.display = 'none';
        mainContent.style.display = 'block';

    } catch (error) {
        console.error('Dashboard error:', error);
        alert('Error loading dashboard. Please login again.');
        localStorage.clear();
        window.location.href = './student-login.html';
    }
});

function updateStats(stats) {
    document.querySelector('.attendance-card .stat-info p').textContent = 
        `${stats.attendance.percentage.toFixed(1)}% Present`;
    document.querySelector('.stat-card:nth-child(2) .stat-info p').textContent = 
        `${stats.pendingAssignments} Pending`;
    document.querySelector('.stat-card:nth-child(3) .stat-info p').textContent = 
        stats.cgpa.toFixed(2);
}

function updateAttendanceChart(attendance) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                data: [attendance.percentage, 100 - attendance.percentage],
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: '70%'
        }
    });
}

function updateActivities(activities) {
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <i class="fas fa-${activity.icon}"></i>
            <div class="activity-info">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <small>${timeAgo(new Date(activity.timestamp))}</small>
            </div>
        </div>
    `).join('');
}

function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    return 'Just now';
}

// Add logout handler
document.querySelector('.sidebar-footer a').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = './student-login.html';
});
