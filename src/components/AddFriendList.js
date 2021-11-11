import { useState, useEffect, useContext } from 'react';

import Context from '../context';
import { realTimeDb } from '../firebase';

const AddFriendList = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [users, setUsers] = useState(null);

  const { setIsLoading } = useContext(Context);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (authenticatedUser) {
      loadUsers();
    }
  }, [authenticatedUser]);

  const loadCurrentUser = () => {
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

  const isNotFriend = (authenticatedUser, user) => {
    if (!authenticatedUser || !user) {
      return false;
    }
    const id = user.id;
    if (authenticatedUser.id && authenticatedUser.id === user.id) {
      return false;
    }
    if (authenticatedUser.friends && authenticatedUser.friends.length && authenticatedUser.friends.includes(id)) {
      return false;
    }
    if (authenticatedUser.waiting && authenticatedUser.waiting.length && authenticatedUser.waiting.includes(id)) {
      return false;
    }
    if (authenticatedUser.pending && authenticatedUser.pending.length && authenticatedUser.pending.includes(id)) {
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

  const loadUsers = () => {
    realTimeDb.ref().child('users').orderByChild('name').on("value", function (snapshot) {
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

  return <></>;
};
export default AddFriendList;