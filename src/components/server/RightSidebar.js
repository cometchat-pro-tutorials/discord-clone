import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from "uuid";
import Sidebar from './Sidebar';
import Context from '../../context';

const RightSidebar = () => {
  const [members, setMembers] = useState([]);

  const { cometChat, selectedChannel } = useContext(Context);

  const userPresenseListenerId = useRef(uuidv4());

  let loadChannelMembers = null;
  let listenGroupChanges = null;
  let listenUserPresense = null;

  useEffect(() => {
    if (cometChat && selectedChannel) {
      loadChannelMembers();
      listenGroupChanges();
      listenUserPresense();
      return () => {
        setMembers([]);
        if (cometChat) {
          cometChat.removeGroupListener(selectedChannel.guid);
          cometChat.removeUserListener(userPresenseListenerId);
        }
      }
    }
  }, [cometChat, selectedChannel, loadChannelMembers, listenGroupChanges, listenUserPresense, userPresenseListenerId]);

  loadChannelMembers = useCallback(() => {
    const limit = 30;
    const groupMemberRequest = new cometChat.GroupMembersRequestBuilder(selectedChannel.guid)
      .setLimit(limit)
      .build();

    groupMemberRequest.fetchNext().then(
      groupMembers => {
        setMembers(() => groupMembers);
      }, error => {
      }
    );
  }, [cometChat, selectedChannel]);

  listenGroupChanges = useCallback(() => {
    cometChat.addGroupListener(
      selectedChannel.guid,
      new cometChat.GroupListener({
        onGroupMemberJoined: (message, joinedUser, joinedGroup) => {
          loadChannelMembers();
        },
        onGroupMemberLeft: (message, leftUser, leftGroup) => {
          loadChannelMembers();
        },
        onGroupMemberKicked: (message, kickedUser, kickedBy, kickedFrom) => {
          loadChannelMembers();
        },
        onGroupMemberBanned: (message, bannedUser, bannedBy, bannedFrom) => {
          loadChannelMembers();
        },
        onGroupMemberUnbanned: (message, unbannedUser, unbannedBy, unbannedFrom) => {
          loadChannelMembers();
        },
        onGroupMemberScopeChanged: (message, changedUser, newScope, oldScope, changedGroup) => {
          loadChannelMembers();
        },
        onMemberAddedToGroup: (message, userAdded, addedby, addedTo) => {
          loadChannelMembers();
        },
      })
    );
  }, [cometChat, selectedChannel, loadChannelMembers]);

  const updateMembers = (user) => {
    if (!user) {
      return;
    }
    setMembers(previousMembers => previousMembers.map(member => {
      if (member && member.uid === user.uid) {
        return { ...member, status: user.status === 'online' ? 'available' : 'offline' };
      }
      return { ...member };
    }));
  };

  listenUserPresense = useCallback(() => {
    cometChat.addUserListener(
      userPresenseListenerId,
      new cometChat.UserListener({
        onUserOnline: onlineUser => {
          updateMembers(onlineUser);
        },
        onUserOffline: offlineUser => {
          updateMembers(offlineUser);
        }
      })
    );
  }, [cometChat]);

  if (!members || !members.length) {
    return (
      <div className="right-sidebar">
        <div className="right-sidebar__title">Active Now</div>
        <div className="right-sidebar__description">
          <p className="right-sidebar__description-title">It's quiet for now...</p>
          <p className="right-sidebar__description-content">When a friend starts active-now activity - like playing a game or hanging out on voice - we'll show it here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="right-sidebar">
      <div className="group-members__sidebar">
        <span className="group-members__title">Channel Members</span>
        <div className="group-members__list">
          {members && members.map(member => <Sidebar key={member.uid} member={member} />)}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;