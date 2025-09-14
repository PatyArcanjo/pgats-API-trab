const studentService = require('../service/studentService');

exports.registerStudent = (req, res) => {
  try {
    const { name, username } = req.body;
    const student = studentService.addStudent({ name, username });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStudent = (req, res) => {
  try {
    const { username } = req.params;
    const student = studentService.getStudent(username);
    if (!student) return res.status(404).json({ error: 'Estudante não encontrado' });
    const notaFinal = studentService.getNotaFinal(username);
    res.json({ ...student, notaFinal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addNota = (req, res) => {
  try {
    const { username } = req.params;
  const { nota } = req.body;
  const student = studentService.addNota(username, nota);
  res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
