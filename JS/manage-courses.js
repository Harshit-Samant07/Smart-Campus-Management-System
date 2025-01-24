document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    setupEventListeners();
});

async function loadCourses() {
    try {
        const response = await fetch('/api/admin/courses');
        const courses = await response.json();
        displayCourses(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function displayCourses(courses) {
    const container = document.querySelector('.courses-grid');
    container.innerHTML = courses.map(course => `
        <div class="course-card">
            <div class="course-header">
                <h3>${course.courseName}</h3>
                <span class="course-code">${course.courseCode}</span>
            </div>
            <div class="course-body">
                <p><i class="fas fa-building"></i> ${course.department}</p>
                <p><i class="fas fa-layer-group"></i> Semester ${course.semester}</p>
                <p><i class="fas fa-star"></i> Credits: ${course.credits}</p>
            </div>
            <div class="course-actions">
                <button onclick="editCourse('${course._id}')" class="btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCourse('${course._id}')" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('addCourseForm')?.addEventListener('submit', handleCourseSubmit);
    document.getElementById('departmentFilter')?.addEventListener('change', filterCourses);
    document.getElementById('semesterFilter')?.addEventListener('change', filterCourses);
}

async function handleCourseSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = await addCourse(Object.fromEntries(formData));
    if (success) {
        document.getElementById('addCourseModal').style.display = 'none';
        e.target.reset();
        await loadCourses();
    }
}

// Add CRUD operation functions
