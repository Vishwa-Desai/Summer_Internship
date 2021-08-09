import React,{useState,useEffect} from 'react';
import querystring from 'query-string'; 
import io from 'socket.io-client';
import './chat.css';
import InfoBar from '../infobar/InfoBar';
import Input from '../input/Input';
import Messages from '../messages/Messages';
import TextContainer from '../TextContainer/TextContainer';


let socket;

const Chat=({location})=>{
    const [name,setName]=useState('');
    const [room,setRoom]=useState('');
    const [users, setUsers] = useState('');
    const [message,setMessage]=useState('');
    const [messages,setMessages]=useState([]);
    const EndPoint='https://chat--app-react.herokuapp.com/';
    //working data (msg user sent after joining)
    useEffect(()=>{
        const {name,room}=querystring.parse(location.search);
    
        socket=io(EndPoint,{ transports: ['websocket', 'polling', 'flashsocket'] });

        console.log(name,room);
        setName(name);
        setRoom(room);
        socket.emit('join',{name,room},(error)=>{
            if(error) {
                alert(error);
              }
        });
        //finish (provide return:mounting)
        //return callback for disconnect event

    },[EndPoint,location.search]);


    //handling messages 
    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages(messages=>[...messages,message]);
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
    },[]);  

    //function for sending messages 
    const sendMessage=(event)=>{
        //ignore default behaviour(refresh) of any message.
        event.preventDefault();
        //first at the emitation of the socket we clean our message
        if(message){
            socket.emit('sendMessage',message,()=>  setMessage(''));
            
        }
    }
    
    //console.log(message,messages);
    return(
        <div className="outerContainer">
            <div className="chat-container">
            <TextContainer users={users}/>
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            </div>
        </div>
    )
}

export default Chat;