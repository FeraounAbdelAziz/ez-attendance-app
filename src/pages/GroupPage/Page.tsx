import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonList, IonLoading, IonModal, IonRow, IonSearchbar, IonTabButton, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { Formik, Form } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import FormikControl from '../../components/FormikComponents/FormikControl';
import { supabase } from '../../supabaseClient';
import * as Yup from 'yup';
import deleteIcon from "/assets/deleteIcon.svg";
import updateIcon from "/assets/updateIcon.svg";
import AddGroupModal from './AddGroupModal';

import './AddGroupModal.css';

const GroupPage = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [groups, setGroups] = useState<any>([]);
    const [GroupId, setGroupId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchGroups = async () => {
            const { data: groups } = await supabase.from('group').select('*');
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
        (value) => /^G\d+$/.test(value)
      )
      .max(3, 'Group Name must be at max 3 characters'),

    group_type: Yup.string()
      .required('Group Type is required')
      .matches(/^(TP|TD)$/, 'Group Type must be TP or TD'),
  });
    const onSubmitUpdate = async (values: any) => {
        const { group_name, group_type } = values;
        await supabase.from('group').update({ group_name, group_type }).eq('group_id', GroupId).select();
    };

    const handleOpenModal = (GroupId: { group_id: any }) => {
        setIsModalOpen(true);
        setGroupId(GroupId.group_id);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false)
    };
    return (
        <React.Fragment>
            <IonContent fullscreen>

                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Toolbar</IonTitle>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <AddGroupModal />



                {groups && groups.map((group: { group_id: any, group_type: any, group_name: any }, index: number) =>
                (
                    <IonList key={index}>
                        <IonItem>
                            <IonGrid>
                                <IonRow className="ion-justify-content-between ion-align-items-center ion-text-center">
                                    <IonCol className="ion-align-self-center" size="8">
                                        <IonText color="white">
                                            {`${group.group_name} ${group.group_type}`}
                                        </IonText>
                                    </IonCol>
                                    <IonCol className="ion-align-self-center" size="4">
                                        <IonButton
                                            id={`open-modal-update-group-${group.group_id}`}
                                            size="small"
                                            onClick={() => handleOpenModal(group)}
                                        >
                                            <IonIcon src={updateIcon} />
                                        </IonButton>
                                        <IonButton size="small" onClick={() => deleteClass(group.group_id)}>
                                            <IonIcon src={deleteIcon} />
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                        {GroupId === group.group_id && (
                            <IonModal id="update-modal-group" ref={modal} isOpen={isModalOpen} trigger={`open-modal-update-group${group.group_id}`}>
                                {/* ... (modal content) */}
                                <IonToolbar>
                                    <IonTitle>Update Group </IonTitle>
                                    <IonButtons slot="end">
                                        <IonButton color="warning" onClick={() => handleCloseModal()}>
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
