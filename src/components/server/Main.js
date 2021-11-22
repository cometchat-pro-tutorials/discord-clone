import { useEffect, useContext } from 'react';

import { CometChatMessages } from '../../cometchat-pro-react-ui-kit/CometChatWorkspace/src';
import Header from './Header';
import RightSidebar from './RightSidebar';

import Context from '../../context';

const Main = () => {
  const { cometChat, selectedChannel, selectedChannelType, setSelectedChannelType } = useContext(Context);

  let startDirectCall = null;

  useEffect(() => {
    if (cometChat && selectedChannel && selectedChannelType === 2) {
      startDirectCall();
    }
  }, [cometChat, selectedChannel, selectedChannelType, startDirectCall]);

  startDirectCall = () => {
    if (cometChat && selectedChannel && selectedChannelType === 2) {
      const sessionID = selectedChannel.guid;
      const audioOnly = false;
      const defaultLayout = true;
      const callSettings = new cometChat.CallSettingsBuilder()
        .enableDefaultLayout(defaultLayout)
        .setSessionID(sessionID)
        .setIsAudioOnlyCall(audioOnly)
        .build();
      const callSceen = document.getElementById("call__screen");
      callSceen.classList.add('call__screen--active');
      cometChat.startCall(
        callSettings,
        document.getElementById("call__screen"),
        new cometChat.OngoingCallListener({
          onUserListUpdated: userList => {
          },
          onCallEnded: call => {
            callSceen.classList.remove('call__screen--active');
            setSelectedChannelType(null);
          },
          onError: error => {
            callSceen.classList.remove('call__screen--active');
            setSelectedChannelType(null);
          },
          onMediaDeviceListUpdated: deviceList => {
          },
          onUserMuted: (userMuted, userMutedBy) => {
          },
          onScreenShareStarted: () => {
          },
          onScreenShareStopped: () => {
          }
        })
      );
    }
  };

  return (
    <>
      <div className="server__main">
        <Header />
        <div className="server__container">
          <div className="server__container-body">
            {selectedChannel && selectedChannelType === 1 && <CometChatMessages chatWithGroup={selectedChannel.guid} />}
          </div>
          <RightSidebar />
        </div>
      </div>
      <div id="call__screen"></div>
    </>
  );
};
export default Main;