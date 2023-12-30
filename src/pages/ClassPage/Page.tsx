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
import { supabase } from '../../supabaseClient';
import deleteIcon from "/assets/deleteIcon.svg";
import updateIcon from "/assets/updateIcon.svg";
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import FormikControl from '../../components/FormikComponents/FormikControl';
import AddClassModal from './AddClassModal';
import { Link } from 'react-router-dom';
import './../global.css';
import { warning } from 'ionicons/icons';


const ClassPage = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState<any>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data: ClassData } = await supabase.from('class').select('*').order('year_college', { ascending: true });

      const groupedClasses = ClassData
        ? ClassData.reduce((acc, classItem) => {
          const yearCollege = classItem.year_college;
          if (!acc[yearCollege]) {
            acc[yearCollege] = [];
          }
          acc[yearCollege].push(classItem);
          return acc;
        }, {})
        : {};

    
      const classesArray = Object.entries(groupedClasses).map(([year_college, data]) => ({
        year_college,
        data,
      }));


      const sortedclassesArray = classesArray.sort((a, b) => {
        const yearA = parseInt(a.year_college.split('/')[0], 10);
        const yearB = parseInt(b.year_college.split('/')[0], 10);
        return yearB - yearA;
      });
      setClasses(sortedclassesArray);
    };
    fetchClasses();
  }, [classes]); 
  // useEffect(() => {
  //   console.log('====================================');
  //   console.log("Classes : ", classes);
  //   console.log('====================================');
  // }, [classes]);



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
    const { data } = await supabase.from('class').update({ name, speciality, level, year_college }).eq('class_id', classId).select();
    if (data) {
      handleCloseModal();
    }
  };

  const handleOpenDeleteConfirmation = (classId: string) => {
    setDeleteItemId(classId);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteItemId('');
    setIsDeleteConfirmationOpen(false);
  };


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (classItem: { class_id: any }) => {
    setClassId(classItem.class_id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false)
  };

  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);

  useEffect(() => {
    if (!accordionGroup.current) {
      return;
    }
    accordionGroup.current.value = ['first', 'third'];
  }, []);

  return (
    <React.Fragment>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Class Section</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <AddClassModal />


        <IonAccordionGroup ref={accordionGroup} multiple={true}>
          {classes?.map((yearCollege: any, index: any) => {
            return (
              <IonAccordion value={yearCollege.year_college} key={index}>
                <IonItem slot="header" color="light">
                  <IonLabel className='ion-text-center'>{yearCollege.year_college}</IonLabel>
                </IonItem>

                {yearCollege.data.map((classData: any, indexClassData: any) => {
                  return (
                    <IonItem slot="content" key={indexClassData} >
                      <IonGrid>
                        <IonRow className="ion-justify-content-between ion-align-items-center ion-text-center">
                          <IonCol className="ion-align-self-center" size="8">
                            <Link
                              style={{ padding: '0', margin: '0', textDecoration: 'none' }} to={`/class/${classData.class_id}/${classData.name}/${classData.speciality}`}>
                              <IonText color="white">
                                {`${classData.name} ${classData.speciality} ${classData.level}`}
                              </IonText>
                            </Link>
                          </IonCol>
                          <IonCol className="ion-align-self-center" size="4">
                            <IonButton
                              size="small"
                              onClick={() => handleOpenModal(classData)}
                            >
                              <IonIcon src={updateIcon} />
                            </IonButton>
                            <IonButton
                              size="small"
                              onClick={() => handleOpenDeleteConfirmation(classData.class_id)}
                            >
                              <IonIcon src={deleteIcon} />
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid>

                      {/* Delete Confirmation Modal */}
                      <IonModal
                        id={`delete-confirmation-modal-${classData.class_id}`}
                        isOpen={isDeleteConfirmationOpen && deleteItemId === classData.class_id}
                        onDidDismiss={handleCloseDeleteConfirmation}
                      >
                        <IonToolbar>
                          <IonTitle>Confirm Delete</IonTitle>
                          <IonButtons slot="end">
                            <IonButton onClick={handleCloseDeleteConfirmation}>
                              Cancel
                            </IonButton>
                            <IonButton color="danger" onClick={async () => {
                              await supabase.from('class').delete().eq('class_id', deleteItemId);
                              handleCloseDeleteConfirmation();
                            }}>
                              Delete
                            </IonButton>
                          </IonButtons>
                        </IonToolbar>
                        <IonContent className='ion-text-center' style={{ '--padding-top': '16px' }}>
                          <IonText>
                            <IonText color="warning">
                              <IonIcon icon={warning}></IonIcon>
                            </IonText>
                            {" "}
                            Are you sure you want to delete this class?
                            <br />
                            that will cause to all groups to delete !
                          </IonText>
                        </IonContent>
                      </IonModal>

                      {/* Update Modal */}
                      {classId === classData.class_id && (
                        <IonModal id="update-modal" ref={modal} isOpen={isModalOpen} onDidDismiss={handleCloseModal}>
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
                              name: classData.name,
                              speciality: classData.speciality,
                              level: classData.level,
                              year_college: classData.year_college,
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
                                    <IonButton color="warning" type="submit">Submit</IonButton>
                                  </IonItem>
                                </IonList>
                              </Form>
                            )}
                          </Formik>
                        </IonModal>
                      )}
                    </IonItem>
                  )
                })}

              </IonAccordion>
            )
          })}
        </IonAccordionGroup>


      </IonContent>
    </React.Fragment>
  );
};

export default ClassPage;