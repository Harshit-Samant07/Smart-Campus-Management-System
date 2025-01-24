document.addEventListener('DOMContentLoaded', () => {
    loadStudentRecords();
    setupEventListeners();
});

async function loadStudentRecords() {
    try {
        const response = await fetch('/api/admin/student-records');
        const students = await response.json();
        displayStudentRecords(students);
    } catch (error) {
        console.error('Error loading student records:', error);
    }
}

function displayStudentRecords(students) {
    const container = document.getElementById('studentRecordsContainer');
    container.innerHTML = students.map(student => `
        <div class="student-record-card" onclick="showStudentDetails('${student._id}')">
            <div class="student-info">
                <h3>${student.name}</h3>
                <p class="student-id">${student.rollNo}</p>
                <p class="department">${student.department}</p>
            </div>
            <div class="quick-stats">
                <div class="stat">
                    <label>Attendance</label>
                    <span>${student.attendance}%</span>
                </div>
                <div class="stat">
                    <label>CGPA</label>
                    <span>${student.cgpa || 'N/A'}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-view" onclick="viewDetails('${student._id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-edit" onclick="editRecord('${student._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-download" onclick="downloadRecord('${student._id}')">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function showStudentDetails(studentId) {
    // Implementation for showing detailed student information
}

// Add other necessary functions for filtering, sorting, and CRUD operations
