import { gql } from "@apollo/client";

export const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      patient_id
      firstName
      lastName
      dob
      appointmentCount
      phone
    }
  }
`;
export const GET_PATIENT = gql`
   query GetPatient($patient_id: ID!) {
        patient(patient_id: $patient_id) {
            patient_id
            firstName
            lastName
            dob
            email
            phone
            address
            appointments {
                appointmentId
                appointmentDate
                appointmentType
            }
        }
   }
`