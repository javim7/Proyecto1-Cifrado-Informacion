import {useEffect, useState} from 'react';

const Login = () => {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const fechUsers = async () => {
            const response = await fetch('http://localhost:5000/users/')
            const data = await response.json()
            
            if(response.ok) {
                console.log(data)
                setUsers(data)
            }
        }

        fechUsers();
    }, []);

    return (
        <div>
            <h1>Login</h1>
            <div className="users">
        
                {users && users.map((user) => (
                    <div key={user._id}>
                        <p>{user.username}: {user.public_key}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Login;
