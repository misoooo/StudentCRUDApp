const express = require('express');
const router = express.Router();

const { getStudent, addStudent, updateStudent, deleteStudent } = require('../controller/studentController');

console.log('router here');
// Individual routes
router.get('/:id', getStudent);
router.post('/', addStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
