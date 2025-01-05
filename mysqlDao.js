const pmysql = require('promise-mysql');

let pool;

pmysql.createPool({
    connectionLimit: 1,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024Mysql'
})
    .then((p) => {
        pool = p;
        console.log('Connected to MySQL');
    })
    .catch((e) => {
        console.error('Pool error:', e);
    });

module.exports = {
    // Fetch all students
    getAllStudents: (req, res) => {
        pool.query('SELECT * FROM student ORDER BY sid')
            .then((data) => res.render('students', { students: data }))
            .catch((error) => res.send(error));
    },

    // Fetch a single student by ID
    getStudentById: (req, res) => {
        pool.query('SELECT * FROM student WHERE sid = ?', [req.params.sid])
            .then((data) => {
                if (data.length > 0) {
                    res.render('editStudent', { student: data[0] });
                } else {
                    res.send('Student not found.');
                }
            })
            .catch((error) => res.send(error));
    },

    // Update a student
    updateStudent: (req, res) => {
        const { name, age } = req.body;
        pool.query('UPDATE student SET name = ?, age = ? WHERE sid = ?', [name, age, req.params.sid])
            .then(() => res.redirect('/students'))
            .catch((error) => res.send(error));
    },

    // Add a new student
    addStudent: (req, res) => {
        const { sid, name, age } = req.body;
        pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', [sid, name, age])
            .then(() => res.redirect('/students'))
            .catch((error) => {
                if (error.code === 'ER_DUP_ENTRY') {
                    res.send(`Student with ID ${sid} already exists.`);
                } else {
                    res.send(error);
                }
            });
    },

    // Fetch all grades
    getAllGrades: (req, res) => {
        pool.query(`
            SELECT s.name AS studentName, m.name AS moduleName, g.grade
            FROM grade g
            JOIN student s ON g.sid = s.sid
            JOIN module m ON g.mid = m.mid
            ORDER BY s.name, g.grade
        `)
            .then((data) => res.render('grades', { grades: data }))
            .catch((error) => res.send(error));
    },

    // Fetch all modules
    getAllModules: (req, res) => {
        pool.query('SELECT * FROM module ORDER BY mid')
            .then((data) => res.render('modules', { modules: data }))
            .catch((error) => res.send(error));
    },

    // Add a grade for a student in a module
    addGrade: (req, res) => {
        const { sid, mid, grade } = req.body;
        pool.query('INSERT INTO grade (sid, mid, grade) VALUES (?, ?, ?)', [sid, mid, grade])
            .then(() => res.redirect('/grades'))
            .catch((error) => res.send(error));
    }
};
