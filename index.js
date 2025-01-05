const express = require('express');
const ejs = require('ejs');
const mysqlDao = require('./mysqlDao');
const mongoDao = require('./mongoDao');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// Home route
app.get('/', (req, res) => {
    res.render('home');
});

// Students routes
app.get('/students', mysqlDao.getAllStudents);

app.get('/students/edit/:sid', mysqlDao.getStudentById);

app.post('/students/edit/:sid', 
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('age').isInt({ min: 18 }).withMessage('Age must be 18 or older'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('editStudent', { student: req.body, errors: errors.array() });
        }
        mysqlDao.updateStudent(req, res);
    }
);

app.get('/students/add', (req, res) => res.render('addStudent', { errors: [] }));

app.post('/students/add', 
    body('sid').isLength({ min: 4, max: 4 }).withMessage('Student ID must be exactly 4 characters'),
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('age').isInt({ min: 18 }).withMessage('Age must be 18 or older'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('addStudent', { errors: errors.array() });
        }
        mysqlDao.addStudent(req, res);
    }
);

// Grades routes
app.get('/grades', mysqlDao.getAllGrades);

// Lecturers routes
app.get('/lecturers', mongoDao.getAllLecturers);

app.get('/lecturers/delete/:lid', mongoDao.deleteLecturer);

// Start server
app.listen(3004, () => {
    console.log("Server is running on port 3004");
});
