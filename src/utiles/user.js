const users=[]

const adduser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username || !room){
        return{
            error:"Username and Room are required"
        }
    }

    const exstinguser=users.find(user=>user.username===username && user.room===room)
    if(exstinguser){
        return{
            error:'user name is in use!'
        }
    }

    const user={id, username, room}
    users.push(user)
    return {user}
}

const removeuser=(id)=>{
    const index=users.findIndex(user=>user.id===id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    return users.find(user=>user.id===id)
}

const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter(user=>user.room===room)
}



module.exports={
    adduser,
    removeuser,
    getUser,
    getUsersInRoom
}