import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonList, IonLoading, IonModal, IonRow, IonSearchbar, IonTabButton, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { Formik, Form } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import FormikControl from '../../components/FormikComponents/FormikControl';
import { supabase } from '../../supabaseClient';
import * as Yup from 'yup';
import deleteIcon from "/assets/deleteIcon.svg";
import updateIcon from "/assets/updateIcon.svg";
import { useParams } from 'react-router';
import AddGroupModal from './AddGroupModal';
import { Link } from 'react-router-dom';
import { homeSharp } from 'ionicons/icons';



import './../global.css'




const GroupPage = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const params = useParams()
    const { class_id, class_name, speciality }: any = params
    const [groups, setGroups] = useState<any>([]);

    const [GroupId, setGroupId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchGroups = async () => {
            const { data: groups } = await supabase.from('group')
                .select('*')
                .eq('class_id', class_id);
            setGroups(groups);
        };

        fetchGroups();
    }, [groups]);




    const deleteClass = async (value: any) => {
        await supabase.from('group').delete().eq('group_id', value);
    };
    const validationSchema = Yup.object({
        group_name: Yup.string()
            .required('Group Name is required')
            .test(
                'is-valid-group-name',
                'Invalid group name format',
                (value) => /^G\d{2,}$/.test(value)
            )
            .max(3, 'Group Name must be at max 3 characters')
        ,

        group_type: Yup.string()
            .required('Group Type is required')
            .matches(/^(TP|TD)$/, 'Group Type must be TP or TD'),
    });
    const onSubmitUpdate = async (values: any) => {
        const { group_name, group_type } = values;
        await supabase.from('group').update({ group_name, group_type }).eq('group_id', GroupId).select();
    };

    const handleOpenModal = (GroupId: { group_id: any }) => {
        setGroupId(GroupId.group_id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false)

    };
    return (
        <React.Fragment>
            <IonContent fullscreen>

                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            <Link to='/class' style={{ margin: '1rem',  }}>
                                <IonIcon style={{ margin: '0 1rem', fontSize: '25px', }} icon={homeSharp}></IonIcon>
                            </Link>
                            <IonText>
                                Class {class_name} Group Section </IonText></IonTitle>
                    </IonToolbar>
                </IonHeader>
                <AddGroupModal />

                {groups?.length === 0 ?
                    <IonText className='ion-padding-top' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} color="medium"><i>Empty ! , Click the button below to add a group !</i> </IonText>
                    : null}

                {groups && groups.map((group: { group_id: any, group_type: any, group_name: any }, index: number) =>
                (
                    <IonList key={index}>
                        <IonItem>
                            <IonGrid>
                                <IonRow className="ion-justify-content-between ion-align-items-center ion-text-center">
                                    <IonCol className="ion-align-self-center" size="8">
                                        <Link
                                            style={{ padding: '0', margin: '0', textDecoration: 'none' }} to={`/class/${class_id}/${class_name}/${speciality}/${group.group_id}/${group.group_name}/session`}>
                                            {/* style={{ padding: '0', margin: '0', textDecoration: 'none' }} to={`/class/${class_id}/${class_name}/${speciality}/${group.group_id}/${group.group_name}`}> */}
                                            <IonText color="white">
                                                {`${group.group_name} ${group.group_type}`}
                                            </IonText>
                                        </Link>
                                    </IonCol>
                                    <IonCol className="ion-align-self-center" size="4">
                                        <IonButton
                                            id={`open-modal-update-group-${group.group_id}`}
                                            // size="small"
                                            onClick={() => handleOpenModal(group)
                                            }
                                        >
                                            <IonIcon src={updateIcon} />
                                        </IonButton>
                                        <IonButton onClick={() => deleteClass(group.group_id)}>
                                            <IonIcon
                                                //  size="small"
                                                src={deleteIcon} />
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                        {GroupId === group.group_id && (
                            <IonModal id="update-modal-group" ref={modal} isOpen={isModalOpen} trigger={`open-modal-update-group-${group.group_id}`}>
                                {/* ... (modal content) */}
                                <IonToolbar>
                                    <IonTitle>Update Group </IonTitle>
                                    <IonButtons slot="end">
                                        <IonButton color="home" onClick={() => handleCloseModal()}>
                                            Close
                                        </IonButton>
                                    </IonButtons>
                                </IonToolbar>
                                <Formik
                                    initialValues={{
                                        group_name: group.group_name,
                                        group_type: group.group_type,
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={onSubmitUpdate}
                                >
                                    {(formik) => (
                                        <Form>
                                            <IonList className="IonList-Input">
                                                <IonItem>
                                                    <FormikControl
                                                        control="input"
                                                        type="text"
                                                        name="group_name"
                                                        label="Group name :"
                                                        value={formik.values.group_name}
                                                        onChange={formik.handleChange}
                                                    />
                                                </IonItem>
                                                <IonItem>
                                                    <FormikControl
                                                        control="input"
                                                        type="text"
                                                        name="group_type"
                                                        label="Group Type : "
                                                        value={formik.values.group_type}
                                                        onChange={formik.handleChange}
                                                    />
                                                </IonItem>
                                                <IonItem>
                                                    <IonButton type="submit">Submit</IonButton>
                                                </IonItem>
                                            </IonList>
                                        </Form>
                                    )}
                                </Formik>
                            </IonModal>
                        )}
                    </IonList>
                )
                )}




            </IonContent>
        </React.Fragment>
    )
}

export default GroupPage
