document.addEventListener('DOMContentLoaded', () => {
    loadDepartments();
    loadDepartmentStats();
    setupEventListeners();
});

async function loadDepartments() {
    try {
        const response = await fetch('/api/admin/departments');
        const departments = await response.json();
        displayDepartments(departments);
    } catch (error) {
        console.error('Error loading departments:', error);
    }
}

function displayDepartments(departments) {
    const container = document.getElementById('departmentsContainer');
    container.innerHTML = departments.map(dept => `
        <div class="department-card animate-slide">
            <div class="department-header">
                <h3>${dept.name}</h3>
                <span class="department-code">${dept.code}</span>
            </div>
            <div class="department-body">
                <p>${dept.description}</p>
                <div class="department-stats">
                    <div class="stat-item">
                        <h4>Faculty</h4>
                        <p>${dept.facultyCount}</p>
                    </div>
                    <div class="stat-item">
                        <h4>Students</h4>
                        <p>${dept.studentCount}</p>
                    </div>
                    <div class="stat-item">
                        <h4>Courses</h4>
                        <p>${dept.courseCount}</p>
                    </div>
                </div>
            </div>
            <div class="department-actions">
                <button class="btn btn-edit" onclick="editDepartment('${dept._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-delete" onclick="deleteDepartment('${dept._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Add other necessary functions for CRUD operations
