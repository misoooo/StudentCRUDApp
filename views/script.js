console.log("mimi here");
//setting useraction value in local storage
function setUserAction(action){
    localStorage.setItem("userAction", action);
}

//nextButton content funct
document.addEventListener("DOMContentLoaded", function(){
    const nextButton = document.getElementById("btn2");
    const userAction = localStorage.getItem("userAction");

    console.log("nextButton: ", nextButton);
    console.log("action: ",userAction);

    if(userAction==="show"){
        nextButton.innerText = "Back to Home";
        nextButton.onclick = () => window.location.href = "index.html";
    } else if(userAction==="update"){
        nextButton.innerText = "Update";
        nextButton.onclick = () => window.location.href = "changeDB.html";
        const studentId = localStorage.getItem("id"); // Use stored ID if available
        if (studentId) {
            populateDB(studentId);
        }
    } else if(userAction==="delete"){
        nextButton.innerText = "Delete";
        nextButton.onclick = () => showDeletePopUp();
    }
    
    document.getElementById("student-form").onsubmit = (event) => addStudent(event);
})

//delete student
async function deleteStudent(){
    const studentId = document.getElementById("input-box").value;
    if(!studentId){
        alert("Enter a valid student id");
        return;
    }
    try {
        const response = await fetch(`http://localhost:5000/student/${studentId}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            console.log("error in response. response status: ", response.status);
        }
        const data = await response.json();
        alert(data.message);
        window.location.href = "index.html";
    } catch (error) {
        console.log("error: ", error);
    }
}

//delete popups
function showDeletePopUp(){
    document.getElementById("delete-popup").style.display = "block";
}
function closePopup() {
    document.getElementById("delete-popup").style.display = "none";
}

//show student data
async function showData() {
    const studentId = document.getElementById("input-box").value;
    const response = await fetch(`http://localhost:5000/student/${studentId}`, {
        method: "GET"
    });
    if (!response.ok) {
        console.log("error in response. response status: ", response.status);
    }
    if(!studentId){
        alert("enter student id");
    }
    try {
        const data = await response.json();
        if(data.data.message){
            alert(data.data.message);
        } else{
            localStorage.setItem("id", studentId);
            console.log("student data here: ", data);
            document.getElementById("student-detail-table").style.display = "block";
            const row = document.querySelector(".student-detail tbody tr");

            row.cells[0].textContent = data.data.id;
            row.cells[1].textContent = data.data.name;
            row.cells[2].textContent = data.data.nationality;
            row.cells[3].textContent = data.data.city;
            row.cells[4].textContent = data.data.gender;
            row.cells[5].textContent = data.data.age;
            row.cells[6].textContent = data.data.gpa;
        }
    } catch (error) {
        console.log("error: ", error);
    }
}

//function to prefill the formm
async function populateDB(studentId){
    const response = await fetch(`http://localhost:5000/student/${studentId}`, {
        method: "GET"
    });
    if (!response.ok) {
        console.log("error in response. response status: ", response.status);
    }
    try{
        const data = await response.json();
        if(data.data.message){
            alert(data.message);
        } else {
            document.getElementById("id").value = data.data.id;
            document.getElementById("full-name").value = data.data.name;
            document.getElementById("nationality").value = data.data.nationality;
            document.getElementById("city").value = data.data.city;
            document.getElementById("gender").value = data.data.gender;
            document.getElementById("age").value = data.data.age;
            document.getElementById("gpa").value = data.data.gpa;            
        }
    }catch (error) {
        console.log("error: ", error);
    }
}

//add student
async function addStudent(event){
    event.preventDefault();
    const studentId = document.getElementById("id").value;
    const studentData = {
        id: studentId,
        name: document.getElementById("full-name").value,
        nationality: document.getElementById("nationality").value,
        city: document.getElementById("city").value,
        gender: document.getElementById("gender").value,
        age: document.getElementById("age").value,
        gpa: document.getElementById("gpa").value
    };
    const method = localStorage.getItem("userAction") === "update" ? "PUT" : "POST";
    const url = method === "PUT" ? `http://localhost:5000/student/${studentId}` : `http://localhost:5000/student`;
    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(studentData)
        });
        if (!response.ok) {
            console.log("error in response. response status: ", response.status);
        }
        const data = response.json();
        alert(data.message);
        window.location.href = "index.html";
    } catch (err) {
        console.log("error: ", err);
    }
}