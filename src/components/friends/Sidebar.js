const Sidebar = (props) => {
  const { friend, onItemClicked } = props;

  if (!friend) {
    return <></>
  }

  const selectFriend = () => {
    onItemClicked(friend);
  };

  return (
    <div className="friends__list-item" onClick={selectFriend}>
      <div>
        <img src={friend.avatar} alt="friend-avatar" />
      </div>
      <span>{friend.name}</span>
    </div>
  );
};
export default Sidebar;