const express = require('express');
const student = require('./routes/student');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));

console.log('hello world');

app.use('/student', student);
console.log('data displayed?')

const port = 5500;

app.listen(5000, () => {
    console.log("server listening on port 5000 ....");
})