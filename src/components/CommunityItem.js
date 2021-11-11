const CommunityItem = (props) => {
  const { item } = props;

  return (
    <div className="fc__list-item">
      <img src={item.image} alt={item.name} />
      <span className="fc__list-item-title">{item.name}</span>
      <p className="fc__list-item-description">{item.description}</p>
      <span className="fc__indicator"></span>
      <span className="fc__list-item-n-members">
        {item.nMembers ? item.nMembers: 0} members
      </span>
    </div>
  )
};
export default CommunityItem;