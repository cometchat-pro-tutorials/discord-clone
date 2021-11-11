import { useState, useEffect, useContext } from 'react';

import ServerItem from './ServerItem';

import Context from '../context';
import { realTimeDb } from '../firebase';

import cs8 from '../images/cs8.png';

const MyServer = (props) => {
  const { toggleModal } = props;

  const [servers, setServers] = useState([]);

  const { user, setIsLoading } = useContext(Context);

  useEffect(() => {
    loadServers();
  }, []);

  const isValid = (user, server) => {
    if (!user || !server || !server.members || !server.members.length) {
      return;
    }
    for (const member of server.members) {
      if (member.id === user.id) {
        return true;
      }
    }
    return false;
  }

  const filterServer = (user, servers) => {
    if (!servers || !servers.length) {
      return [];
    }
    const filteredServers = servers.filter(server => isValid(user, server));
    return filteredServers.map(server => ({ id: server.id, title: server.name, icon: server.image, arrow: cs8 }));
  };

  const loadServers = () => {
    setIsLoading(true);

    realTimeDb.ref().child('servers').on("value", function (snapshot) {
      setIsLoading(false);

      const vals = snapshot.val();

      if (vals && vals.length !== 0) {
        const keys = Object.keys(vals);
        const servers = keys.map(key => vals[key]);
        setServers(() => filterServer(user, servers));
      }
    });
  };

  const hide = () => {
    toggleModal(false);
  };

  const view = (item) => () => {
    console.log(item);
  };

  return (
    <div className="s">
      <div className="s__content">
        <div className="s__container">
          <div className="s__close" onClick={hide}>
            <svg className="closeIcon-150W3V" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
          </div>
        </div>
        <div className="s__subtitle">Your Servers</div>
        <p className="s__description">Your server is where you and your friends hang out.
          Make yours and start talking.</p>
        <div className="s__list">
          {servers.map((item) => <ServerItem key={item.id} item={item} onItemClicked={view(item)} />)}
        </div>
      </div>
    </div>
  );
};
export default MyServer;