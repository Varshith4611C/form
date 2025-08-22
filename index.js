const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your MongoDB Atlas connection string
const mongoURI = process.env.MONGO_URI || "mongodb+srv://varshith:varshith@cluster0.hkcheb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Schema and model
const submissionSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const Submission = mongoose.model('Submission', submissionSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email } = req.body;

  const submission = new Submission({ name, email });
  submission.save()
    .then(() => res.send(`Thank you, ${name}! Your data has been saved.`))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error saving data.');
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

