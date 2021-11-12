const CommunityItem = (props) => {
  const { item, onItemClicked } = props;

  const selectItem = () => {
    onItemClicked(item);
  };

  return (
    <div className="feature-communities__list-item" onItemClicked={selectItem}>
      <img src={item.image} alt={item.name} />
      <span className="feature-communities__list-item-title">{item.name}</span>
      <p className="feature-communities__list-item-description">{item.description}</p>
      <span className="feature-communities__indicator"></span>
      <span className="feature-communities__list-item-n-members">
        {item.nMembers ? item.nMembers: 0} members
      </span>
    </div>
  )
};
export default CommunityItem;