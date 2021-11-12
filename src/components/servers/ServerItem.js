const ServerItem = (props) => {
  const { onItemClicked, item } = props;

  return (
    <div className="server__list-item" onClick={onItemClicked}>
      <div className="server__list-item-left">
        <img src={item.icon} alt="icon" />
        <span>{item.title}</span>
      </div>
      <div className="server__list-item-right">
        <img src={item.arrow} alt="arrow" />
      </div>
    </div>
  );
};
export default ServerItem;