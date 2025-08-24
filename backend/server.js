const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors')
const csv = require('csv-parser');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Patient {
    patient_id: ID!
    firstName: String
    lastName: String
    dob: String
    phone: String
    appointmentCount: Int   
  }

  type Appointment {
    appointmentId: ID!
    appointmentDate: String
    appointmentType: String
  }

  type PatientDetail {
    patient_id: ID!
    firstName: String
    lastName: String
    dob: String
    email: String
    phone: String
    address: String
    appointments: [Appointment]
  }

  type Query {
    patients: [Patient!]!
    patient(patient_id: ID!): PatientDetail
  }
`);


const root = {
  patients: () => {
    return csvData.map(patient => ({ ...patient, appointmentCount: patientToAppointments[patient.patient_id]?.length || 0 }));
  },
  patient: (data) => {
    const patientResult = csvData.find(patient => patient.patient_id === data.patient_id);
    return {
      ...patientResult,
      appointments: patientToAppointments[data.patient_id],
    };
  },
};

const PORT = process.env.PORT || 3000;
const csvData = [];
const patientToAppointments = {};

const cleanData = (data) => {
  const {patient_id, first_name, last_name, dob, email, phone, address, appointment_id, appointment_type, appointment_date} = data;
  const firstName = typeof first_name === 'string' ? first_name.trim() : null;
  const lastName = typeof last_name === 'string' ? last_name.trim() : null;
  const dateOfBirth = new Date(dob);
  return {
      patient_id,
      firstName,
      lastName,
      dob: dateOfBirth.toLocaleDateString('en-CA'),
      email,
      phone,
      address,
  };
};

function loadCSVData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('patients_and_appointments.txt')
      .pipe(csv())
      .on('data', (row) => {
        const {patient_id, appointment_id, appointment_date, appointment_type} = row;
        const apptForPatient = patientToAppointments[patient_id] || [];
        apptForPatient.push({
          appointmentId: appointment_id,
          appointmentDate: appointment_date,
          appointmentType: appointment_type,
        });
        patientToAppointments[patient_id] = apptForPatient;
        if (apptForPatient.length <= 1) {
          csvData.push(cleanData(row));
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed.');
        resolve();
      })
      .on('error', reject);
  });
}

app.use(cors());

// Register GraphQL middleware BEFORE server start
app.use('/graphql', createHandler({
  schema,
  rootValue: root,
  graphiql: true
}));



// Register your regular HTTP route (can be after CSV is loaded)
loadCSVData()
.then(() => {
  app.get('/', (req, res) => {
    res.json(csvData);
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('Failed to load CSV:', err);
});