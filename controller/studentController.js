const fs = require('fs').promises
const { readCSV, csvFilePath } = require("../model/readCsvData")


const getStudent = async (req, res) => {
    try {
        console.log("Fetching allStudents...");
        const allStudents = await readCSV();

        // console.log("Students received in controller:\n", allStudents); // Debugging

        if (!allStudents || allStudents.length === 0) {
            console.log("No student data available.");
            return res.status(404).json({ success: false, message: "No student data found" });
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Student ID is required" });
        }
        const student = allStudents.find(student => student.id === id);

        if (!student) {
            return res.status(404).json({ success: false, message: `No student found with ID: ${id}` });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        console.error("Error fetching student data:", error);
        res.status(500).json({ success: false, message: "Error fetching student data" });
    }
};



const addStudent = async (req, res) => {
    try {
        const newStudent = req.body;
        const studentList = await readCSV();

        // const studentID = req.params.id;

        // if (studentList.some(student => student.id === studentID)) {
        //     return res.status(400).json({ success: false, message: "Student ID already exists." });
        // }

        const newEntry = `\n${newStudent.id},${newStudent.name},${newStudent.nationality},${newStudent.city},${newStudent.gender},${newStudent.age},${newStudent.gpa}`;
        await fs.appendFile(csvFilePath, newEntry, "utf8");

        res.status(201).json({ success: true, message: "Student added successfully!" });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ success: false, message: "Error adding student" });
    }
};


const updateStudent = async (req, res) => {

    const studentId = req.params.id;
    const updatedData = req.body;
    let studentList = await readCSV();
    
    const studentIndex = studentList.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    studentList[studentIndex] = { ...studentList[studentIndex], ...updatedData };
    fs.writeFile(csvFilePath, "id,name,nationality,city,gender,age,gpa\n" + studentList.map(s => Object.values(s).join(",")).join("\n"));
    
    res.status(200).json({ message: "Student updated successfully" });
}

const deleteStudent = async (req, res) => {
    const studentList = await readCSV();
    const studentId = req.params.id;
    
    const studentIndex = studentList.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    studentList.splice(studentIndex, 1);
    fs.writeFile(csvFilePath, "id,name,nationality,city,gender,age,gpa\n" + studentList.map(s => Object.values(s).join(",")).join("\n"));
    
    res.status(200).json({ message: "Student deleted successfully" });
}

module.exports = {
    getStudent,
    addStudent,
    updateStudent,
    deleteStudent
}