const FriendsMainHeader = (props) => {
  const { onItemSelected, selectedOption } = props;

  const selectItem = (index) => () => {
    onItemSelected(index);
  };

  return (
    <div className="friends__main-header">
      <span onClick={selectItem(1)} className={`${selectedOption === 1 ? 'friends__main-header--active' : ''}`}>Online</span>
      <span onClick={selectItem(2)} className={`${selectedOption === 2 ? 'friends__main-header--active' : ''}`}>All</span>
      <span onClick={selectItem(3)} className={`${selectedOption === 3 ? 'friends__main-header--active' : ''}`}>Pending</span>
      <span onClick={selectItem(4)} className="friends__add-friend">Add Friend</span>
    </div>
  );
};
export default FriendsMainHeader;