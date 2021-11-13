import User from './User';

const Users = (props) => {
  const { users, onConfirmShown } = props;

  if (!users || !users.length) { 
    return <></>;
  }

  return (
    <div className="add-friend__list">
      {users.map(user => <User key={user.id} user={user} onItemClicked={onConfirmShown} />)}
    </div>
  );
};
export default Users;