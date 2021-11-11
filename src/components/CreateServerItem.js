const CreateServerItem = (props) => {
  const { item } = props;

  return (
    <div className="cs__li">
      <div className="cs__li-left">
        <img src={item.icon} alt="cs1" />
        <span>{item.title}</span>
      </div>
      <div className="cs__li-right">
        <img src={item.arrow} alt="cs8" />
      </div>
    </div>
  );
};
export default CreateServerItem;