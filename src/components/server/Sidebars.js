import { useState, useEffect, useContext } from 'react';
import withModal from '../common/Modal';
import Create from '../channel/Create';
import Channels from '../channel/Channels';
import Context from '../../context';
import { realTimeDb } from '../../firebase';

const Sidebars = (props) => {
  const { toggleModal } = props;

  const [textChannels, setTextChannels] = useState([]);
  const [voiceChannels, setVoiceChannels] = useState([]);

  const { cometChat, user, setSelectedChannel, setSelectedChannelType } = useContext(Context);

  let listenCustomMessages = null;

  useEffect(() => {
    loadTextChannels();
    loadVoiceChannels();
    return () => {
      setTextChannels([]);
      setVoiceChannels([]);
    }
  }, []);

  useEffect(() => {
    if (cometChat) {
      listenCustomMessages();
    }
    return () => {
      if (cometChat) {
        cometChat.removeMessageListener(user.id);
      }
    }
  }, [cometChat, listenCustomMessages, user]);

  const loadTextChannels = () => {
    realTimeDb.ref().child('text-channels').orderByChild('name').on("value", function (snapshot) {
      const val = snapshot.val();
      if (val) {
        const keys = Object.keys(val);
        const channels = keys.map(key => val[key]);
        setTextChannels(() => channels);
      }
    });
  };

  const loadVoiceChannels = () => {
    realTimeDb.ref().child('voice-channels').orderByChild('name').on("value", function (snapshot) {
      const val = snapshot.val();
      if (val) {
        const keys = Object.keys(val);
        const channels = keys.map(key => val[key]);
        setVoiceChannels(() => channels);
      }
    });
  };

  listenCustomMessages = () => {
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

  const setActiveChannel = (selectedChannel) => {
    if (!selectedChannel) {
      return;
    }
    setTextChannels(previousChannels => previousChannels.map(channel => channel.guid === selectedChannel.guid ? { ...selectedChannel, isActive: true } : { ...channel, isActive: false }));
    setVoiceChannels(previousChannels => previousChannels.map(channel => channel.guid === selectedChannel.guid ? { ...selectedChannel, isActive: true } : { ...channel, isActive: false }));
  };

  const joinCometChatGroup = async (selectedChannel) => {
    if (!selectedChannel) {
      return;
    }
    await cometChat.joinGroup(selectedChannel.guid, 'public', '');
  };

  const joinFirebaseChannel = async ({ latestSelectedChannel, user, convertedChannelType }) => {
    if (!latestSelectedChannel || !user) {
      return;
    }
    latestSelectedChannel.members = latestSelectedChannel.members && latestSelectedChannel.members.length ? [...latestSelectedChannel.members, user.id] : [user.id];
    await await realTimeDb.ref(`${convertedChannelType}/${latestSelectedChannel.guid}`).set(latestSelectedChannel);
  };

  const getLatestSelectedChannel = async (guid, channelType) => {
    if (!guid || !channelType) {
      return null;
    }
    const snapshot = await realTimeDb.ref().child(channelType).orderByChild('guid').equalTo(guid).once("value");
    const val = snapshot.val();
    if (!val) {
      return null;
    }
    if (val) {
      const keys = Object.keys(val);
      return val[keys[0]];
    }

  };

  const onChannelSelected = async (selectedChannel, channelType) => {
    if (!selectedChannel || !channelType) {
      return;
    }
    const convertedChannelType = channelType === 1 ? 'text-channels' : 'voice-channels';
    const latestSelectedChannel = await getLatestSelectedChannel(selectedChannel.guid, convertedChannelType);
    if (latestSelectedChannel && (!latestSelectedChannel.members || !latestSelectedChannel.members.includes(user.id))) {
      await joinFirebaseChannel({ latestSelectedChannel, user, convertedChannelType });
      await joinCometChatGroup(latestSelectedChannel);
    }
    setActiveChannel(selectedChannel);
    setSelectedChannel(selectedChannel);
    setSelectedChannelType(channelType);
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
        <Channels title='Text Channels' channels={textChannels} channelType={1} onItemClicked={onChannelSelected} />
        <Channels title='Voice Channels' channels={voiceChannels} channelType={2} onItemClicked={onChannelSelected} />
      </div>
    </div>
  );
};
export default withModal(Create)(Sidebars);