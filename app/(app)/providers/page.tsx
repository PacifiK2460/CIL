'use client'

import { Button, Flex, Table, Text, Tooltip, Dialog } from "@radix-ui/themes";
import { PlusIcon, Pencil1Icon, Cross1Icon } from "@radix-ui/react-icons";
import { getProviders, addProvider, deleteProvider, updateProvider } from "@/lib/db";
import { Provider } from "@/lib/definitions";
import { Form } from "radix-ui";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Slide } from 'react-toastify';

export default function Providers() {
    const [proveedores, setProveedores] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getProviders();
            setProveedores(data);
        };
        fetchData();
    }, []);

    return (
        <div className="p-6">
            <div className="flex flex-col items-baseline justify-start">
                <Flex direction="row" align="center" className="gap-4 w-full">
                    <Flex direction="column" className="gap-2 w-full">
                        <Text size="8" weight="bold">
                            Proveedores
                        </Text>
                        <Text color="gray" size="3">
                            Aquí puedes gestionar los proveedores de tu tienda, añadir nuevos proveedores y editar los existentes.
                        </Text>
                    </Flex>

                    {
                        // Nuevo Proveedor
                    }
                    <Dialog.Root>
                        <Tooltip content="Añadir proveedor" side="top" align="center">
                            <Dialog.Trigger>
                                <Button variant="soft" className="ml-auto">
                                    <PlusIcon className="mr-2" />
                                    Añadir Proveedor
                                </Button>
                            </Dialog.Trigger>
                        </Tooltip>

                        <Dialog.Content>
                            <Dialog.Title>Agregar Producto</Dialog.Title>
                            <Dialog.Description>
                                Completa los campos para agregar un nuevo producto a tu tienda.
                            </Dialog.Description>

                            <Flex direction="column" gap="3" className="w-full">
                                <Form.Root className="FormRoot"
                                    onSubmit={async (event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);
                                        const nombre = formData.get('nombre');
                                        const direccion = formData.get('direccion');
                                        const numero = formData.get('numero');
                                        const correo = formData.get('correo');

                                        const res = await addProvider(
                                            nombre as string,
                                            direccion as string,
                                            numero as string,
                                            correo as string
                                        )
                                        console.log('Response:', res);
                                        if (res) {
                                            console.log('Proveedor agregado correctamente')
                                            const newProviders = await getProviders();
                                            setProveedores(newProviders);
                                            toast.success(
                                                'Proveedor ' + nombre + ' agregado correctamente', {
                                                position: "bottom-right",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                closeOnClick: false,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                theme: "light",
                                                transition: Slide,
                                            });
                                        }
                                    }}
                                >

                                    <Form.Field className="FormField" name="nombre">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Nombre
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa un nombre de contacto
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="text" required placeholder="Ingresa el nombre" />
                                        </Form.Control>
                                    </Form.Field>

                                    <Form.Field className="FormField" name="direccion">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Dirección
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa una dirección
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="text" required placeholder="Ingresa una dirección" />
                                        </Form.Control>
                                    </Form.Field>

                                    <Form.Field className="FormField" name="numero">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Número de contacto
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa un número de contacto
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="text" required placeholder="Ingresa un numero" />
                                        </Form.Control>
                                    </Form.Field>

                                    <Form.Field className="FormField" name="correo">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Correo Electrónico
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa un correo electrónico
                                            </Text>
                                        </Form.Message>
                                        <Form.Message className="FormMessage" match="typeMismatch">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa un correo electrónico válido
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="email" required placeholder="Ingresa el correo electrónico" />
                                        </Form.Control>
                                    </Form.Field>

                                    <Flex gap="3" mt="4" justify="between">
                                        <Dialog.Close>
                                            <Button variant="soft" color="gray">
                                                Cancelar
                                            </Button>
                                        </Dialog.Close>
                                        <Form.Submit asChild>
                                            <Dialog.Close>
                                                <Button>Agregar</Button>
                                            </Dialog.Close>
                                        </Form.Submit>
                                    </Flex>
                                </Form.Root>
                            </Flex>


                        </Dialog.Content>
                    </Dialog.Root>
                </Flex >
            </div >

            <ToastContainer />

            <Dialog.Root open={
                selectedProvider !== null

            }>
                <Dialog.Content>
                    <Dialog.Title>Actualizar {selectedProvider?.name}</Dialog.Title>
                    <Dialog.Description>
                        <Text size="1" mb="4" weight="light" style={{ color: 'gray' }}>
                            {selectedProvider?.name}
                        </Text>
                        <br />
                        <Text size="2" mb="4" weight="regular">
                            Completa los campos para actualizar el proveedor.
                        </Text>
                    </Dialog.Description>

                    <Flex direction="column" gap="3" className="w-full">
                        <Form.Root className="FormRoot"
                            key={
                                selectedProvider?.id
                            }
                            onSubmit={async (event) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);
                                const id = selectedProvider?.id;
                                const nombre = formData.get('nombre');
                                const direccion = formData.get('direccion');
                                const numero = formData.get('numero');
                                const correo = formData.get('correo');

                                console.log('ID:', id);
                                console.log('Nombre:', nombre);
                                console.log('Dirección:', direccion);
                                console.log('Número:', numero);
                                console.log('Correo:', correo);
                                console.log('Proveedor:',);

                                const res = await updateProvider(
                                    id as string,
                                    nombre as string,
                                    direccion as string,
                                    numero as string,
                                    correo as string
                                )
                                console.log('Response:', res);
                                if (res) {
                                    console.log('Proveedor agregado correctamente')
                                    const newProviders = await getProviders();
                                    setProveedores(newProviders);
                                    toast.success(
                                        'Proveedor ' + nombre + ' editado correctamente', {
                                        position: "bottom-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: false,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        transition: Slide,
                                    });
                                    setSelectedProvider(null);
                                }
                            }}
                        >

                            <Form.Field className="FormField" name="nombre">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="4" mb="1" weight="bold">
                                        Nombre
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa un nombre de contacto
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="text" required placeholder="Ingresa el nombre"
                                        content={selectedProvider?.name} defaultValue={selectedProvider?.name}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="direccion">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="4" mb="1" weight="bold">
                                        Dirección
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa una dirección
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="text" required placeholder="Ingresa una dirección"
                                        content={selectedProvider?.address} defaultValue={selectedProvider?.address}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="numero">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="4" mb="1" weight="bold">
                                        Número de contacto
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa un número de contacto
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="text" required placeholder="Ingresa un numero" content={
                                        selectedProvider?.phone} defaultValue={selectedProvider?.phone} />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="correo">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="4" mb="1" weight="bold">
                                        Correo Electrónico
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa un correo electrónico
                                    </Text>
                                </Form.Message>
                                <Form.Message className="FormMessage" match="typeMismatch">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa un correo electrónico válido
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="email" required placeholder="Ingresa el correo electrónico"
                                        content={selectedProvider?.email} defaultValue={selectedProvider?.email}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Flex gap="3" mt="4" justify="between">
                                <Dialog.Close>
                                    <Button variant="soft" color="gray"
                                        onClick={() => {
                                            setSelectedProvider(null);
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </Dialog.Close>

                                <Form.Submit asChild>
                                    <Dialog.Close>
                                        <Button>Editar</Button>
                                    </Dialog.Close>
                                </Form.Submit>
                            </Flex>
                        </Form.Root>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

            <div>
                <Table.Root variant="surface" className="mt-6 w-full h-fit" layout="fixed">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Nombre</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Dirección</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Número de Contacto</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Correo Electronico</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            proveedores.map((proveedor) => (
                                <Table.Row key={proveedor.id}>
                                    <Table.RowHeaderCell>{proveedor.id}</Table.RowHeaderCell>
                                    <Table.Cell>{proveedor.name}</Table.Cell>
                                    <Table.Cell>{proveedor.address}</Table.Cell>
                                    <Table.Cell>{proveedor.phone}</Table.Cell>
                                    <Table.Cell>{proveedor.email}</Table.Cell>
                                    <Table.Cell>
                                        <Flex direction="row" align="center" className="gap-2">
                                            <Tooltip content="Editar producto" side="top" align="center">
                                                <Button variant="outline"
                                                    onClick={() => {
                                                        setSelectedProvider(proveedor);
                                                    }}
                                                >
                                                    <Pencil1Icon />
                                                    Editar
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Eliminar producto" side="top" align="center">
                                                <Button variant="outline" color="red"
                                                    onClick={() => {
                                                        deleteProvider(proveedor.id);
                                                        setProveedores(proveedores.filter((p) => p.id !== proveedor.id));
                                                        toast.warning(
                                                            'Registro ' + proveedor.name + ' eliminado correctamente', {
                                                            position: "bottom-right",
                                                            autoClose: 5000,
                                                            hideProgressBar: false,
                                                            closeOnClick: false,
                                                            pauseOnHover: true,
                                                            draggable: true,
                                                            progress: undefined,
                                                            theme: "light",
                                                            transition: Slide,
                                                        });
                                                    }}
                                                >
                                                    <Cross1Icon />
                                                    Eliminar
                                                </Button>
                                            </Tooltip>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table.Root>
            </div>
        </div >
    )
}