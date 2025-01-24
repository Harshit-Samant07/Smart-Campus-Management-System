document.addEventListener('DOMContentLoaded', () => {
    loadTimetable();
    setupEventListeners();
});

async function loadTimetable() {
    const classId = document.getElementById('classSelect').value;
    if (!classId) return;

    try {
        const response = await fetch(`/api/admin/timetable/${classId}`);
        const timetable = await response.json();
        displayTimetable(timetable);
    } catch (error) {
        console.error('Error loading timetable:', error);
    }
}

function displayTimetable(timetable) {
    const tbody = document.getElementById('timetableBody');
    // Implementation for displaying timetable slots
}

// Add other necessary functions for timetable management
