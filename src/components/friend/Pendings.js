import { useEffect, useState, useContext } from 'react';
import SubHeader from "./SubHeader";
import Pending from './Pending';
import NotFound from './NotFound';
import Context from '../../context';
import { realTimeDb } from '../../firebase';

const Pendings = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [users, setUsers] = useState(null);

  const { cometChat, setIsLoading, setHasNewFriend } = useContext(Context);

  let loadCurrentUser = null;
  let loadPendingRequests = null;

  useEffect(() => {
    loadCurrentUser();
    return () => {
      setAuthenticatedUser(null);
      setUsers(null);
    }
  }, [loadCurrentUser]);

  useEffect(() => {
    if (authenticatedUser) {
      loadPendingRequests();
    }
  }, [authenticatedUser, loadPendingRequests]);

  loadCurrentUser = () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem('auth'));
    realTimeDb.ref().child('users').orderByChild('email').equalTo(user.email).on("value", function (snapshot) {
      const val = snapshot.val();
      if (val) {
        const keys = Object.keys(val);
        const user = val[keys[0]];
        setAuthenticatedUser(user);
        setIsLoading(false);
      }
    });
  };

  loadPendingRequests = () => {
    if (!authenticatedUser) {
      return;
    }
    setIsLoading(true);
    realTimeDb.ref().child('users').orderByChild('email').equalTo(authenticatedUser.email).on("value", function (snapshot) {
      const val = snapshot.val();
      if (val) {
        const keys = Object.keys(val);
        const user = val[keys[0]];
        setUsers(() => user.pending ? user.pending : []);
        setIsLoading(false);
      }
    });
  };

  const updateUser = async (user) => {
    if (!user) {
      return;
    }
    await realTimeDb.ref(`users/${user.id}`).set(user);
  };

  const updateSelectedUser = async (selectedUser, authenticatedUser) => {
    if (!selectedUser || !authenticatedUser) {
      return;
    }
    selectedUser.waiting = selectedUser.waiting && selectedUser.waiting.length ? selectedUser.waiting.filter(w => w.id !== authenticatedUser.id) : [];
    await updateUser(selectedUser);
  };

  const updateAuthenticatedUser = async (selectedUser, authenticatedUser) => {
    if (!selectedUser || !authenticatedUser) {
      return;
    }
    authenticatedUser.pending = authenticatedUser.pending && authenticatedUser.pending.length ? authenticatedUser.pending.filter(p => p.id !== selectedUser.id) : [];
    await updateUser(authenticatedUser);
  };

  const addFirebaseFriend = async (selectedUser, authenticatedUser) => {
    if (!selectedUser || !authenticatedUser) {
      return;
    }
    const authenticatedUserFriend = { id: authenticatedUser.id, fullname: authenticatedUser.fullname, email: authenticatedUser.email, avatar: authenticatedUser.avatar };
    const selectedUserFriend = { id: selectedUser.id, fullname: selectedUser.fullname, email: selectedUser.email, avatar: selectedUser.avatar };

    authenticatedUser.friends = authenticatedUser.friends && authenticatedUser.friends.length ? [...authenticatedUser.friends, selectedUserFriend] : [selectedUserFriend];
    selectedUser.friends = selectedUser.friends && selectedUser.friends.length ? [...selectedUser.friends, authenticatedUserFriend] : [authenticatedUserFriend];

    await updateUser(authenticatedUser);
    await updateUser(selectedUser);
  };

  const sendCustomMessage = ({ message, type, receiverId }) => {
    const receiverID = receiverId;
    const customType = type;
    const receiverType = cometChat.RECEIVER_TYPE.USER;
    const customData = { message };
    const customMessage = new cometChat.CustomMessage(receiverID, receiverType, customType, customData);

    cometChat.sendCustomMessage(customMessage).then(
      message => {
      },
      error => {
      }
    );
  };

  const addCometChatFriend = async (selectedUser, authenticatedUser) => {
    if (!selectedUser || !authenticatedUser) {
      return;
    }
    const cometChatAppId = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const cometChatAppRegion = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const cometChatApiKey = `${process.env.REACT_APP_COMETCHAT_API_KEY}`;
    const url = `https://${cometChatAppId}.api-${cometChatAppRegion}.cometchat.io/v3/users/${authenticatedUser.id}/friends`;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        appId: cometChatAppId,
        apiKey: cometChatApiKey,
      },
      body: JSON.stringify({ accepted: [selectedUser.id] }),
    };
    const response = await fetch(url, options);
    if (response) {
      const customMessage = {
        message: `${authenticatedUser.fullname} has accepted your friend request`,
        type: 'friend',
        receiverId: selectedUser.id
      };
      sendCustomMessage(customMessage);
      setHasNewFriend(true);
      alert(`${selectedUser.fullname} was added as a friend succesfully`);
    } else {
      alert(`Failure to add ${selectedUser.fullname} as a friend`);
    }
    setIsLoading(false);
  };

  const onAccepted = async (selectedUser) => {
    if (!selectedUser) {
      return;
    }
    const shouldAddFriend = window.confirm('Would you like to accept this request?');
    if (shouldAddFriend) {
      const snapshot = await realTimeDb.ref().child('users').orderByChild('email').equalTo(selectedUser.email).once("value");
      const val = snapshot.val();
      if (val) {
        const keys = Object.keys(val);
        const user = val[keys[0]];
        await updateSelectedUser(user, authenticatedUser);
        await updateAuthenticatedUser(user, authenticatedUser);
        await addFirebaseFriend(user, authenticatedUser);
        await addCometChatFriend(user, authenticatedUser);
      }
    }
  };

  const onRejected = async (selectedUser) => {
    if (!selectedUser) {
      return;
    }
    const shouldRequestRejected = window.confirm('Would you like to reject this request?');
    if (shouldRequestRejected) {
      const snapshot = await realTimeDb.ref().child('users').orderByChild('email').equalTo(selectedUser.email).once("value");
      const val = snapshot.val();
      if (val) {
        const keys = Object.keys(val);
        const user = val[keys[0]];
        await updateSelectedUser(user, authenticatedUser);
        await updateAuthenticatedUser(user, authenticatedUser);
      }
    }
  };

  if (!users || !users.length) {
    return <NotFound />;
  }

  return (
    <div className="friends__pl">
      <SubHeader title={`Pending - ${users.length}`} />
      {users.map(user => <Pending key={user.id} user={user} onAccepted={onAccepted} onRejected={onRejected} />)}
    </div>
  )
};
export default Pendings;