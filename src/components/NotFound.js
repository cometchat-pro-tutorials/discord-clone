import notFound from '../images/404.png';

const NotFound = () => {
  return (
    <div className="nf">
      <img src={notFound} alt="404"/>
      <p>No one's around to play with Wumpus.</p>
    </div>
  );
};
export default NotFound; 