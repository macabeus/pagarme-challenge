import React  from 'react';


function RandomRoomLink(props) {
  const roomName = Math.random().toString(36).substr(2, 5);
  const userName = Math.random().toString(36).substr(2, 5);

  return (
    <a href={`/room/${roomName}/user/${userName}`}>{props.children}</a>
  )
}

export default RandomRoomLink;
