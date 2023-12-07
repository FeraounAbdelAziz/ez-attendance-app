import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import { supabase } from '../supabaseClient'
import './Page.css';
import TableMUI from './TableMUI';

const Page = () => {
  const { name } = useParams<{ name: string; }>();

  const [classes, setClasses] = useState([]);


  async function getClass() {
    const { data } = await supabase
      .from('class')
      .select('*')
    return data || [];
  }

  useEffect(() => {
    getClass().then((data: any) => setClasses(data));
  }, []);



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

        {/* <div style={{ display: 'flex' , justifyContent : "space-between"}}>
      <div style={{ width : "250px" ,height : "50px",display : "flex", alignItems : "center",justifyContent :"center", backgroundColor: 'red' }}>Red</div>
      <div style={{ width : "250px" ,height : "50px",display : "flex", alignItems : "center",justifyContent :"center", backgroundColor: 'green' }}>Green</div>
      <div style={{ width : "250px" ,height : "50px",display : "flex", alignItems : "center",justifyContent :"center", backgroundColor: 'blue' }}>Blue</div>
    </div> */}
        <TableMUI />
        {
          classes?.map((classItem: { name: string; year: number }, index) => {
            return <ul>
              <li key={index}>class name: {classItem.name} class year: {classItem.year}</li>
            </ul>;
          })
        }
        {/* <ExploreContainer name={name} /> */}
      </IonContent>
    </IonPage>
  );
};

export default Page;
