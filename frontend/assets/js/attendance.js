document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../student-login.html';
        return;
    }

    showLoading(true);
    try {
        const response = await fetch('http://localhost:5000/api/students/attendance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            updateAttendanceVisuals(data);
            populateAttendanceTable(data.records);
            setupFilters(data);
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load attendance data');
    }
    showLoading(false);
});

function updateAttendanceVisuals(data) {
    // Update overall attendance donut
    createDonutChart(data.summary);
    
    // Update monthly trend
    createMonthlyChart(data.monthly);
    
    // Update subject-wise stats
    createSubjectStats(data.subjects);
}

function createDonutChart(summary) {
    const ctx = document.getElementById('attendanceDonut').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                data: [summary.present, summary.total - summary.present],
                backgroundColor: ['#4ecdc4', '#ff6b6b'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    document.getElementById('overallPercentage').textContent = 
        `${((summary.present / summary.total) * 100).toFixed(1)}%`;
    document.getElementById('attendanceRatio').textContent = 
        `${summary.present} / ${summary.total} Classes`;
}

function createMonthlyChart(monthlyData) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.map(d => d.month),
            datasets: [{
                label: 'Attendance %',
                data: monthlyData.map(d => d.percentage),
                borderColor: '#4ecdc4',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(78, 205, 196, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function createSubjectStats(subjects) {
    const container = document.getElementById('subjectStats');
    container.innerHTML = subjects.map(subject => `
        <div class="subject-item">
            <div class="subject-bar">
                <div class="progress" style="width: ${subject.percentage}%">
                    <span class="label">${subject.name} - ${subject.percentage}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

function populateAttendanceTable(records) {
    const tbody = document.getElementById('attendanceData');
    tbody.innerHTML = records.map(record => `
        <tr class="${record.status.toLowerCase()}">
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.subject}</td>
            <td>${record.time}</td>
            <td>
                <span class="status-badge ${record.status.toLowerCase()}">
                    ${record.status}
                </span>
            </td>
            <td>${record.teacher}</td>
        </tr>
    `).join('');
}

// ... helper functions for loading, error handling, and filters ...
