import { useState } from "react";
import Channel from './Channel';

const Channels = (props) => {
  const { title, channelType, channels, onItemClicked } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(previous => !previous);
  };

  return (
    <div className="channels">
      <div className="channels__title" onClick={toggleExpand}>
        <div className={`channel__title-left ${isExpanded ? 'channel__title-left--active' : ''}`}>
          <svg className="arrow-gKvcEx icon-2yIBmh" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path></svg>
        </div>
        <div className="channel__title-right">
          <span>{title}</span>
        </div>
      </div>
      {isExpanded && <div className="channels__list">
        {channels && channels.map(channel => <Channel key={channel.guid} channelType={channelType} channel={channel} onItemClicked={onItemClicked} />)}
      </div>}
    </div>
  );
};
export default Channels;