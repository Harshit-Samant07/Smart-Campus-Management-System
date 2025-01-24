document.addEventListener('DOMContentLoaded', () => {
    loadAssignments();
    setupEventListeners();
});

async function loadAssignments() {
    try {
        const response = await fetch('/api/admin/assignments');
        const assignments = await response.json();
        displayAssignments(assignments);
    } catch (error) {
        console.error('Error loading assignments:', error);
    }
}

function displayAssignments(assignments) {
    const container = document.querySelector('.assignments-grid');
    container.innerHTML = assignments.map(assignment => `
        <div class="assignment-card">
            <h3>${assignment.title}</h3>
            <p>${assignment.description}</p>
            <div class="assignment-meta">
                <span><i class="fas fa-calendar"></i> ${new Date(assignment.dueDate).toLocaleDateString()}</span>
                <span><i class="fas fa-building"></i> ${assignment.department}</span>
            </div>
            <div class="assignment-actions">
                <button onclick="editAssignment('${assignment._id}')" class="btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteAssignment('${assignment._id}')" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Add other necessary functions for CRUD operations
