const ServerItem = (props) => {
  const { onItemClicked, item } = props;

  return (
    <div className="s__li" onClick={onItemClicked}>
      <div className="s__li-left">
        <img src={item.icon} alt="icon" />
        <span>{item.title}</span>
      </div>
      <div className="s__li-right">
        <img src={item.arrow} alt="arrow" />
      </div>
    </div>
  );
};
export default ServerItem;