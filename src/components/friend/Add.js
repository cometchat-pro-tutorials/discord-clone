import { useEffect, useState, useContext } from 'react';
import Search from './Search';
import Users from './Users';
import Context from '../../context';
import { realTimeDb } from '../../firebase';

const Add = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [users, setUsers] = useState(null);

  const { setIsLoading } = useContext(Context);

  let loadCurrentUser = null;
  let loadUsers = null;

  useEffect(() => {
    loadCurrentUser();
    return () => {
      setUsers([]);
    }
  }, [loadCurrentUser]);

  useEffect(() => {
    if (authenticatedUser) {
      loadUsers();
    }
  }, [authenticatedUser, loadUsers]);

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

  const isFriend = (friends, id) => {
    if (!friends || !friends.length) {
      return false;
    }
    for (const friend of friends) {
      if (friend && friend.id === id) {
        return true;
      }
    }
    return false;
  };

  const isWaiting = (waiting, id) => {
    if (!waiting || !waiting.length) {
      return false;
    }
    for (const w of waiting) {
      if (w.id === id) {
        return true;
      }
    }
    return false;
  };

  const isPending = (pending, id) => { 
    if (!pending || !pending.length) {
      return false;
    }
    for (const p of pending) {
      if (p.id === id) {
        return true;
      }
    }
    return false;
  };

  const isNotFriend = (authenticatedUser, user) => {
    if (!authenticatedUser || !user) {
      return false;
    }
    const id = user.id;
    if (authenticatedUser.id && authenticatedUser.id === user.id) {
      return false;
    }
    if (isFriend(authenticatedUser.friends, id)) {
      return false;
    }
    if (isWaiting(authenticatedUser.waiting, id)) {
      return false;
    }
    if (isPending(authenticatedUser.pending, id)) {
      return false;
    }
    return true;
  }

  const filterUsers = (authenticatedUser, users) => {
    if (!authenticatedUser || !users || !users.length) {
      return;
    }
    const filteredUsers = users.filter(user => isNotFriend(authenticatedUser, user));
    setUsers(() => filteredUsers);
  };

  loadUsers = (name = '') => {
    realTimeDb.ref().child('users').orderByChild('fullname').startAt(name).endAt(name + "\uf8ff").on("value", function (snapshot) {
      const values = snapshot.val();
      if (values && values.length !== 0) {
        const keys = Object.keys(values);
        const users = keys.map(key => values[key]);
        filterUsers(authenticatedUser, users);
      } else {
        setUsers(() => []);
      }
    });
  };

  const onSearchChanged = (keywords) => {
    const name = keywords && keywords.length ? keywords : '';
    loadUsers(name);
  };

  const updateUser = async (user) => {
    if (!user) {
      return;
    }
    await realTimeDb.ref(`users/${user.id}`).set(user);
  };

  const updateUsers = async (authenticatedUser, selectedUser) => {
    if (!authenticatedUser || !selectedUser) {
      return;
    }
    setIsLoading(true);
    const authenticatedUserPending = { id: authenticatedUser.id, fullname: authenticatedUser.fullname, email: authenticatedUser.email, avatar: authenticatedUser.avatar };
    const selectedUserPending = { id: selectedUser.id, fullname: selectedUser.fullname, email: selectedUser.email, avatar: selectedUser.avatar };
    authenticatedUser.waiting = authenticatedUser.waiting && authenticatedUser.waiting.length ? [...authenticatedUser.waiting, selectedUserPending] : [selectedUserPending];
    selectedUser.pending = selectedUser.pending && selectedUser.pending.length ? [...selectedUser.pending, authenticatedUserPending] : [authenticatedUserPending];
    await updateUser(authenticatedUser);
    await updateUser(selectedUser);
    setIsLoading(false);
    alert(`The request was sent to ${selectedUser.fullname} successfully`);
  }

  const onConfirmShown = async (selectedUser) => {
    const shoudRequestSent = window.confirm(`Would you like to add ${selectedUser.fullname} as a friend`);
    if (shoudRequestSent) { 
      await updateUsers(authenticatedUser, selectedUser);
    }
  }

  return (
    <div className="add-friend">
      <Search onSearchChanged={onSearchChanged} />
      <Users users={users} onConfirmShown={onConfirmShown} />
    </div>
  );
};
export default Add;