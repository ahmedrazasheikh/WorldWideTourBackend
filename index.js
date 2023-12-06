import express from 'express';
import { Contact } from './Models/Contact.js';
import { Trip } from './Models/Contact.js';
import cors from 'cors'
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
const app = express();
const port = 8000;
app.use(express.json());

app.use(
  cors({
    origin: ["https://worldwidetours.co", "http://localhost:3000" , "*"],
    credentials: true,
  })
);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ahmed.radiantcortex@gmail.com',
    pass: 'abozcchwagyfqziw',
  },
});
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
  const { checkinDate, emailValue, checkoutDate , people, numberValue ,nameValue  , name } = req.body;
  if (!checkinDate || !emailValue || !checkoutDate || !people || !numberValue || !nameValue || !name) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }
  const mailOptions = {
    from: 'ahmed.radiantcortex@gmail.com',
    to: 'contact@worldwidetours.co',
    subject: 'Your Exclusive Invitation Inside',
    html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
              }
    
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
    
              h1 {
                color: #007BFF;
              }
    
              p {
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Contact Client</h1>
              <h2>Contact Information:</h2>
              <p><strong>Name:</strong> ${nameValue}</p>
              <p><strong>Number:</strong> ${numberValue}</p>
              <p><strong>Check In Date:</strong> ${checkinDate}</p>
              <p><strong>Check out Date:</strong> ${checkoutDate}</p>
              <p><strong>Email:</strong> ${emailValue}</p>
              <p><strong>People:</strong> ${people}</p>
              <p><strong>Visiting Country :</strong> ${name}</p>
            </div>
          </body>
        </html>
      `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).send(error.toString());
    }

    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Message successfully saved.' });
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
