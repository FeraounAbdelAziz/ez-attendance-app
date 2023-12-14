import React, { useEffect, useState, useRef } from 'react';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonList, IonLoading, IonModal, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar, useIonLoading } from '@ionic/react';
import { supabase } from '../../supabaseClient';
import deleteIcon from "/assets/deleteIcon.svg";
import updateIcon from "/assets/updateIcon.svg";
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import FormikControl from '../../components/FormikComponents/FormikControl';
import './Page.css';
import './AddClassModal.css';
import AddClassModal from './AddClassModal';
import { Link } from 'react-router-dom';
import { Redirect, useHistory } from 'react-router';


const ClassPage = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState<any>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from('class').select('*');
      setClasses(data);
    };

    fetchClasses();
  }, [classes]);

  const deleteClass = async (value: any) => {
    await supabase.from('class').delete().eq('class_id', value);
  };

  const validationSchemaUpdate = Yup.object({
    name: Yup.string()
      .required('Required')
      .max(20, 'Name should not exceed 20 characters')
      .matches(/^[a-zA-Z0-9\s]+$/, 'Name should only contain letters and numbers'),
    speciality: Yup.string().max(20, 'Speciality should not exceed 20 characters'),
    level: Yup.string().max(10, 'Level should not exceed 10 characters'),
    year_college: Yup.string()
      .required('Year is required')
      .matches(/^[0-9]{4}\/[0-9]{4}$/, 'Year should be in the format yyyy/yyyy')
      .max(9, 'Year should not exceed 9 characters'),
  });

  const onSubmitUpdate = async (values: any) => {
    const { name, speciality, level, year_college } = values;
    await supabase.from('class').update({ name, speciality, level, year_college }).eq('class_id', classId).select();
  };

  const handleOpenModal = (classItem: { class_id: any }) => {
    setClassId(classItem.class_id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false)
  };

  const history = useHistory();
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
        <AddClassModal />
        {classes?.map((classItem: { class_id: any; name: any; speciality: any; level: any; year_college: any }, index: any) => (
          <IonList key={index}>
            <IonItem>
              <IonGrid>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   history.push(`/class/${classItem.class_id}`);
                  //   <Redirect exact from="/class" to={`/class/${classItem.class_id}`} />
                  // }}
                   style={{ textDecoration: 'none' }} to={`/class/${classItem.class_id}`}>
                  <IonRow id="open-loading" className="ion-justify-content-between ion-align-items-center ion-text-center">
                    <IonLoading className='loading-page'trigger="open-loading" message="Please wait ..." duration={900} spinner="circular" />
                    <IonCol className="ion-align-self-center" size="8">
                      <IonText color="white">
                        {`${classItem.name} ${classItem.speciality} ${classItem.level} ${classItem.year_college}`}
                      </IonText>
                    </IonCol>
                    <IonCol className="ion-align-self-center" size="4">
                      <IonButton
                        id={`open-modal-update-${classItem.class_id}`}
                        size="small"
                        onClick={() => handleOpenModal(classItem)}
                      >
                        <IonIcon src={updateIcon} />
                      </IonButton>
                      <IonButton size="small" onClick={() => deleteClass(classItem.class_id)}>
                        <IonIcon src={deleteIcon} />
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </Link>
              </IonGrid>
            </IonItem>
            {classId === classItem.class_id && (
              <IonModal id="update-modal" ref={modal} isOpen={isModalOpen} trigger={`open-modal-update-${classItem.class_id}`}>
                {/* ... (modal content) */}
                <IonToolbar>
                  <IonTitle>Update Class </IonTitle>
                  <IonButtons slot="end">
                    <IonButton color="warning" onClick={() => handleCloseModal()}>
                      Close
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
                <Formik
                  initialValues={{
                    name: classItem.name,
                    speciality: classItem.speciality,
                    level: classItem.level,
                    year_college: classItem.year_college,
                  }}
                  validationSchema={validationSchemaUpdate}
                  onSubmit={onSubmitUpdate}
                >
                  {(formik) => (
                    <Form>
                      <IonList className="IonList-Input">
                        <IonItem>
                          <FormikControl
                            control="input"
                            type="text"
                            name="name"
                            label="Class name :"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                          />
                        </IonItem>
                        <IonItem>
                          <FormikControl
                            control="input"
                            type="text"
                            name="speciality"
                            label="Speciality : "
                            value={formik.values.speciality}
                            onChange={formik.handleChange}
                          />
                        </IonItem>
                        <IonItem>
                          <FormikControl
                            control="input"
                            type="text"
                            name="level"
                            label="Level  : "
                            value={formik.values.level}
                            onChange={formik.handleChange}
                          />
                        </IonItem>
                        <IonItem>
                          <FormikControl
                            control="input"
                            type="text"
                            name="year_college"
                            label="College year: "
                            value={formik.values.year_college}
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
        ))}
      </IonContent>
    </React.Fragment>
  );
};

export default ClassPage;
