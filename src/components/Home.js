import HomeMenu from './HomeMenu';
import HomeSidebar from './HomeSidebar';
import HomeMain from './HomeMain';

const Home = () => {
  return (
    <div className="home__container">
      <HomeMenu />
      <HomeSidebar />
      <HomeMain />
    </div>
  );
};

export default Home;