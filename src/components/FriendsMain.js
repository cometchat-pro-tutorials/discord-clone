import { useState, useEffect } from 'react';

import FriendsMainHeader from './FriendsMainHeader';
import NotFound from './NotFound';
import AddFriend from './AddFriend';
import ActiveNow from './ActiveNow';

const FriendsMain = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    loadFriends();
    return () => {
      setFriends([]);
    }
  }, []);

  const loadFriends = () => {

  };

  const onItemSelected = (index) => {
    setSelectedOption(() => index);
  }

  const renderMain = () => {
    if (selectedOption === 4) {
      return <AddFriend />;
    }
    if (!friends || !friends.length) {
      return <NotFound />;
    }
  };

  return (
    <div className="friends__main">
      <FriendsMainHeader onItemSelected={onItemSelected} selectedOption={selectedOption} />
      <div className="friends__container">
        <div>
          {renderMain()}
        </div>
        <ActiveNow />
      </div>
    </div>
  );
};
export default FriendsMain;