import React, { useEffect, useState } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonModal,
    IonSearchbar,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import deleteIcon from "/assets/deleteIcon.svg";
import sendIcon from "/assets/sendIcon.svg";
import { useParams } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './StudentPage.css'
import "../../global.css"
import AddStudentModal from './AddStudentModal';
import { Formik, Form } from 'formik';
import FormikControl from '../../../components/FormikComponents/FormikControl';
import * as Yup from "yup";

import { add } from 'ionicons/icons';
const StudentPage = () => {
    const [students, setStudents] = useState<any[] | null>(null);
    const params = useParams()
    const { group_name, group_id, class_id, speciality }: any = params
    const [selectedStudentIndex, setSelectedStudentIndex] = useState('');
    const modal = React.useRef<HTMLIonModalElement>(null);

    function dismiss() {
        modal.current?.dismiss();
    }
    const initialValues = {
        classes: '',
        groups: ' '
    };
    const validationSchema = Yup.object({
        classes: Yup.string()
            .required('Required'),
        groups: Yup.string()
            .required('Required')
    });

    const onSubmit = async (values: any) => {
        const { data: class_id } = await supabase
            .from('class')
            .select('class_id')
            .eq('name', values.classes)

        const { data: group_id } = await supabase
            .from('group')
            .select('group_id')
            .eq('group_name', values.groups)


        if (class_id && class_id.length > 0 && group_id && group_id.length > 0) {
            const { data, error } = await supabase
                .from('student')
                .update({ group_id: group_id[0].group_id, class_id: class_id[0].class_id })
                .eq('student_id', selectedStudentIndex)
                .select()
            console.log('====================================');
            console.log(data, error);
            console.log('====================================');
        } else {
            console.log('class_id or group_id is null');
        }

    };


    const fetchStudents = async () => {
        try {
            const { data: fetchedStudents, error } = await supabase
                .from('student')
                .select('*')
                .eq('class_id', class_id)
                .eq('group_id', group_id);

            if (error) {
                // Handle error
            } else {
                setStudents(fetchedStudents || null);
            }
        } catch (error) {
            // Handle error
        }
    };

    fetchStudents();

    const updateStudent = async (student_id: number, week: string, value: string) => {
        await supabase
            .from('student')
            .update({ [week]: value })
            .eq('student_id', student_id);
    };





    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const academicYear = `${currentYear}/${nextYear}`;

    const [selectedClasses, setSelectedClasses] = useState<any>([]);
    const fetchSpecialityThisYear = async () => {
        const { data: classes, error } = await supabase
            .from('class')
            .select('name')
            .eq('year_college', academicYear)
            .eq('speciality', speciality);

        setSelectedClasses(classes)

    }
    fetchSpecialityThisYear();
    const dropdownClasses = [
        {
            key: 'Select a class',
            value: ''
        },
        ...selectedClasses?.map((name_class: any) => ({
            key: name_class.name,
            value: name_class.name
        }))
    ];







    const [selectedGroupIndex, setSelectedGroupIndex] = useState<any>([]);
    // const [selectedStudentIndex, setSelectedStudentIndex] = useState('');
    const [selectedGroups, setSelectedGroups] = useState<any>([]);

    const fetchGroupsThisClass = async () => {
        try {
            const { data: class_id_for_group_fetch } = await supabase
                .from('class')
                .select('class_id')
                .eq('name', selectedGroupIndex);

            if (class_id_for_group_fetch && class_id_for_group_fetch.length > 0) {
                const { data: groups, error: groupError } = await supabase
                    .from('group')
                    .select('group_name')
                    .eq('class_id', class_id_for_group_fetch[0]?.class_id);

                setSelectedGroups(groups);
                // console.log(groups, groupError);
            }
        } catch (error) {
            // console.error('Error fetching groups:', error);
        }
    };


    const dropdownGroups = [
        {
            key: 'Select a group',
            value: ''
        },
        ...selectedGroups?.map((name_group: any) => ({
            key: name_group.group_name,
            value: name_group.group_name
        }))
    ];


    useEffect(() => {
        fetchGroupsThisClass();
    }, [selectedGroupIndex]);




    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const handleOpenTransferModal = (studentId: any) => {
        setSelectedStudentIndex(studentId);
        setIsTransferModalOpen(true);
    };

    const handleCloseTransferModal = () => {
        setIsTransferModalOpen(false);
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
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align='left'>number</TableCell>
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align="left">first name</TableCell>
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align="left">second name</TableCell>
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align="left">week1</TableCell>
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align="left">week2</TableCell>
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align="left">week3</TableCell>
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align="left">week4</TableCell>
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align="left">week5</TableCell>
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align="left">delete</TableCell>
                                    <TableCell sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        color: '#f5d555',
                                    }} align="left">transfert</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students?.map((student: { student_id: any, first_name: string, second_name: string, week1: string, week2: string, week3: string, week4: string, week5: string }, index: any) => (
                                    <TableRow
                                        key={student.student_id}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            color: 'white',
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{ color: '#f5d555' }}
                                        >
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {student.first_name}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            {student.second_name}
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            <select
                                                name="week1"
                                                id="week1"
                                                onChange={(e) => {
                                                    setSelectedStudentIndex(index);
                                                    updateStudent(
                                                        student.student_id,
                                                        'week1',
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                <option value={student.week1}>{student.week1}</option>
                                                <option value="/">/</option>
                                                <option value="P">P</option>
                                                <option value="AB">AB</option>
                                            </select>
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            <select
                                                name="week2"
                                                id="week2"
                                                onChange={(e) => {
                                                    setSelectedStudentIndex(index);
                                                    updateStudent(
                                                        student.student_id,
                                                        'week2',
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                <option value={student.week2}>{student.week2}</option>
                                                <option value="/">/</option>
                                                <option value="P">P</option>
                                                <option value="AB">AB</option>
                                            </select>
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            <select
                                                name="week3"
                                                id="week3"
                                                onChange={(e) => {
                                                    setSelectedStudentIndex(index);
                                                    updateStudent(
                                                        student.student_id,
                                                        'week3',
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                <option value={student.week3}>{student.week3}</option>
                                                <option value="/">/</option>
                                                <option value="P">P</option>
                                                <option value="AB">AB</option>
                                            </select>
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            <select
                                                name="week4"
                                                id="week4"
                                                onChange={(e) => {
                                                    setSelectedStudentIndex(index);
                                                    updateStudent(
                                                        student.student_id,
                                                        'week4',
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                <option value={student.week4}>{student.week4}</option>
                                                <option value="/">/</option>
                                                <option value="P">P</option>
                                                <option value="AB">AB</option>
                                            </select>
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            <select
                                                name="week5"
                                                id="week5"
                                                onChange={(e) => {
                                                    setSelectedStudentIndex(index);
                                                    updateStudent(
                                                        student.student_id,
                                                        'week5',
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                <option value={student.week5}>{student.week5}</option>
                                                <option value="/">/</option>
                                                <option value="P">P</option>
                                                <option value="AB">AB</option>
                                            </select>
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            <IonButton
                                                size="small"
                                                onClick={async () => {
                                                    await supabase
                                                        .from('student')
                                                        .delete()
                                                        .eq('student_id', student.student_id);
                                                }}
                                            >
                                                <IonIcon src={deleteIcon} />
                                            </IonButton>
                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white' }}>
                                            <IonButton
                                                id={`open-modal-transfert-student-${student.student_id}`}
                                                expand="block"
                                                onClick={() => handleOpenTransferModal(student.student_id)}
                                            >
                                                <IonIcon src={sendIcon} />
                                            </IonButton>

                                            <IonModal
                                                id={`example-modal-transfert-student-${student.student_id}`}
                                                className={'example-modal-transfert-student'}
                                                isOpen={isTransferModalOpen && selectedStudentIndex === student.student_id}
                                                onDidDismiss={handleCloseTransferModal}
                                            ><IonToolbar>
                                                    <IonTitle>Transfert Student {student.first_name}</IonTitle>
                                                    <IonButtons slot="end">
                                                        <IonButton color="warning" onClick={() => dismiss()}>
                                                            Close
                                                        </IonButton>
                                                    </IonButtons>
                                                </IonToolbar>
                                                <Formik
                                                    initialValues={initialValues}
                                                    validationSchema={validationSchema}
                                                    onSubmit={onSubmit}
                                                >

                                                    {(formik) => {
                                                        useEffect(() => {
                                                            console.log('====================================');
                                                            console.log(formik.values.classes);
                                                            console.log('====================================');
                                                            setSelectedGroupIndex(formik.values.classes);
                                                            setSelectedStudentIndex(student.student_id);
                                                        }, [formik.values.classes]);

                                                        return (
                                                            <Form>
                                                                <IonList className='IonList-Input'>
                                                                    <IonItem>
                                                                        From speciality {speciality} {" "} {group_name}
                                                                    </IonItem>

                                                                    <IonItem>
                                                                        to :
                                                                    </IonItem>

                                                                    <IonItem>

                                                                        <FormikControl
                                                                            control="select"
                                                                            name="classes"
                                                                            label="classes : "
                                                                            options={dropdownClasses}
                                                                        />
                                                                    </IonItem>
                                                                    <IonItem>
                                                                        <FormikControl
                                                                            control="select"
                                                                            name="groups"
                                                                            label="groups : "
                                                                            options={dropdownGroups}
                                                                        />
                                                                    </IonItem>
                                                                    <IonItem>
                                                                        <IonButton type="submit" color="warning">
                                                                            submit
                                                                        </IonButton>
                                                                    </IonItem>
                                                                </IonList>
                                                            </Form>
                                                        );
                                                    }}
                                                </Formik>
                                            </IonModal>



                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </IonGrid>
            </IonContent>
        </React.Fragment>
    );
};

export default StudentPage;
