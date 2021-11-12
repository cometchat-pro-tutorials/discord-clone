import { useState, useContext } from 'react';

import Header from './Header';

import Context from '../../context';

import RightSidebar from './RightSidebar';
import { CometChatMessages  } from '../../cometchat-pro-react-ui-kit/CometChatWorkspace/src';

const Main = () => {
  const { setIsLoading } = useContext(Context);

  return (
    <div className="server__main">
      <Header />
      <div className="server__container">
        <div className="server__container-body">
          
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};
export default Main;