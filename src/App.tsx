import { IonApp, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonRouterOutlet, IonSearchbar, IonSplitPane, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Menu from './components/Menu';
import ClassPage from './pages/ClassPage/Page';
import GroupPage from './pages/GroupPage/Page';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';


setupIonicReact();

const App: React.FC = () => {

  return (
    <IonApp>
      <IonPage>

        <IonReactRouter>
          <IonRouterOutlet>
            <Router>
              <Switch>
                <Route path="/class/:class_id/:class_name" component={GroupPage} />
                <Route exact path="/class" component={ClassPage} />
                <Redirect exact from="/" to="/class" />
              </Switch>
            </Router>
          </IonRouterOutlet>
        </IonReactRouter>

      </IonPage>

    </IonApp>
  );
};

export default App;
