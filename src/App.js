import { useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import HomeMenu from './components/HomeMenu';
import Home from './components/Home';
import Friends from './components/Friends';
import Login from './components/Login';
import Loading from './components/Loading';
import PrivateRoute from './components/PrivateRoute';

import Context from './context';

import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [cometChat, setCometChat] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(4);

  useEffect(() => {
    initAuthUser();
    initCometChat();
  }, []);

  const initAuthUser = () => {
    const authenticatedUser = localStorage.getItem('auth');
    if (authenticatedUser) {
      setUser(JSON.parse(authenticatedUser));
    }
  };

  const initCometChat = async () => {
    const { CometChat } = await import('@cometchat-pro/chat');
    const appID = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const region = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      error => {
      }
    );
  }

  return (
    <Context.Provider value={{ isLoading, setIsLoading, user, setUser, cometChat, selectedMenu, setSelectedMenu }}>
      <Router>
        {user && <HomeMenu />}
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/friends" component={Friends} />
          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
      {isLoading && <Loading />}
    </Context.Provider>
  );
}

export default App;
