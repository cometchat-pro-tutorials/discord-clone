import { useEffect, useContext } from 'react';
import Sidebars from './Sidebars';
import Main from './Main';
import Context from '../../context';

const Server = () => {
  const { setSelectedChannel } = useContext(Context);

  useEffect(() => {
    return () => {
      setSelectedChannel(null);
    }
  }, [setSelectedChannel]);

  return (
    <div className="server__container">
      <Sidebars />
      <Main />
    </div>
  );
};
export default Server;