import { useState, useEffect, useContext } from 'react';

import withModal from '../common/Modal';
import Create from '../channel/Create';
import Sidebar from './Sidebar';

import Context from '../../context';

const Sidebars = (props) => {
  const { toggleModal } = props;

  const { cometChat, user, setIsLoading } = useContext(Context);

  useEffect(() => {
    if (cometChat) {
      listenCustomMessages();
    }
    return () => {
      if (cometChat) {
        cometChat.removeMessageListener(user.id);
      }
    }
  }, [cometChat]);

  const listenCustomMessages = () => {
    cometChat.addMessageListener(
      user.id,
      new cometChat.MessageListener({
        onCustomMessageReceived: customMessage => {
          if (customMessage && customMessage.sender && customMessage.sender.uid && customMessage.sender.uid !== user.id && customMessage.data && customMessage.data.customData && customMessage.data.customData.message) {
            if (customMessage && customMessage.type && customMessage.type === 'group') {
            }
          }
        }
      })
    );
  };

  const createChannel = () => { 
    toggleModal(true);
  };

  return (
    <div className="server__sidebar">
      <div className="server__header">
        <div className="server__header-left">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.5rem', height: '1.5rem' }} className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
          </span>
          <span className="server__header-title">Server</span>
        </div>
        <div className="server__header-right" onClick={createChannel}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
      <div className="server__list">
      </div>
    </div>
  );
};
export default withModal(Create)(Sidebars);