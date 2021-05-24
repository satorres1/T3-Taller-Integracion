import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './App.css';
import io from "socket.io-client";
import moment from 'moment'
const ENDPOINT = "wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl";


const Chat = (props) => {
  const [dataChat, setDataChat] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [user, setUser] = useState('user-1');
  const [userName, setUserName] = useState('');
  const socket = io(ENDPOINT, {path: '/flights'});

  useEffect(() => {
    let messages = [];
    socket.on('CHAT', data => {
        messages.push(data);
        setDataChat([...messages]);

    });
    
  }, []);

  const onChangeInput = (input) => {
      setInputMessage(input);
  }

  const onChangeUserName = (input) => {
    setUserName(input);
}


  const sendMessage = () => {
      socket.emit('CHAT', {name: user,
      message: inputMessage});
      setInputMessage('');
  }

  const changeUser = () => {
    setUser(userName);
    setUserName('');
}
	
  return (
    <div className='chatbox'>
      <div>
      <input 
        type='text'
        value={userName}
        placeholder={"Escriba su nombre de usuario para cambiarlo"}
        onChange={(e) => onChangeUserName(e.target.value)}
        />
        <Button
        className='chatboton'
        variant="primary"
        onClick={() => changeUser()}
        >
        {'Cambiar usuario'}
        </Button>
      </div>
      <h3> Usuario: {user}</h3>
      <div>
        {dataChat.slice(-5).map((m) => {
          return (
            <div key={m.date} className='dialogo-chat'>
              <h3>{m.name} - {moment(m.date).format("DD MMM YYYY hh:mm a")}</h3>
              <h3>mensaje: {m.message}</h3>
              
            </div>
          );
        })}
      </div>
      <div>
      <input 
        type='text'
        value={inputMessage}
        placeholder={"Escriba su mensaje para enviar al chat"}
        onChange={(e) => onChangeInput(e.target.value)}
        />
        <Button
        className='chatboton'
        variant="primary"
        onClick={() => sendMessage()}
        >
        {'Enviar mensaje'}
        </Button>
      </div>
    </div>
    
   );
}

export default Chat