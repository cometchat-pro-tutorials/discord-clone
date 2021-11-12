import { useContext } from "react";

import Context from '../../context';

import CreateServer from "../servers/CreateServer";
import MyServer from "../servers/MyServer";

const ModalWrapper = (props) => {
  const { toggleModal } = props;

  const { selectedMenu } = useContext(Context);

  if (selectedMenu === 2) {
    return <CreateServer toggleModal={toggleModal} />
  }

  if (selectedMenu === 3) { 
    return <MyServer toggleModal={toggleModal} />
  }

  return <></>

};
export default ModalWrapper;