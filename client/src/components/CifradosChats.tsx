import { Avatar, Badge, Table, Group, Text, Select } from '@mantine/core';

import { Modal } from '@mantine/core';

import { useState, useEffect, } from 'react';

import { useDisclosure } from '@mantine/hooks';

import { TextInput, TextInputProps, ActionIcon, useMantineTheme, rem } from '@mantine/core';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

import { ScrollArea } from '@mantine/core';

import classes from './CifradosChats.module.css';



const rolesData = ["Estudiante"]; // Asume alguna lógica para determinar roles si es necesario

export function CifradosChats({ usuarioActual }) {

    const [usuariosConChats, setUsuariosConChats] = useState([]);

    const [opened, { close, open }] = useDisclosure(false);

    const [chatDestino, setChatDestino] = useState('');

    const [todos_los_chats_con_usuario, setTodosLosChatsConUsuario] = useState([])

    const [mensajeEscrito, setMensajeEscrito] = useState('')

    function handleSendMessage() {

        console.log('Enviando mensaje:', mensajeEscrito);

        // Tenemos que enviar el mensaje a http://localhost:3000/messages/:chatDestino con body de la siguiente manera:

        // {
        //     "message": "ralda es una willy",
        //         "username_origen": "mombius"
        // }



        fetch(`http://localhost:3000/messages/${chatDestino}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: mensajeEscrito,
                username_origen: usuarioActual
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Mensaje enviado:', data);
                setTodosLosChatsConUsuario([...todos_los_chats_con_usuario, data]);
            })
            .catch((error) => {
                console.error('Error al enviar el mensaje:', error);
            });

        setMensajeEscrito('')

    }

    function handleChatOpen(username_chat_destino: any) {

        console.log('Abriendo chat con:', username_chat_destino);

        setChatDestino(username_chat_destino);

        open();

        // Tenemos que poblar todos_los_chats_con_usuario haciendo un fetch hacia http://localhost:3000/messages/users/:usuarioActual/:username_chat_destino

        fetch(`http://localhost:3000/messages/users/${usuarioActual}/${username_chat_destino}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Chats con el usuario actual:', data);

                // Imprimimos todos los objetos "chats" que nos devuelva el servidor

                for (let i = 0; i < data.length; i++) {
                    console.log(data[i]);
                }

                setTodosLosChatsConUsuario(data);
            })
            .catch((error) => {
                console.error('Error al obtener los chats del usuario actual:', error);
            });

    }

    useEffect(() => {
        fetch(`http://localhost:3000/messages/all_chats/${usuarioActual}`)
            .then((response) => response.json())
            .then((data) => {
                // Transforma los datos si es necesario antes de establecer el estado
                const formattedData = data.map(user => ({
                    ...user,
                    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png', // Imagen predeterminada
                    role: 'Estudiante', // Ejemplo de cómo asignar roles, ajusta según necesidad
                    memberSince: user.date_created, // Asume que quieres mostrar la fecha de creación como última actividad
                    active: true, // Decide cómo determinar si el usuario está activo
                }));
                setUsuariosConChats(formattedData);
            })
            .catch((error) => {
                console.error('Error al obtener los chats del usuario actual:', error);
            });
    }, [usuarioActual]); // Asegúrate de incluir las dependencias correctas aquí

    const rows = usuariosConChats.map((item) => (
        <Table.Tr key={item._id}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={40} src={item.avatar} radius={40} />
                    <div>
                        <Text size="sm" weight={500}>
                            {item.username}
                        </Text>
                    </div>
                </Group>
            </Table.Td>

            <Table.Td>
                {item.role}
            </Table.Td>
            <Table.Td>{new Date(item.memberSince).toLocaleDateString()}</Table.Td>
            <Table.Td>
                {item.active ? (
                    <Badge
                        fullWidth variant="light"
                        onClick={() => handleChatOpen(item.username)}
                    >
                        Abrir
                    </Badge>
                ) : (
                    <Badge color="gray" fullWidth variant="light">
                        Disabled
                    </Badge>
                )}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className={classes.contenedorGeneral}>
            <Modal opened={opened} onClose={close} size="auto" title={`Chat con ${chatDestino}`} >
                <div className={classes.contenedorModal}>
                    <div>Contenido del chat con {chatDestino}</div>
                    <div>
                        <ScrollArea h={600} offsetScrollbars scrollbarSize={2} className={classes.scrollAreaChats}>
                            {todos_los_chats_con_usuario.map((chat: any) => (
                                <div key={chat._id}
                                    className={chat.username_origen === usuarioActual ? classes.mensajePropio : classes.mensajeExterno}
                                >
                                    <Text>{chat.message}</Text>
                                    <Text c="dimmed" size="xs">{chat.createdAt}</Text>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                    <TextInput
                        radius="xl"
                        size="md"
                        placeholder="Mensaje"
                        rightSectionWidth={42}
                        rightSection={
                            <ActionIcon
                                size={32}
                                radius="xl"
                                variant="filled"
                                onClick={handleSendMessage}
                            >
                                <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                            </ActionIcon>
                        }
                        onChange={(event) => setMensajeEscrito(event.currentTarget.value)}
                        value={mensajeEscrito}
                    />
                </div>
            </Modal>
            <div
                className={classes.contenedorTabla}
            >
                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Usuario</Table.Th>
                                <Table.Th>Profesion</Table.Th>
                                <Table.Th>Miembro desde</Table.Th>
                                <Table.Th>Chats</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </div>
        </div>
    );
}
