import React from 'react';
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/react';
import deleteIcon from "/assets/deleteIcon.svg";
import updateIcon from "/assets/updateIcon.svg";
interface ClassItemProps {
    classes: any[]; // or replace 'any[]' with the actual type of 'classes'
    handleOpenModal: (classItem: { class_id: any; }) => void;
    deleteClass: (value: any) => Promise<void>;
  }
  
  const ClassList: React.FC<ClassItemProps> = ({ classes, handleOpenModal, deleteClass }) => {
    return (
      <>
        {classes.map((classItem) => (
          <IonGrid key={classItem.class_id}>
            <IonRow className="ion-justify-content-between ion-align-items-center ion-text-center">
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
          </IonGrid>
        ))}
      </>
    );
  };
export default ClassList;