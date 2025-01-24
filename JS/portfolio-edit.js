document.addEventListener('DOMContentLoaded', function() {
    const editModeBtn = document.getElementById('editModeBtn');
    const container = document.querySelector('.dashboard-container');
    let isEditMode = false;

    // Toggle Edit Mode
    editModeBtn.addEventListener('click', () => {
        isEditMode = !isEditMode;
        container.classList.toggle('edit-mode');
        editModeBtn.innerHTML = isEditMode ? 
            '<i class="fas fa-times"></i> Exit Edit' : 
            '<i class="fas fa-edit"></i> Edit Portfolio';
    });

    // Image Upload Handler
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => profileImage.src = e.target.result;
            reader.readAsDataURL(file);
        }
    });

    // Editable Content
    document.querySelectorAll('.editable').forEach(element => {
        element.addEventListener('click', function() {
            if (!isEditMode) return;
            
            const text = this.textContent;
            const input = document.createElement('input');
            input.value = text;
            input.className = 'editable-input';
            
            input.onblur = function() {
                element.textContent = this.value;
            };
            
            this.textContent = '';
            this.appendChild(input);
            input.focus();
        });
    });

    // Add Skill Handler
    document.querySelector('.add-skill-card').addEventListener('click', () => {
        if (!isEditMode) return;
        
        const skillName = prompt('Enter skill name:');
        if (skillName) {
            const skillLevel = prompt('Enter skill level (Beginner/Intermediate/Advanced):');
            addSkillCard(skillName, skillLevel);
        }
    });

    // Save Changes
    document.getElementById('saveChanges').addEventListener('click', () => {
        // Save logic here - could use localStorage or API calls
        alert('Changes saved successfully!');
        container.classList.remove('edit-mode');
        isEditMode = false;
    });

    // Cancel Edit
    document.getElementById('cancelEdit').addEventListener('click', () => {
        if (confirm('Discard changes?')) {
            container.classList.remove('edit-mode');
            isEditMode = false;
            // Reload original content
            location.reload();
        }
    });
});

function addSkillCard(name, level) {
    const skillsGrid = document.getElementById('skillsGrid');
    const newSkill = document.createElement('div');
    newSkill.className = 'skill-card';
    newSkill.innerHTML = `
        <i class="fas fa-code"></i>
        <span>${name}</span>
        <div class="skill-level">${level}</div>
    `;
    skillsGrid.insertBefore(newSkill, skillsGrid.lastElementChild);
}
