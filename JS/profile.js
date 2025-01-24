document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveChanges');
    const cancelBtn = document.getElementById('cancelEdit');
    const editableInputs = document.querySelectorAll('.editable input, .editable select, .editable textarea');
    const editActions = document.querySelector('.edit-actions');
    
    // Store original values for cancel functionality
    let originalValues = {};
    
    // Toggle sidebar functionality
    document.querySelector('.toggle-sidebar').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('collapsed');
        document.querySelector('.main-content').classList.toggle('expanded');
    });

    // Profile Picture Upload
    const pictureUpload = document.getElementById('pictureUpload');
    const profilePicture = document.getElementById('profilePicture');

    pictureUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicture.src = e.target.result;
                // Update header profile picture as well
                document.querySelector('.user-info .profile-pic').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Enable editing
    editBtn.addEventListener('click', function() {
        document.querySelector('.dashboard-container').classList.add('edit-mode');
        editableInputs.forEach(input => {
            // Store original value
            originalValues[input.name] = input.value;
            // Enable editing
            input.disabled = false;
        });
        editActions.style.display = 'flex';
        editBtn.style.display = 'none';
        document.querySelector('.picture-upload-btn').style.display = 'flex';
    });

    // Save changes
    saveBtn.addEventListener('click', function() {
        document.querySelector('.dashboard-container').classList.remove('edit-mode');
        editableInputs.forEach(input => {
            input.disabled = true;
        });
        editActions.style.display = 'none';
        editBtn.style.display = 'flex';
        // Here you would typically send the updated data to your server
        alert('Changes saved successfully!');
    });

    // Cancel editing
    cancelBtn.addEventListener('click', function() {
        document.querySelector('.dashboard-container').classList.remove('edit-mode');
        editableInputs.forEach(input => {
            // Restore original value
            input.value = originalValues[input.name] || '';
            input.disabled = true;
        });
        editActions.style.display = 'none';
        editBtn.style.display = 'flex';
        document.querySelector('.picture-upload-btn').style.display = 'none';
    });
});
