const Menu = (props) => {
  const { isActive, onItemSelected, item } = props;
  return (
    <div className={`menu__item ${isActive ? 'menu__item--active' : ''}`} onClick={onItemSelected(item)}>{item.icon}</div>
  );
};
export default Menu;