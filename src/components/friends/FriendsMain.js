import { useState, useContext } from 'react';

import FriendsMainHeader from './FriendsMainHeader';
import FriendsPendingList from './FriendsPendingList';
import AddFriend from './AddFriend';
import ActiveNow from './ActiveNow';

import Context from '../../context';

import { CometChatMessages  } from '../../cometchat-pro-react-ui-kit/CometChatWorkspace/src';

const FriendsMain = () => {
  const [selectedOption, setSelectedOption] = useState(1);

  const { selectedFriend, setSelectedFriend } = useContext(Context);

  const onItemSelected = (index) => {
    setSelectedOption(() => index);
    setSelectedFriend(null);
  }

  const renderMain = () => {
    if (selectedFriend) {
      return <CometChatMessages chatWithUser={selectedFriend.uid} />;
    }
    if (selectedOption === 1) {
      return <FriendsPendingList />;
    }
    if (selectedOption === 3) {
      return <AddFriend />;
    }
  };

  return (
    <div className="friends__main">
      <FriendsMainHeader onItemSelected={onItemSelected} selectedOption={selectedOption} />
      <div className="friends__container">
        <div className="friends__container-body">
          {renderMain()}
        </div>
        <ActiveNow />
      </div>
    </div>
  );
};
export default FriendsMain;