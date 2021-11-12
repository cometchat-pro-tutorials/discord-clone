import { useState, useEffect, useContext } from 'react';

import Sidebar from './Sidebar';

import Context from '../../context';

const Sidebars = () => {
  const [friends, setFriends] = useState([]);

  const { cometChat, user, hasNewFriend, setHasNewFriend, setSelectedFriend } = useContext(Context);

  useEffect(() => {
    if (hasNewFriend) {
      loadFriends();
    }
  }, [hasNewFriend]);

  useEffect(() => {
    if (user) {
      loadFriends();
    }
    if (cometChat && user) {
      listenCustomMessages();
    }
    return () => {
      setFriends([]);
      setSelectedFriend(null);
      if (cometChat) {
        cometChat.removeMessageListener(user.id);
      }
    }
  }, [user, cometChat]);

  const loadFriends = () => {
    const cometChatAppId = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const cometChatAppRegion = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const cometChatApiKey = `${process.env.REACT_APP_COMETCHAT_API_KEY}`;
    const url = `https://${cometChatAppId}.api-${cometChatAppRegion}.cometchat.io/v3/users/${user.id}/friends`;
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        apiKey: cometChatApiKey,
      }
    };
    fetch(url, options)
      .then((res) => {
        res.json().then(data => setFriends(data.data));
        setHasNewFriend(false);
      })
      .catch((err) => {
      });
  };

  const listenCustomMessages = () => {
    cometChat.addMessageListener(
      user.id,
      new cometChat.MessageListener({
        onCustomMessageReceived: customMessage => {
          if (customMessage && customMessage.sender && customMessage.sender.uid && customMessage.sender.uid !== user.id && customMessage.data && customMessage.data.customData && customMessage.data.customData.message) {
            if (customMessage && customMessage.type && customMessage.type === 'friend') {
              loadFriends();
            }
          }
        }
      })
    );
  };

  const openFriendManagement = () => {
    setSelectedFriend(null);
  };

  const selectFriend = (friend) => {
    if (!friend) {
      return;
    }
    setSelectedFriend(friend);
  };

  return (
    <div className="friends__sidebar">
      <div className="friends__header" onClick={openFriendManagement}>
        <span>
          <svg className="linkButtonIcon-Mlm5d6" aria-hidden="false" width="16" height="16" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path fill="currentColor" fillRule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g></svg>
        </span>
        <span className="friends__header-title">Friends</span>
      </div>
      <span className="friends__title">Direct Messages</span>
      <div className="friends__list">
        {friends && friends.map(friend => <Sidebar key={friend.uid} friend={friend} onItemClicked={selectFriend} />)}
      </div>
    </div>
  );
};
export default Sidebars;