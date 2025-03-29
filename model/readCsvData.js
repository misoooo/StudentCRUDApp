const fs = require("fs").promises;
const path = require("path");

const csvFilePath = path.join(__dirname, "./studentDataset.csv");
 

const readCSV = async() => {
    try {
        const studentData = await fs.readFile(csvFilePath, "utf8"); //<<< why is it working with sync but not without it ???????? huhhhhhh
        // console.log("Raw CSV Data:\n", studentData);
        return getStudentData(studentData);
    } catch (err) {
        console.log("Error reading CSV file:", err);
        return [];
    }
};

function getStudentData(csvData) {
    const allStudents = csvData.split("\n").map(singleStudent => singleStudent.trim()).filter(singleStudent => singleStudent);
    // console.log("all student CSV Data:\n", allStudents);
    if (allStudents.length < 2) {
        return [];
    } else {
        return makeHeaders(allStudents);
    }
}

function makeHeaders(allStudents) {
    const headers = allStudents[0].split(",").map(header => header.trim());
    // console.log("headers CSV Data:\n", headers);
    return mapHeadersToData(headers, allStudents);
}

function mapHeadersToData(headers, allStudents) {
    const mappedStudents = allStudents.slice(1).map(singleStudent => {
        const values = singleStudent.split(",").map(value => value.trim());
        return makeStudentObject(headers, values);
    });
    // console.log('mapped students: ', mappedStudents);
    return mappedStudents;
}

function makeStudentObject(headers, values) {
    const finalData =  headers.reduce((acc, header, index) => {
        acc[header] = values[index] || ""; // Prevents undefined values
        return acc;
    }, {});
    // console.log('final students: ', finalData);
    return finalData;
}

module.exports = {readCSV, csvFilePath};




