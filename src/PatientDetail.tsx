import { useQuery } from '@apollo/client';
import { GET_PATIENT } from './queries';
import { useParams } from 'react-router-dom';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

type Appointment = {
     appointmentId: string;
    appointmentDate: string;
    appointmentType: string;
};

export const PatientDetail = () => {
     const { id: patient_id } = useParams(); // Get patient ID from URL
    const {data} = useQuery(GET_PATIENT, {
        variables: { patient_id },
    });
  console.log(data); // Should log the full patient data object

  const patient = data?.patient;
  if (!patient) {
    return <div>no patient found with id {patient_id}</div>
  }
  const appointments = patient.appointments || [];

    return <div>
        <div>{patient.firstName ?? ''} {patient.lastName ?? ''}</div>
        <div>{patient.dob}</div>
        <div>{patient.email}</div>
        <div>{patient.phone}</div>
        <div>{patient.address}</div>
        <TableContainer>
                  <Table>
                      <TableHead>
                          <TableRow>
                              <TableCell>Appointment Date</TableCell>
                              <TableCell>Appointment Type</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {appointments.map((apt: Appointment) => {
                                const {appointmentId, appointmentDate,appointmentType} = apt;
                              return (<TableRow key={appointmentId}>
                                  <TableCell>{appointmentDate ?? 'No appointment date'}</TableCell>
                                <TableCell>{appointmentType ?? 'No appointment type'}</TableCell>
                              </TableRow>);
                          })}
                      </TableBody>
                  </Table>
              </TableContainer>
    </div>
};