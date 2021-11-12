const Sidebar = (props) => {
  const { channel, onItemClicked } = props;

  if (!channel) {
    return <></>
  }

  const selectChannel = () => {
    onItemClicked(channel);
  };

  return (
    <div className="server__list-item" onClick={selectChannel}>
      <div>
        <img src={channel.avatar} alt="friend-avatar" />
      </div>
      <span>{channel.name}</span>
    </div>
  );
};
export default Sidebar;