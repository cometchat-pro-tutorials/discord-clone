const Header = (props) => {
  const { onItemSelected, selectedOption } = props;

  const selectItem = (index) => () => {
    onItemSelected(index);
  };

  return (
    <div className="friends__main-header">
      <span onClick={selectItem(1)} className={`${selectedOption === 1 ? 'friends__main-header--active' : ''}`}>Pending</span>
      <span onClick={selectItem(3)} className="friends__add-friend">Add Friend</span>
    </div>
  );
};
export default Header;