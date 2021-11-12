import React, { useState, useContext } from 'react';

import validator from "validator";
import { v4 as uuidv4 } from "uuid";

import CreateServerForm from './CreateServerForm';
import ServerItem from './ServerItem';

import Context from "../../context";
import { realTimeDb, storage } from "../../firebase";

import cs1 from '../../images/cs1.png';
import cs2 from '../../images/cs2.png';
import cs3 from '../../images/cs3.png';
import cs4 from '../../images/cs4.png';
import cs5 from '../../images/cs5.png';
import cs6 from '../../images/cs6.png';
import cs7 from '../../images/cs7.png';
import cs8 from '../../images/cs8.png';

const CreateServer = (props) => {
  const { toggleModal } = props;

  const [isCreating, setIsCreating] = useState(false);

  const { user, setIsLoading } = useContext(Context);

  const list = [
    {
      id: 1,
      icon: cs1,
      title: 'Create My Own',
      arrow: cs8
    },
    {
      id: 2,
      icon: cs2,
      title: 'Gaming',
      arrow: cs8
    },
    {
      id: 3,
      icon: cs3,
      title: 'School Club',
      arrow: cs8
    },
    {
      id: 4,
      icon: cs4,
      title: 'Study Group',
      arrow: cs8
    },
    {
      id: 5,
      icon: cs5,
      title: 'Friends',
      arrow: cs8
    },
    {
      id: 6,
      icon: cs6,
      title: 'Artists & Creators',
      arrow: cs8
    },
    {
      id: 7,
      icon: cs7,
      title: 'Local Community',
      arrow: cs8
    },
  ];

  const hide = () => {
    toggleModal(false);
  };

  const toggleCreate = (isCreating) => () => {
    setIsCreating(() => isCreating);
  }

  const isValid = ({ image, name, description }) => {
    if (validator.isEmpty(image)) {
      alert("Please upload your server image");
      return false;
    }
    if (validator.isEmpty(name)) {
      alert("Please input your server name");
      return false;
    }
    if (validator.isEmpty(description)) {
      alert("Please input your server description");
      return false;
    }
    return true;
  };

  const createServer = ({ id, name, description }) => {
    return { id, name, description, members: [{id: user.id, email: user.email, fullname: user.fullname, }], nMembers: 1 };
  };

  const updateServer = ({ server, url }) => {
    server.image = url;
    realTimeDb.ref(`servers/${server.id}`).set(server);
  };

  const submit = ({ image, name, description }) => {
    if (isValid({ image, name, description })) {
      setIsLoading(true);

      const id = uuidv4();
      const server = createServer({ id, name, description });

      realTimeDb.ref(`servers/${id}`).set(server).then(() => {

        const uploadTask = storage.ref(`servers/${id}`).putString(image, "data_url");

        uploadTask.on("state_changed", null, (error) => {
          setIsLoading(false);
          hide();
          alert(`Cannot create your server, please try again`);
        }, () => {
          storage.ref("servers").child(id).getDownloadURL().then((url) => {
            updateServer({ server, url });
            setIsLoading(false);
            hide();
            alert(`${name} server was created succesffully`);
          });
        }
        );
      });
    }
  };

  if (isCreating) {
    return <CreateServerForm hide={hide} toggleCreate={toggleCreate(false)} onSubmit={submit} />
  }

  return (
    <div className="server">
      <div className="server__content">
        <div className="s__container">
          <div className="server__close" onClick={hide}>
            <svg className="closeIcon-150W3V" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
          </div>
        </div>
        <div className="server__subtitle">Create a Server</div>
        <p className="server__description">Your server is where you and your friends hang out.
          Make yours and start talking.</p>
        <ServerItem onItemClicked={toggleCreate(true)} item={list[0]} />
        <div className="server__list-title">Start from a template</div>
        <div className="s__list">
          {list.map((item, index) => index === 0 ? <React.Fragment key={index}></React.Fragment> : <ServerItem key={index} item={item} onItemClicked={toggleCreate(true)} />)}
        </div>
      </div>
    </div>
  );
}

export default CreateServer;
