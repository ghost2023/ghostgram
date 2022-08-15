import { get, ref } from 'firebase/database'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DB } from '../fb-config'

export default function AccountLink({ username, uid }) {
    const [name, setName] = useState(username)
    
    useEffect(() => {
        if(username) return 
        get(ref(DB, 'users/' + uid)).then(d => setName(d.val()))
    }, [])

    return (<Link to={`/${name}`}>{name}</Link>)
}

AccountLink.propTypes = {
    username: PropTypes.string,
    uid: PropTypes.string,
}