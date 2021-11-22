import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Menus from './components/common/Menus';
import Friend from './components/friend/Friend';
import Server from './components/server/Server';
import Login from './components/login/Login';
import Loading from './components/common/Loading';
import PrivateRoute from './components/common/PrivateRoute';
import Context from './context';
import './index.css';
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [cometChat, setCometChat] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(1);
  const [hasNewFriend, setHasNewFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedChannelType, setSelectedChannelType] = useState(null);

  useEffect(() => {
    initAuthUser();
    initCometChat();
    initSelectedMenu();
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

  const initSelectedMenu = () => {
    const url = window.location.href;
    setSelectedMenu(url.includes('server') ? 2 : 1);
  };

  return (
    <Context.Provider value={{ isLoading, setIsLoading, user, setUser, cometChat, selectedMenu, setSelectedMenu, hasNewFriend, setHasNewFriend, selectedFriend, setSelectedFriend, selectedChannel, setSelectedChannel, selectedChannelType, setSelectedChannelType }}>
      <Router>
        {user && <Menus />}
        <Switch>
          <PrivateRoute exact path="/" component={Friend} />
          <PrivateRoute exact path="/server" component={Server} />
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
