document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setupFilters();
});

async function loadStudents() {
    try {
        const response = await fetch('/api/admin/students');
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function displayStudents(students) {
    const container = document.getElementById('studentsList');
    container.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-header">
                <h3>${student.name}</h3>
                <span class="student-id">${student.rollNo}</span>
            </div>
            <div class="student-info">
                <p><i class="fas fa-envelope"></i> ${student.email}</p>
                <p><i class="fas fa-building"></i> ${student.department}</p>
                <p><i class="fas fa-graduation-cap"></i> Year ${student.year || 'N/A'}</p>
            </div>
            <div class="student-actions">
                <button class="btn btn-view" onclick="viewStudent('${student._id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-edit" onclick="editStudent('${student._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-delete" onclick="deleteStudent('${student._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    document.getElementById('studentSearch')?.addEventListener('input', filterStudents);
    document.getElementById('departmentFilter')?.addEventListener('change', filterStudents);
    document.getElementById('yearFilter')?.addEventListener('change', filterStudents);
}

// Add other necessary functions for CRUD operations
