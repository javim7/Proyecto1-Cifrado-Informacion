import React, { useState, useEffect } from 'react';
import { Table, ScrollArea, Text } from '@mantine/core';

export function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    // Función para obtener los usuarios
    const getUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/users');
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []); // El arreglo vacío asegura que se ejecute solo una vez

    return (
        <div>
            <Text size="xl" weight={700} style={{ marginBottom: 20 }}>
                Usuarios
            </Text>
            <ScrollArea style={{ maxHeight: 400 }}>
                <Table striped style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>ID</th>
                            <th style={{ width: '30%' }}>Public Key</th>
                            <th style={{ width: '50%' }}>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario, index) => (
                            <tr key={index}>
                                <td>{usuario._id}</td>
                                <td>{usuario.public_key}</td>
                                <td>{usuario.username}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ScrollArea>
        </div>
    );
};
