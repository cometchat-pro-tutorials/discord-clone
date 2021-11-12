const Search = (props) => {
  const { onSearchChanged } = props;

  const onChanged = (e) => {
    const keywords = e.target.value.trim();
    onSearchChanged(keywords);
  };

  return (
    <div className="add-friend__search">
      <span className="add-friend__search-title">Add Friend</span>
      <p className="add-friend__search-sub-title">You can add a friend by searching their names!</p>
      <input type="text" placeholder="Enter Username" onChange={onChanged} />
    </div>
  );
};
export default Search;