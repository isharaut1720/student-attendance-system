let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};
let roll = students.length ? students[students.length - 1].id + 1 : 1;

// Set today's date by default
document.getElementById("date").valueAsDate = new Date();

// Save to localStorage
function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));
}

// Add student
function addStudent() {
    const name = document.getElementById("studentName").value.trim();

    if (name === "") {
        alert("Enter student name");
        return;
    }

    if (students.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    alert("Student already exists!");
    return;
    }

    students.push({
        id: roll++,
        name: name
    });

    document.getElementById("studentName").value = "";
    saveData();
    displayStudents();
}

// Display students
function displayStudents() {
    const table = document.getElementById("studentTable");
    const searchValue = document.getElementById("search").value.toLowerCase();

    table.innerHTML = "";

    const selectedDate = document.getElementById("date").value;

    if (!attendance[selectedDate]) {
        attendance[selectedDate] = {};
    }

    let filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchValue)
    );

    filteredStudents.forEach((student, index) => {

        if (!attendance[selectedDate][student.id]) {
            attendance[selectedDate][student.id] = "Present";
        }

        const status = attendance[selectedDate][student.id];

        table.innerHTML += `
            <tr>
                <td>${index + 1}</td> <!-- 🔢 AUTO SERIAL -->
                <td>${student.name}</td>
                <td>
                    <span class="${status === 'Present' ? 'present' : 'absent'}">
                        ${status}
                    </span><br>
                    <button onclick="markPresent(${student.id})">Present</button>
                    <button onclick="markAbsent(${student.id})" style="background:red;">Absent</button>
                </td>
                <td class="${getPercentageClass(calculatePercentage(student.id))}">
                    ${calculatePercentage(student.id)}%
                </td>
                <td class="actions">
                    <button class="edit" onclick="editStudent(${students.indexOf(student)})">Edit</button>
                    <button class="delete" onclick="deleteStudent(${students.indexOf(student)})">Delete</button>
                </td>
            </tr>
        `;
    });

    saveData();
}

// Mark Present
function markPresent(id) {
    const date = document.getElementById("date").value;
    attendance[date][id] = "Present";
    saveData();
    displayStudents();
}

// Mark Absent
function markAbsent(id) {
    const date = document.getElementById("date").value;
    attendance[date][id] = "Absent";
    saveData();
    displayStudents();
}

// Load attendance when date changes
function loadAttendance() {
    displayStudents();
}

// Delete student
function deleteStudent(index) {
    const confirmDelete = confirm("Delete this student?");
    if (!confirmDelete) return;

    const removed = students.splice(index, 1)[0];

    // Remove from all dates
    for (let date in attendance) {
        delete attendance[date][removed.id];
    }

    saveData();
    displayStudents();
}

// Edit student
function editStudent(index) {
    const newName = prompt("Enter new name:", students[index].name);

    if (newName && newName.trim() !== "") {
        students[index].name = newName.trim();
        saveData();
        displayStudents();
    }
}

function calculatePercentage(studentId) {
    let totalDays = 0;
    let presentDays = 0;

    for (let date in attendance) {
        if (attendance[date][studentId]) {
            totalDays++;

            if (attendance[date][studentId] === "Present") {
                presentDays++;
            }
        }
    }

    if (totalDays === 0) return 100;

    return Math.round((presentDays / totalDays) * 100);
}

function getPercentageClass(percent) {
    if (percent >= 75) return "high";      // green
    if (percent >= 50) return "medium";    // yellow/orange
    return "low";                          // red
}

// Initial load
displayStudents();