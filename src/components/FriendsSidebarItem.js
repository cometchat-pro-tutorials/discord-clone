import cs1 from '../images/cs1.png';

const FriendsSidebarItem = (props) => {
  const { friend } = props;

  if (!friend) {
    return <></>
  }

  return (
    <div className="friends__li">
      <div>
        <img src={friend.image} alt="friend-avatar" />
      </div>
      <span>{friend.name}</span>
    </div>
  );
};
export default FriendsSidebarItem;