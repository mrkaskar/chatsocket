import React from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import {useDispatch} from 'react-redux';
import { deleteContact } from '../contact/contactActions';

function ModalDelete({did,room,socket}) {
  const [open, setOpen] = React.useState(false)
  const dispatch = useDispatch();
  
  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      trigger={
        <i title="Delete Contact" className="fa fa-user-times"></i>
      }
    >
      <Header icon>
        <Icon name='exclamation' color="red"/>
        Delete Contact
      </Header>
      <Modal.Content>
        <p style={{textAlign:'center',color:'orange'}}>
          Caution! This action will delete all messages with the person!
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='green' inverted onClick={() =>  {
            
            setOpen(false)}}>
          <Icon name='remove' /> No
        </Button>
        <Button color='red' inverted onClick={() => {
            dispatch(deleteContact(did,room));
            socket.emit('delete',{
                did,
                room
            })
            window.location.href = "/chat";
            setOpen(false)
            }}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ModalDelete