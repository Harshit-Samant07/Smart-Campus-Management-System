document.addEventListener('DOMContentLoaded', () => {
    // Highlight current page in sidebar
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });

    initializeAdminDashboard();
});

async function initializeAdminDashboard() {
    await loadStats();
    await loadStudents();
    setupEventListeners();
}

async function loadStats() {
    try {
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();
        
        document.getElementById('studentCount').textContent = stats.studentCount;
        document.getElementById('facultyCount').textContent = stats.facultyCount;
        document.getElementById('departmentCount').textContent = stats.departments.length;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadStudents() {
    try {
        const response = await fetch('/api/admin/students');
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayStudents(students) {
    const tbody = document.getElementById('studentsList');
    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>
                <button onclick="editStudent('${student._id}')" class="btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteStudent('${student._id}')" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showAddStudentForm() {
    const modal = document.getElementById('addStudentModal');
    modal.style.display = 'flex';
}

async function addStudent(formData) {
    try {
        const response = await fetch('/api/admin/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            await loadStudents();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error adding student:', error);
        return false;
    }
}

// Notice Management
async function showAddNoticeForm() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Add New Notice</h2>
            <form id="addNoticeForm">
                <div class="form-group">
                    <input type="text" name="title" placeholder="Notice Title" required>
                </div>
                <div class="form-group">
                    <textarea name="content" placeholder="Notice Content" required></textarea>
                </div>
                <div class="form-group">
                    <select name="department" required>
                        <option value="all">All Departments</option>
                        <option value="CS">Computer Science</option>
                        <option value="IT">Information Technology</option>
                        <option value="ME">Mechanical</option>
                        <option value="EC">Electronics</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Post Notice</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    setupNoticeForm(modal);
}

// Attendance Management
async function loadAttendance(date, className) {
    try {
        const response = await fetch(`/api/admin/attendance?date=${date}&class=${className}`);
        const attendance = await response.json();
        displayAttendance(attendance);
    } catch (error) {
        console.error('Error loading attendance:', error);
    }
}

function displayAttendance(attendance) {
    const tbody = document.getElementById('attendanceList');
    tbody.innerHTML = attendance.map(record => `
        <tr>
            <td>${record.rollNo}</td>
            <td>${record.name}</td>
            <td>${record.status}</td>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>
                <button onclick="editAttendance('${record._id}')" class="btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Add notification handling
function setupNotifications() {
    const notificationIcon = document.querySelector('.notifications');
    notificationIcon?.addEventListener('click', () => {
        showNotificationsPanel();
    });
}

function showNotificationsPanel() {
    const panel = document.createElement('div');
    panel.className = 'notifications-panel animate-slide';
    panel.innerHTML = `
        <h3>Notifications</h3>
        <div class="notification-list">
            <div class="notification-item">
                <i class="fas fa-user-plus"></i>
                <div class="notification-content">
                    <p>New student registration</p>
                    <small>2 minutes ago</small>
                </div>
            </div>
            <!-- Add more notifications -->
        </div>
    `;
    document.body.appendChild(panel);
}

// Add profile menu
function setupProfileMenu() {
    const profileMenu = document.querySelector('.profile-menu');
    profileMenu?.addEventListener('click', toggleProfileMenu);
}

function toggleProfileMenu() {
    // Implementation for profile menu toggle
}

function setupEventListeners() {
    // Add student form submission
    document.getElementById('addStudentForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const success = await addStudent(Object.fromEntries(formData));
        if (success) {
            document.getElementById('addStudentModal').style.display = 'none';
            e.target.reset();
        }
    });

    // Tab switching
    document.querySelectorAll('.sidebar a[data-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            showTab(tab.dataset.tab);
        });
    });

    // Search functionality
    document.getElementById('studentSearch')?.addEventListener('input', (e) => {
        filterStudents(e.target.value);
    });

    // Logout
    document.getElementById('logout').addEventListener('click', () => {
        window.location.href = 'admin-login.html';
    });

    // Attendance Filters
    document.getElementById('classFilter')?.addEventListener('change', (e) => {
        loadAttendance(document.getElementById('dateFilter').value, e.target.value);
    });

    document.getElementById('dateFilter')?.addEventListener('change', (e) => {
        loadAttendance(e.target.value, document.getElementById('classFilter').value);
    });

    // Close Modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    setupNotifications();
    setupProfileMenu();

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.querySelector('i').classList.toggle('fa-sun');
    });

    // Notification Dropdown
    const notificationBtn = document.querySelector('.notifications');
    notificationBtn?.addEventListener('click', () => {
        const dropdown = notificationBtn.querySelector('.notifications-dropdown');
        dropdown.classList.toggle('show');
    });

    // Profile Menu
    const profileMenu = document.querySelector('.profile-menu');
    profileMenu?.addEventListener('click', () => {
        profileMenu.classList.toggle('active');
    });

    // Add hover effect to stats cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ...add more admin control functions...
