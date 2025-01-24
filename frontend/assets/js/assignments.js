document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/students/assignments', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            updateAssignmentsGrid(data.assignments);
            populateSubjectFilter(data.assignments);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function updateAssignmentsGrid(assignments) {
    const container = document.getElementById('assignments-container');
    container.innerHTML = assignments.map(assignment => `
        <div class="assignment-card ${assignment.status}">
            <div class="subject-badge">${assignment.subject}</div>
            <h3>${assignment.title}</h3>
            <p>${assignment.description}</p>
            <div class="due-date">
                <i class="fas fa-calendar"></i> Due: ${new Date(assignment.dueDate).toLocaleDateString()}
            </div>
            <div class="assignment-actions">
                <button onclick="downloadAssignment('${assignment._id}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button onclick="uploadSubmission('${assignment._id}')" 
                        ${assignment.status !== 'pending' ? 'disabled' : ''}>
                    <i class="fas fa-upload"></i> Submit
                </button>
            </div>
        </div>
    `).join('');
}
