const STORAGE_KEYS = {
    STUDENTS: 'ims_students',
    COURSES: 'ims_courses',
    ATTENDANCE: 'ims_attendance',
    ASSIGNMENTS: 'ims_assignments',
    GRADES: 'ims_grades',
    NOTICES: 'ims_notices',
    CREDENTIALS: 'ims_credentials',
    FACULTY: 'ims_faculty',
    ANNOUNCEMENTS: 'ims_announcements'
};

const sampleData = {
    credentials: {
        students: [
            { id: '2021CSE001', password: 'student123', role: 'student' },
            { id: '2021CSE002', password: 'student456', role: 'student' },
            { id: '2021CSE003', password: 'student789', role: 'student' }
        ],
        admins: [
            { id: 'ADMIN001', password: 'admin123', role: 'admin' },
            { id: 'ADMIN002', password: 'admin456', role: 'admin' }
        ],
        faculty: [
            { id: 'FAC001', password: 'faculty123', role: 'faculty' },
            { id: 'FAC002', password: 'faculty456', role: 'faculty' }
        ]
    },
    students: [
        {
            id: '2021CSE001',
            name: 'Himanshu Sharma',
            course: 'Computer Science Engineering',
            attendance: 72,
            cgpa: 7.2,
            email: 'himanshu.sharma@example.com',
            phone: '1234567890',
            semester: 3,
            enrolledCourses: ['CSE101', 'CSE102', 'CSE103'],
            address: '123 Student Housing, University Road',
            guardian: {
                name: 'Reena Sharma',
                phone: '9876543210',
                email: 'reena.sharma@example.com'
            }
        },
        {
            id: '2021CSE002',
            name: 'Arun Verma',
            course: 'Computer Science',
            attendance: 92,
            cgpa: 8.9,
            email: 'arun.verma@example.com',
            phone: '0987654321',
            semester: 4
        }
    ],
    faculty: [
        {
            id: 'FAC001',
            name: 'Mr. Pankaj Pratap ',
            department: 'Computer Science',
            email: 'adarsh@university.edu',
            phone: '5555555555',
            subjects: ['CSE101', 'CSE201'],
            qualification: 'Ph.D in Computer Science',
            joinDate: '2020-01-15'
        }
    ],
    courses: [
        {
            id: 'CSE101',
            name: 'Python Programming',
            faculty: 'Dr. Adarsh',
            credits: 4,
            semester: 1
        },
        {
            id: 'CSE102',
            name: 'Data Structures',
            faculty: 'Dr. Arun',
            credits: 4,
            semester: 2
        },
        {
            id: 'CSE103',
            name: 'DSTL',
            faculty: 'Dr. Asim Rai',
            credits: 4,
            semester: 2,
            schedule: {
                days: ['Monday', 'Wednesday'],
                time: '10:30 AM - 12:00 PM',
                room: 'CS-301'
            }
        }
    ],
    assignments: [
        {
            id: 'ASG001',
            courseId: 'CSE101',
            title: 'Programming Basics',
            description: 'Create a simple calculator using C++',
            dueDate: '2024-02-20',
            maxMarks: 100,
            status: 'pending',
            submissions: []
        }
    ],
    announcements: [
        {
            id: 'ANC001',
            title: 'Mid-Term Examination Schedule',
            content: 'Mid-term examinations will begin from March 15th, 2024',
            date: '2024-02-10',
            author: 'ADMIN001',
            type: 'examination'
        }
    ],
    timetable: [
        {
            id: 'TT001',
            subject: 'Python Programming',
            day: 'Monday',
            time: '10:00 AM - 11:00 AM',
            faculty: 'FAC001',
            room: 'Lab 1'
        },
        {
            id: 'TT002',
            subject: 'Data Structures',
            day: 'Monday',
            time: '11:00 AM - 12:00 PM',
            faculty: 'FAC002',
            room: 'Lab 2'
        }
    ]
};

class DataStore {
    static initializeData() {
        // Initialize data only if it doesn't exist
        Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
            if (!localStorage.getItem(storageKey)) {
                const dataKey = key.toLowerCase();
                localStorage.setItem(storageKey, JSON.stringify(sampleData[dataKey] || []));
            }
        });
        
        // Ensure students data is properly initialized
        if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
            console.log('Initializing student data...');
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(sampleData.students));
        }
        
        // Initialize timetable data
        if (!localStorage.getItem('ims_timetable')) {
            localStorage.setItem('ims_timetable', JSON.stringify(sampleData.timetable));
        }
        
        // Log initialized data for debugging
        console.log('Students initialized:', this.getStudents());
    }

    static getStudents() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    }

    static addStudent(student) {
        // Validate required fields
        if (!student.id || !student.name || !student.dob) {
            throw new Error('Missing required student information');
        }

        // Check if student ID already exists
        const students = this.getStudents();
        if (students.find(s => s.id === student.id)) {
            throw new Error('Student ID already exists');
        }

        // Add timestamp
        student.createdAt = new Date().toISOString();
        
        students.push(student);
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
        
        console.log('Student added successfully:', student);
        return student;
    }

    static addCredentials(id, password, role) {
        const credentials = JSON.parse(localStorage.getItem(STORAGE_KEYS.CREDENTIALS)) || {};
        if (!credentials[role + 's']) {
            credentials[role + 's'] = [];
        }
        credentials[role + 's'].push({ id, password, role });
        localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
    }

    static updateStudent(studentId, updatedData) {
        const students = this.getStudents();
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            students[index] = { ...students[index], ...updatedData };
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
            return true;
        }
        return false;
    }

    static deleteStudent(studentId) {
        const students = this.getStudents();
        const filtered = students.filter(s => s.id !== studentId);
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
    }

    // Similar methods for other data types
    static getCourses() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
    }

    static getAttendance() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
    }

    static updateAttendance(studentId, courseId, date, details) {
        const attendance = this.getAttendance();
        const entry = {
            studentId,
            courseId,
            date,
            status: details.status,
            timeSlot: details.timeSlot,
            section: details.section,
            timestamp: new Date().toISOString()
        };

        // Remove any existing attendance for the same student, course, and date
        const filtered = attendance.filter(a => 
            !(a.studentId === studentId && 
              a.courseId === courseId && 
              a.date === date)
        );

        filtered.push(entry);
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(filtered));
    }

    static getAttendanceBySubject(courseId, date, section) {
        const attendance = this.getAttendance();
        return attendance.filter(a => 
            a.courseId === courseId && 
            (!date || a.date === date) &&
            (!section || a.section === section)
        );
    }

    static verifyCredentials(userId, password, role) {
        console.log('Verifying credentials:', { userId, role });
        const credentials = JSON.parse(localStorage.getItem(STORAGE_KEYS.CREDENTIALS));
        console.log('Stored credentials:', credentials);
        
        if (!credentials || !credentials[role + 's']) {
            console.error('No credentials found for role:', role);
            return false;
        }

        const userGroup = credentials[role + 's'];
        const user = userGroup.find(user => user.id === userId && user.password === password);
        console.log('Found user:', user);
        
        return !!user;
    }

    static getAnnouncements() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
    }

    static getFaculty() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FACULTY) || '[]');
    }

    static getAssignmentsByStudent(studentId) {
        const assignments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS) || '[]');
        const student = this.getStudents().find(s => s.id === studentId);
        return assignments.filter(a => student.enrolledCourses.includes(a.courseId));
    }

    static getTimetable() {
        return JSON.parse(localStorage.getItem('ims_timetable') || '[]');
    }

    static addClass(classData) {
        const timetable = this.getTimetable();
        timetable.push(classData);
        localStorage.setItem('ims_timetable', JSON.stringify(timetable));
    }

    static updateClass(classId, updatedData) {
        const timetable = this.getTimetable();
        const index = timetable.findIndex(entry => entry.id === classId);
        if (index !== -1) {
            timetable[index] = { ...timetable[index], ...updatedData };
            localStorage.setItem('ims_timetable', JSON.stringify(timetable));
        }
    }

    static deleteClass(classId) {
        const timetable = this.getTimetable();
        const filtered = timetable.filter(entry => entry.id !== classId);
        localStorage.setItem('ims_timetable', JSON.stringify(filtered));
    }
}
