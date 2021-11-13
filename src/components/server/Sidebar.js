const Sidebar = (props) => {
  const { member } = props;

  if (!member) {
    return <></>
  }

  return (
    <div className="group-members__list-item">
      <div className="group-members__list-item-avatar">
        <div className={`group-members__list-item-status ${member.status === 'online' ? 'group-members__list-item-status--online' : ''}`}></div>
        <img src={member.avatar} alt="grou-member-avatar" />
      </div>
      <span>{member.name}</span>
    </div>
  );
};
export default Sidebar;