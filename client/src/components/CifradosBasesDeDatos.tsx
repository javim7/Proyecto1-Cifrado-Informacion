import { useState, useEffect } from 'react';

import { Tabs, rem } from '@mantine/core';

import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';

import "./CifradosBasesDeDatos.model.css";

export function CifradosBasesDeDatos() {

    const [informacionBaseDeDatos, setInformacionBaseDeDatos] = useState({});

    useEffect(() => {

        console.log('Montando el componente CifradosBasesDeDatos');

        // Hacemos fetch a http://localhost:3500/list_all_entries_in_collection/:collection para cada uno de los siguientes:
        // [
        //     "users",
        //     "messages",
        //     "groups",
        //     "group_messages",
        //     "keys"
        // ]
        // Y almacenamos la información en el estado informacionBaseDeDatos con su clave siendo el nombre de la colección y su valor siendo la información de la colección.

        let collections = [
            "users",
            "messages",
            "groups",
            "group_messages",
            "keys"
        ];

        let url = 'http://localhost:3500/list_all_entries_in_collection/';

        collections.forEach(collection => {
            fetch(url + collection)
                .then(response => response.json())
                .then(data => {
                    setInformacionBaseDeDatos(prevState => ({
                        ...prevState,
                        [collection]: data
                    }));
                });
        }
        );



    }, []);

    const iconStyle = { width: rem(12), height: rem(12) };

    const [activeTab, setActiveTab] = useState<string | null>('Users');

    return (
        <div>
            <div>
                {/* <MessagesTable messages={informacionBaseDeDatos.messages} /> */}
                {/* <UsersTable users={informacionBaseDeDatos.users} /> */}
                {/* <GroupsTable groups={informacionBaseDeDatos.groups} /> */}
                {/* <GroupMessagesTable groupMessages={informacionBaseDeDatos.group_messages} /> */}
                {/* <KeysTable keys={informacionBaseDeDatos.keys} /> */}
            </div>
            <Tabs defaultValue="Usuarios" onChange={setActiveTab}
                style={
                    {
                        width: '85vw',
                        margin: 'auto',
                    }
                }
                color="orange" variant="pills"
            >
                <Tabs.List grow justify="center">
                    <Tabs.Tab value="Usuarios" leftSection={<IconPhoto style={iconStyle} />} >
                        Usuarios
                    </Tabs.Tab>
                    <Tabs.Tab value="Mensajes" leftSection={<IconMessageCircle style={iconStyle} />} >
                        Mensajes
                    </Tabs.Tab>
                    <Tabs.Tab value="Grupos" leftSection={<IconSettings style={iconStyle} />} >
                        Grupos
                    </Tabs.Tab>
                    <Tabs.Tab value="Mensajes de Grupo" leftSection={<IconSettings style={iconStyle} />} >
                        Mensajes de Grupo
                    </Tabs.Tab>
                    <Tabs.Tab value="Claves" leftSection={<IconSettings style={iconStyle} />} >
                        Claves
                    </Tabs.Tab>

                </Tabs.List>

                <Tabs.Panel value="Usuarios">
                    <div className="table-container">
                        <UsersTable users={informacionBaseDeDatos.users} />
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value="Mensajes">
                    <MessagesTable messages={informacionBaseDeDatos.messages} />
                </Tabs.Panel>
                <Tabs.Panel value="Grupos">
                    <GroupsTable groups={informacionBaseDeDatos.groups} />
                </Tabs.Panel>
                <Tabs.Panel value="Mensajes de Grupo">
                    <GroupMessagesTable groupMessages={informacionBaseDeDatos.group_messages} />
                </Tabs.Panel>
                <Tabs.Panel value="Claves">
                    <div className="table-container">
                        <KeysTable keys={informacionBaseDeDatos.keys} />
                    </div>
                </Tabs.Panel>

            </Tabs>
        </div>
    );

}



function MessagesTable({ messages }) {
    return (
        <div>
            <h2>Messages</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Created At</th>
                        <th>Message</th>
                        <th>Destination Username</th>
                        <th>Origin Username</th>
                    </tr>
                </thead>
                <tbody>
                    {messages?.map((message) => (
                        <tr key={message._id}>
                            <td>{message._id}</td>
                            <td>{message.createdAt}</td>
                            <td>{message.message}</td>
                            <td>{message.username_destino}</td>
                            <td>{message.username_origen}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function UsersTable({ users }) {
    return (
        <div>
            <h2>Users</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Date Created</th>
                        <th>Public Key</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.date_created}</td>
                            <td>{user.public_key}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function GroupsTable({ groups }) {
    return (
        <div>
            <h2>Groups</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Creation Date</th>
                        <th>Users</th>
                    </tr>
                </thead>
                <tbody>
                    {groups?.map((group) => (
                        <tr key={group._id}>
                            <td>{group._id}</td>
                            <td>{group.nombre}</td>
                            <td>{group.createdAt || group.fecha_creacion}</td>
                            <td>{group.usuarios.map(user => user.username).join(", ")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


function GroupMessagesTable({ groupMessages }) {
    return (
        <div>
            <h2>Group Messages</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Author</th>
                        <th>Message</th>
                        <th>Group ID</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {groupMessages?.map((message) => (
                        <tr key={message._id}>
                            <td>{message._id}</td>
                            <td>{message.autor.username || message.autor}</td>
                            <td>{message.mensaje}</td>
                            <td>{message.group_id}</td>
                            <td>{message.createdAt || message.fecha_envio}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function KeysTable({ keys }) {
    return (
        <div>
            <h2>Keys</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Private Key</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {keys?.map((key) => (
                        <tr key={key._id}>
                            <td>{key._id}</td>
                            <td>{key.username}</td>
                            <td>{key.private_key}</td>
                            <td>{key.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
