import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ display: 'flex' , justifyContent : "space-between"}}>
      <div style={{ width : "250px" ,height : "50px",display : "flex", alignItems : "center",justifyContent :"center", backgroundColor: 'red' }}>Red</div>
      <div style={{ width : "250px" ,height : "50px",display : "flex", alignItems : "center",justifyContent :"center", backgroundColor: 'green' }}>Green</div>
      <div style={{ width : "250px" ,height : "50px",display : "flex", alignItems : "center",justifyContent :"center", backgroundColor: 'blue' }}>Blue</div>
    </div>
        {/* <ExploreContainer name={name} /> */}
      </IonContent>
    </IonPage>
  );
};

export default Page;
