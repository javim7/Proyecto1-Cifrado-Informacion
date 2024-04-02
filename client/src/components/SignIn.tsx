import {
    Paper,
    Title,
    Text,
    TextInput,
    Button,
    Container,
    Group,
    Anchor,
    Center,
    Box,
    rem,
} from '@mantine/core';

import { IconArrowLeft } from '@tabler/icons-react';

import classes from './SignIn.module.css';

import { useState, useEffect } from 'react';

import JSEncrypt from "jsencrypt";

export function CifradosSignIn({ setUsuarioActual }: { setUsuarioActual: (tabName: string) => void; }) {

    const [nombre_usuario, setNombreUsuario] = useState('');

    function handleLogin() {

        console.log(nombre_usuario);

        let crypt = new JSEncrypt({ default_key_size: "512" });

        let privateKey = crypt.getPrivateKey();
        let publicKey = crypt.getPublicKey();

        console.log('Public Key:', publicKey);
        console.log('Private Key:', privateKey);

        // Encode the keys in base64
        let base64PublicKey: string = btoa(publicKey);
        let base64PrivateKey: string = btoa(privateKey);

        console.log('Base64 Public Key:', base64PublicKey);
        console.log('Base64 Private Key:', base64PrivateKey);

        let converted_publicKey: string = atob(base64PublicKey);
        let converted_privateKey: string = atob(base64PrivateKey)

        console.log('Converted Public Key:', converted_publicKey);
        console.log('Converted Private Key:', converted_privateKey);

        // Primero revisamos en http://localhost:3000/users/"usuario_especifico" si el usuario ya existe que seria si retorna un 200
        // Si no existe el usuario, entonces se crea con el siguiente POST  http://localhost:3000/users/ con el body:
        // {
        //     "public_key": "public_key",
        //         "username": "nombre_usuario"
        // }


        // Hacemos la primera petición para ver si el usuario ya existe

        fetch(`http://localhost:3000/users/${nombre_usuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {

                console.log(response.status);

                if (response.status === 200) {

                    console.log('Usuario ya existe');

                    // Si el usuario ya existe, entonces se actualiza

                    setUsuarioActual(nombre_usuario);

                } else {

                    console.log('Usuario no existe');

                    // Si el usuario no existe, entonces se crea

                    fetch('http://localhost:3000/users/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "public_key": base64PublicKey,
                            "username": nombre_usuario
                        })
                    })
                        .then(response => {
                            console.log(response.status);
                            if (response.status === 200) {

                                console.log('Usuario creado');

                                // Por ultimo llamamos al endpoint http://localhost:3000/keys/ y le pasamos como body el siguiente JSON:
                                // {
                                //     "username" : "ales", "private_key": "12345667788"
                                // }

                                fetch('http://localhost:3000/keys/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        "username": nombre_usuario,
                                        "private_key": base64PrivateKey
                                    })
                                })
                                    .then(response => {
                                        console.log(response.status);
                                        if (response.status === 200) {

                                            console.log('Llave creada');

                                            setUsuarioActual(nombre_usuario);

                                        } else {

                                            console.log('Error al crear llave');

                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });

                            } else {

                                console.log('Error al crear usuario');

                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    return (
        <Container size={460} my={30}>
            <Title className={classes.title} ta="center">
                Quehubo 2
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                La version mejorada del Grupo 3
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <TextInput
                    label="Username"
                    placeholder="Coily"
                    required
                    onChange={(event) => setNombreUsuario(event.currentTarget.value)}
                />
                <Group justify="space-between" mt="lg" className={classes.controls}>
                    <Button
                        className={classes.control}
                        onClick={handleLogin}
                    >Login</Button>
                </Group>
            </Paper>
        </Container>
    );
}