import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserByUid } from 'utils/services'

export default function AccountLink({ username, uid }) {
    const [name, setName] = useState(username)
    
    useEffect(() => {
        if(username) return 
        getUserByUid(uid).then(setName)
    }, [username, uid])

    return (<Link to={`/${name}`}>{name}</Link>)
}

AccountLink.propTypes = {
    username: PropTypes.string,
    uid: PropTypes.string,
}