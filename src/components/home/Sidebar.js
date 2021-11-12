const Sidebar = (props) => {
  const { isActive, onItemSelected, item } = props;
  return (
    <div className={`home__sidebar-item ${isActive ? 'home__sidebar-item--active' : ''}`} onClick={onItemSelected(item)}>
      <div>{item.icon}</div>
      <span>{item.title}</span>
    </div>
  );
};
export default Sidebar;