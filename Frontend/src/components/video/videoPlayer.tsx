import React, {useEffect, useRef } from 'react'

const videoPlayer = ({ user }) => {
    const ref = useRef();

    return (
    <div>
        Uid: {user.id}
        <div ref={ref} style={{ width: "200px", height: "200px" }}></div>
    </div>
  )
}

export default videoPlayer