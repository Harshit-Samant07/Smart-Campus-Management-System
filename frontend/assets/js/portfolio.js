document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/students/portfolio', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch portfolio data');
        
        const data = await response.json();
        updatePortfolio(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading portfolio data');
    }
});

function updatePortfolio(data) {
    // Update academic progress
    document.getElementById('cgpa').textContent = data.academic.cgpa.toFixed(2);
    document.getElementById('credits').textContent = data.academic.credits;
    createSemesterChart(data.academic.semesters);

    // Update skills
    updateSkills(data.skills);

    // Update projects
    updateProjects(data.projects);

    // Update certifications
    updateCertifications(data.certifications);

    // Add event listeners for add buttons
    setupEventListeners();
}

function createSemesterChart(semesters) {
    const ctx = document.getElementById('semesterChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: semesters.map(s => `Semester ${s.number}`),
            datasets: [{
                label: 'GPA',
                data: semesters.map(s => s.gpa),
                borderColor: '#3498db',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 4
                }
            }
        }
    });
}

function updateSkills(skills) {
    const container = document.getElementById('skillsList');
    container.innerHTML = skills.map(skill => `
        <div class="skill-tag">
            ${skill}
            <i class="fas fa-times" onclick="removeSkill('${skill}')"></i>
        </div>
    `).join('');
}

function updateProjects(projects) {
    const container = document.getElementById('projectsList');
    container.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-links">
                <a href="${project.github}" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="${project.demo}" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Demo
                </a>
            </div>
        </div>
    `).join('');
}

function updateCertifications(certifications) {
    const container = document.getElementById('certificationsList');
    container.innerHTML = certifications.map(cert => `
        <div class="cert-item">
            <img src="${cert.logo}" alt="${cert.name}">
            <div class="cert-info">
                <h4>${cert.name}</h4>
                <p>${cert.issuer} - ${cert.date}</p>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('addSkillBtn').onclick = showAddSkillModal;
    document.getElementById('addProjectBtn').onclick = showAddProjectModal;
    document.getElementById('addCertBtn').onclick = showAddCertModal;
}

// Add modal related functions and API calls for adding/removing items
