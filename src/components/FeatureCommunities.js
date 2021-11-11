import CommunityItem from './CommunityItem';

const FeatureCommunities = (props) => {
  const { communities } = props;
  
  return (
    <div className="fc__container">
      <h3>Feature Communities</h3>
      <div className="fc__list">
        {communities.map(item => <CommunityItem key={item.id} item={item} />)}        
      </div>
    </div>
  );
};
export default FeatureCommunities;