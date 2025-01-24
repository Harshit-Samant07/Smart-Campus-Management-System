document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../student-login.html';
        return;
    }

    await loadCourses();
    setupStarRatings();
    await loadPreviousFeedbacks();
    setupFormSubmission();
});

async function loadCourses() {
    try {
        const response = await fetch('http://localhost:5000/api/students/courses', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        const courseSelect = document.getElementById('courseSelect');
        courseSelect.innerHTML = `
            <option value="">Select Course</option>
            ${data.courses.map(course => `
                <option value="${course.id}">${course.name}</option>
            `).join('')}
        `;
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function setupStarRatings() {
    document.querySelectorAll('.star-rating').forEach(rating => {
        const stars = rating.querySelectorAll('i');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i <= index);
                });
                rating.dataset.value = index + 1;
            });
        });
    });
}

async function loadPreviousFeedbacks() {
    try {
        const response = await fetch('http://localhost:5000/api/students/feedbacks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        const feedbackHistory = document.getElementById('feedbackHistory');
        feedbackHistory.innerHTML = data.feedbacks.map(feedback => `
            <div class="feedback-card">
                <div class="course-name">${feedback.course_name}</div>
                <div class="ratings">
                    <div class="rating-item">
                        <span>Content:</span>
                        ${getStarRating(feedback.ratings.content)}
                    </div>
                    <div class="rating-item">
                        <span>Teaching:</span>
                        ${getStarRating(feedback.ratings.teaching)}
                    </div>
                    <div class="rating-item">
                        <span>Resources:</span>
                        ${getStarRating(feedback.ratings.resources)}
                    </div>
                </div>
                <div class="feedback-text">${feedback.comments}</div>
                <div class="feedback-date">
                    Submitted on ${new Date(feedback.submitted_at).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading feedbacks:', error);
    }
}

function getStarRating(rating) {
    return Array(5).fill(0).map((_, i) => 
        `<i class="fas fa-star ${i < rating ? 'active' : ''}"></i>`
    ).join('');
}

function setupFormSubmission() {
    document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courseId = document.getElementById('courseSelect').value;
        if (!courseId) {
            alert('Please select a course');
            return;
        }

        const ratings = {};
        document.querySelectorAll('.star-rating').forEach(rating => {
            ratings[rating.dataset.rating] = parseInt(rating.dataset.value || 0);
        });

        const formData = {
            course_id: courseId,
            ratings,
            positives: e.target.positives.value,
            improvements: e.target.improvements.value,
            comments: e.target.comments.value
        };

        try {
            const response = await fetch('http://localhost:5000/api/students/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Feedback submitted successfully');
                e.target.reset();
                await loadPreviousFeedbacks();
            } else {
                alert('Error submitting feedback');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting feedback');
        }
    });
}
