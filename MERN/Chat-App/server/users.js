//to manage users (helper functions)
const users=[];

const addUser=({id,name,room})=>{
    //if users has entered name of room with space then remove the space 
    //for eg., React js to Reactjs
    name=name.trim().toLowerCase();
    room=room.trim().toLowerCase();

    //if there is an existing user wants to join again.
    const existingUser=users.find((user) => user.room===room && user.name===name);
    if(existingUser)
    {
        return {error: 'Username is taken.'} //it will show in that alert 
    }
    const user={id,name,room};
    users.push(user);
    return {user};
}


const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id);
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}


const getUser=(id)=>users.find((user)=>user.id===id);


//here we need to use filter function 
const getUsersInRoom=(room)=>users.filter((user)=>user.room===room);

module.exports={addUser,removeUser,getUser,getUsersInRoom};