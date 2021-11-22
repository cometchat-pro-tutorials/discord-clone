import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Context from '../Context';

const Header = () => {
  const { user, setUser, cometChat } = useContext(Context);

  const history = useHistory();

  const logout = async () => {
    const isLogout = window.confirm('Do you want to log out ?');
    if (isLogout) {
      await cometChat.logout();
      setUser(null);
      localStorage.removeItem('auth');
      history.push('/login');
    }
  }

  return (
    <div className="header">
      <div className="header__left">
        <img src={logoWhite} alt="Uber Clone" />
        {
          user && (
            <div className="header__right">
              <img src={user.avatar} alt={user.email}/>
              <span>Hello, {user.email}</span>
            </div>
          )
        }
      </div>
      <span className="header__logout" onClick={logout}><span>Logout</span></span>
    </div>
  );
}

export default Header;