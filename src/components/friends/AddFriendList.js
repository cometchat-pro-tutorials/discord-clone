import AddFriendListItem from './AddFriendListItem';

const AddFriendList = (props) => {
  const { users, onConfirmShown } = props;

  if (!users || !users.length) { 
    return <></>;
  }

  return (
    <div className="af__list">
      {users.map(user => <AddFriendListItem key={user.id} user={user} onItemClicked={onConfirmShown} />)}
    </div>
  );
};
export default AddFriendList;