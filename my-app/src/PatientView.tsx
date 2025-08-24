import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { Patient } from './types';
import { useQuery } from '@apollo/client';
import { GET_PATIENTS } from './queries';
import { useNavigate } from 'react-router-dom';

export const PatientView = () => {
    const {data } = useQuery(GET_PATIENTS, {});
     const patients = data?.patients || [];
    const navigate = useNavigate();
      const handleClick = (id: string) => {
      navigate(`patient/${id}`); // Replace with your desired path
    };
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Date of Birth</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Appointment Count</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {patients.map((patient:Patient) => {
                        const {patient_id, firstName, lastName, dob, appointmentCount, phone} = patient;
                        return (<TableRow onClick={() => handleClick(patient_id)} key={patient_id}>
                            <TableCell>{firstName ?? ''} { lastName ?? ''}</TableCell>
                            <TableCell>{dob}</TableCell>
                            <TableCell>{phone}</TableCell>
                            <TableCell>{appointmentCount}</TableCell>
                        </TableRow>);
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};