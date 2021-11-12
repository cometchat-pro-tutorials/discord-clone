import CommunityItem from './CommunityItem';

const FeatureCommunities = (props) => {
  const { communities, onItemClicked } = props;
  
  return (
    <div className="feature-communities__container">
      <h3>Feature Communities</h3>
      <div className="feature-communities__list">
        {communities.map(item => <CommunityItem key={item.id} item={item} onItemClicked={onItemClicked} />)}        
      </div>
    </div>
  );
};
export default FeatureCommunities;