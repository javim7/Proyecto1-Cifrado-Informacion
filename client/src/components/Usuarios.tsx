import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

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
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: 'id',
            width: '25%',
        },
        {
            title: 'Public Key',
            dataIndex: 'public_key',
            key: 'publicKey',
            width: '30%',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: '45%',
        },
    ];

    return (
        <div style={{ textAlign: 'center', maxWidth: "100%"}}>
            <h1>Usuarios</h1>
            <Table
                dataSource={usuarios}
                columns={columns}
                loading={loading}
                scroll={{ y: 400 }}
            />
        </div>
    );
}