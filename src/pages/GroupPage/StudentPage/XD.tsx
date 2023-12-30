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
import "../../global.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddStudentModal from './AddStudentModal';
const StudentPage = () => {
    const [students, setStudents] = useState<any[] | null>(null);
    const params = useParams()
    const { group_name, group_id, class_id }: any = params


    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data: fetchedStudents, error } = await supabase
                    .from('student')
                    .select('*')
                    .eq('class_id', class_id)
                    .eq('group_id', group_id);

                if (error) {

                } else {
                    setStudents(fetchedStudents || null);

                }
            } catch (error) {

            }
        };

        fetchStudents();
    }, [students]);

    const [editIndex, setEditIndex] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');

    const handleEditClick = (index: any) => {
        setEditIndex(index);
        setSelectedValue(students[index].week1 || ''); // Use an empty string if the value is null
    };

    const handleSaveClick = async (index: any) => {
        const updatedData = {};

        // Update the selected field based on the column
        if (editIndex === index) {
            const field = getFieldBasedOnIndex(index);
            updatedData[field] = selectedValue;

            // Send a POST request to Supabase with the updated value
            await supabase
                .from('student')
                .update(updatedData)
                .eq('etd_id', students[index].etd_id);

            // Clear the selection and reset the edit index
            setSelectedValue('');
            setEditIndex(null);
        }
    };

    const getFieldBasedOnIndex = (index) => {
        switch (index) {
            case 1:
                return 'first_name';
            case 2:
                return 'second_name';
            case 3:
                return 'week2';
            case 4:
                return 'week3';
            case 5:
                return 'week4';
            case 6:
                return 'week5';
            default:
                return '';
        }
    };

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

                <AddStudentModal />

                <IonGrid>
                    <TableContainer component={Paper}>
                        <Table color="danger" sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: '#f5d555' }} align='left'>number</TableCell>
                                    <TableCell sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: '#f5d555' }} align="left">first name</TableCell>
                                    <TableCell sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: '#f5d555' }} align="left">second name</TableCell>
                                    <TableCell sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: '#f5d555' }} align="left">week1</TableCell>
                                    <TableCell sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: '#f5d555' }} align="left">week2</TableCell>
                                    <TableCell sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: '#f5d555' }} align="left">week3</TableCell>
                                    <TableCell sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: '#f5d555' }} align="left">week4</TableCell>
                                    <TableCell sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: '#f5d555' }} align="left">week5</TableCell>
                                    <TableCell sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: '#f5d555' }} align="left">delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students?.map((student, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'white' }}>
                                        <TableCell component="th" scope="row" style={{ color: '#f5d555' }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {editIndex === index ? (
                                                <select
                                                    value={selectedValue}
                                                    onChange={(e) => setSelectedValue(e.target.value)}
                                                    onBlur={() => handleSaveClick(index)}
                                                    autoFocus
                                                >
                                                    <option value="">Select</option>
                                                    <option value="P">P</option>
                                                    <option value="/">/</option>
                                                </select>
                                            ) : (
                                                <div onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}>
                                                    {student.first_name}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {editIndex === index ? (
                                                <select
                                                    value={selectedValue}
                                                    onChange={(e) => setSelectedValue(e.target.value)}
                                                    onBlur={() => handleSaveClick(index)}
                                                    autoFocus
                                                >
                                                    <option value="">Select</option>
                                                    <option value="P">P</option>
                                                    <option value="/">/</option>
                                                </select>
                                            ) : (
                                                <div onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}>
                                                    {student.second_name}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {editIndex === index ? (
                                                <select
                                                    value={selectedValue}
                                                    onChange={(e) => setSelectedValue(e.target.value)}
                                                    onBlur={() => handleSaveClick(index)}
                                                    autoFocus
                                                >
                                                    <option value="">Select</option>
                                                    <option value="P">P</option>
                                                    <option value="/">/</option>
                                                </select>
                                            ) : (
                                                <div onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}>
                                                    {student.second_name}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {editIndex === index ? (
                                                <select
                                                    value={selectedValue}
                                                    onChange={(e) => setSelectedValue(e.target.value)}
                                                    onBlur={() => handleSaveClick(index)}
                                                    autoFocus
                                                >
                                                    <option value="">Select</option>
                                                    <option value="P">P</option>
                                                    <option value="/">/</option>
                                                </select>
                                            ) : (
                                                <div onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}>
                                                    {student.week1}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {editIndex === index ? (
                                                <select
                                                    value={selectedValue}
                                                    onChange={(e) => setSelectedValue(e.target.value)}
                                                    onBlur={() => handleSaveClick(index)}
                                                    autoFocus
                                                >
                                                    <option value="">Select</option>
                                                    <option value="P">P</option>
                                                    <option value="/">/</option>
                                                </select>
                                            ) : (
                                                <div onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}>
                                                    {student.week2}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {editIndex === index ? (
                                                <select
                                                    value={selectedValue}
                                                    onChange={(e) => setSelectedValue(e.target.value)}
                                                    onBlur={() => handleSaveClick(index)}
                                                    autoFocus
                                                >
                                                    <option value="">Select</option>
                                                    <option value="P">P</option>
                                                    <option value="/">/</option>
                                                </select>
                                            ) : (
                                                <div onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}>
                                                    {student.week3}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {editIndex === index ? (
                                                <select
                                                    value={selectedValue}
                                                    onChange={(e) => setSelectedValue(e.target.value)}
                                                    onBlur={() => handleSaveClick(index)}
                                                    autoFocus
                                                >
                                                    <option value="">Select</option>
                                                    <option value="P">P</option>
                                                    <option value="/">/</option>
                                                </select>
                                            ) : (
                                                <div onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}>
                                                    {student.week4}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {editIndex === index ? (
                                                <select
                                                    value={selectedValue}
                                                    onChange={(e) => setSelectedValue(e.target.value)}
                                                    onBlur={() => handleSaveClick(index)}
                                                    autoFocus
                                                >
                                                    <option value="">Select</option>
                                                    <option value="P">P</option>
                                                    <option value="/">/</option>
                                                </select>
                                            ) : (
                                                <div onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}>
                                                    {student.week5}
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell align="left" style={{ color: 'white' }}>
                                            <IonButton
                                                size="small"
                                                onClick={async () => {
                                                    await supabase.from('student').delete().eq('etd_id', student.etd_id);
                                                }}
                                            >
                                                <IonIcon src={deleteIcon} />
                                            </IonButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </IonGrid>
            </IonContent >

        </React.Fragment >
    );
};

export default StudentPage;