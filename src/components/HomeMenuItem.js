const HomeMenuItem = (props) => {
  const { isActive, onItemSelected, item } = props;
  return (
    <div className={`home__menu-item ${isActive ? 'home__menu-item--active' : ''}`} onClick={onItemSelected(item)}>{item.icon}</div>
  );
};
export default HomeMenuItem;