import React, { useEffect, useState, useRef } from 'react';
import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonRow,
    IonSearchbar,
    IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react';

import deleteIcon from "/assets/deleteIcon.svg";
import updateIcon from "/assets/updateIcon.svg";
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Link, useParams } from 'react-router-dom';
import { warning } from 'ionicons/icons';
import { supabase } from '../../../supabaseClient';
import AddClassModal from '../../ClassPage/AddClassModal';
import FormikControl from '../../../components/FormikComponents/FormikControl';
import './StudentPage.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const StudentPage = () => {
    const [students, setStudents] = useState<any[] | null>(null);
    const params = useParams()
    const {group_name} : any = params

    
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data: fetchedStudents, error } = await supabase
                    .from('student')
                    .select('*');

                if (error) {
                    console.error('Error fetching students:', error);
                } else {
                    setStudents(fetchedStudents || null);
                    console.log('Fetched students:', fetchedStudents);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);
    return (
        <React.Fragment>
            <IonContent fullscreen>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Students Section {group_name}</IonTitle>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar></IonSearchbar>
                    </IonToolbar>
                </IonHeader>



                <IonGrid>
                    {/*<IonRow >
                        <IonCol size="2" size-md="4">first_name</IonCol>
                        <IonCol size="2" size-md="4">number</IonCol>
                        <IonCol size="2" size-md="4">second_name</IonCol>
                        <IonCol size="2" size-md="4">week1</IonCol>
                        <IonCol size="2" size-md="4">week2</IonCol>
                        <IonCol size="2" size-md="4">week3</IonCol>
                        <IonCol size="2" size-md="4">week4</IonCol>
                        <IonCol size="2" size-md="4">week5</IonCol>
                    </IonRow> */}

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>number</TableCell>
                                    <TableCell align="right">first name</TableCell>
                                    <TableCell align="right">second name</TableCell>
                                    <TableCell align="right">week1</TableCell>
                                    <TableCell align="right">week2</TableCell>
                                    <TableCell align="right">week3</TableCell>
                                    <TableCell align="right">week4</TableCell>
                                    <TableCell align="right">week5</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students?.map((student, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index}
                                        </TableCell>
                                        <TableCell align="right">{student.first_name}</TableCell>
                                        <TableCell align="right">{student.second_name}</TableCell>
                                        <TableCell align="right">{student.week1}</TableCell>
                                        <TableCell align="right">{student.week2}</TableCell>
                                        <TableCell align="right">{student.week3}</TableCell>
                                        <TableCell align="right">{student.week4}</TableCell>
                                        <TableCell align="right">{student.week5}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* {students?.map((student, index) => {
                return (
                    <IonRow key={index} >
                        <IonCol size="2" size-md="4">{index}</IonCol>
                        <IonCol size="2" size-md="4">{student.first_name}</IonCol>
                        <IonCol size="2" size-md="4">{student.second_name}</IonCol>
                        <IonCol size="2" size-md="4">{student.week1}</IonCol>
                        <IonCol size="2" size-md="4">{student.week2}</IonCol>
                        <IonCol size="2" size-md="4">{student.week3}</IonCol>
                        <IonCol size="2" size-md="4">{student.week4}</IonCol>
                        <IonCol size="2" size-md="4">{student.week5}</IonCol>
                    </IonRow>
                )
            })} */}
                </IonGrid>
            </IonContent >

        </React.Fragment >
    );
};

export default StudentPage;