import express from 'express';
import cors from 'cors'
import { Contact } from './Models/Contact.js';
import { Trip } from './Models/Contact.js';
const app = express();
const port = 8000;
app.use(express.json());
app.use(
  cors({
    origin: ["https://worldwidetours.co", "http://localhost:3000" , "*"],
    credentials: true,
  })
);
// Define a route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
app.post('/api/v1/contact', async (req, res) => {
  try {
    const contactData = req.body;
    const newContact = new Contact(contactData);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Could not create contact' });
  }
});
app.post('/api/v1/trip', async (req, res) => {
  try {
    const tripData = req.body; 
    const newTrip = new Trip(tripData);
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ error: 'Could not create trip' });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
