document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/students/timetable', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch timetable');
        
        const data = await response.json();
        initializeTimetable(data);
        updateTodaySchedule(data.schedule);
        setupControls();
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading timetable');
    }
});

function initializeTimetable(data) {
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    const tbody = document.getElementById('timetable-body');
    
    tbody.innerHTML = timeSlots.map(time => `
        <tr>
            <td class="time-col">${time}</td>
            ${getDaySlots(time, data.schedule)}
        </tr>
    `).join('');
}

function getDaySlots(time, schedule) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.map(day => {
        const class_ = findClass(time, day, schedule);
        if (!class_) return '<td></td>';
        
        return `
            <td>
                <div class="class-slot ${class_.type.toLowerCase()}">
                    <div class="subject">${class_.subject}</div>
                    <div class="room">${class_.room}</div>
                </div>
            </td>
        `;
    }).join('');
}

function updateTodaySchedule(schedule) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = schedule.filter(class_ => class_.day === today);
    const container = document.getElementById('today-classes');
    
    if (todayClasses.length === 0) {
        container.innerHTML = '<p class="no-classes">No classes scheduled for today</p>';
        return;
    }

    container.innerHTML = todayClasses
        .sort((a, b) => new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time))
        .map(class_ => `
            <div class="class-item">
                <div class="class-time">
                    <div class="time">${formatTime(class_.time)}</div>
                    <div class="duration">${class_.duration}</div>
                </div>
                <div class="class-info">
                    <div class="subject">${class_.subject}</div>
                    <div class="details">
                        <span class="room"><i class="fas fa-door-open"></i> ${class_.room}</span>
                        <span class="teacher"><i class="fas fa-user"></i> ${class_.teacher}</span>
                    </div>
                </div>
                <div class="class-status ${getClassStatus(class_.time)}">
                    ${getClassStatus(class_.time)}
                </div>
            </div>
        `).join('');
}

function setupControls() {
    const todayBtn = document.querySelector('.today-btn');
    const prevBtn = document.querySelector('.prev-week');
    const nextBtn = document.querySelector('.next-week');
    
    todayBtn.addEventListener('click', () => {
        // Scroll to current day and highlight today's classes
        highlightToday();
    });
    
    prevBtn.addEventListener('click', () => updateWeek(-1));
    nextBtn.addEventListener('click', () => updateWeek(1));
    
    // Initialize current week display
    updateCurrentWeek();
}

// Helper functions
function formatTime(time) {
    return new Date('1970/01/01 ' + time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

function getClassStatus(time) {
    const now = new Date();
    const classTime = new Date('1970/01/01 ' + time);
    const currentTime = new Date('1970/01/01 ' + now.toLocaleTimeString());
    
    if (currentTime < classTime) return 'upcoming';
    if (currentTime > addMinutes(classTime, 60)) return 'completed';
    return 'ongoing';
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
