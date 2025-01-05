const mongoose = require('mongoose');

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/proj2024MongoDB';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define Schema
const LecturerSchema = new mongoose.Schema({
    _id: String,
    name: String,
    did: String,
});

// Define Model
const Lecturer = mongoose.model('lecturers', LecturerSchema);

// Exported methods
module.exports = {
    getAllLecturers: (req, res) => {
        Lecturer.find().sort({ _id: 1 })
            .then((lecturers) => res.render('lecturers', { lecturers }))
            .catch((error) => res.send(error));
    },
    deleteLecturer: (req, res) => {
        const lecturerId = req.params.lid;
        
        // Check if lecturer is associated with any modules
        mongoose.connection.db.collection('modules', (err, collection) => {
            if (err) return res.send(err);

            collection.findOne({ lecturer: lecturerId })
                .then((module) => {
                    if (module) {
                        // Cannot delete lecturer with associated modules
                        res.send(`Cannot delete Lecturer ${lecturerId} as they are associated with modules.`);
                    } else {
                        // Delete the lecturer
                        Lecturer.deleteOne({ _id: lecturerId })
                            .then(() => res.redirect('/lecturers'))
                            .catch((error) => res.send(error));
                    }
                })
                .catch((error) => res.send(error));
        });
    }
};
