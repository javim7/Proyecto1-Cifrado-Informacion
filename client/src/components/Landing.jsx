import { useEffect, useState } from 'react';

import { Tab } from '@headlessui/react'

const Landing = () => {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const fechUsers = async () => {
            const response = await fetch('http://localhost:3000/users/')
            const data = await response.json()

            if (response.ok) {
                console.log(data)
                setUsers(data)
            }
        }

        fechUsers();
    }, []);

    return (
        <div>
            <h1>Landing page</h1>
            <Tab.Group>
                <Tab.List>
                    <Tab>Tab 1</Tab>
                    <Tab>Tab 2</Tab>
                    <Tab>Tab 3</Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>Content 1</Tab.Panel>
                    <Tab.Panel>Content 2</Tab.Panel>
                    <Tab.Panel>Content 3</Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}

export default Landing;