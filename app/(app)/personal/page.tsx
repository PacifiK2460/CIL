'use client'

import { Button, Dialog, Flex, Table, Text, Tooltip } from "@radix-ui/themes";
import { PlusIcon, Pencil1Icon, Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Personal } from "@/lib/definitions";
import { addPersonal, deletePersonal, getPersonal, updatePersonal } from "@/lib/db";
import { Form } from "radix-ui";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function PersonalComp() {
    const [personal, setPersonal] = useState<Personal[]>([])

    const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null)

    useEffect(() => {
        const fetchPersonal = async () => {
            const personal = await getPersonal()
            setPersonal(personal)
        }
        fetchPersonal()
    }, [])

    return (
        <div className="p-6">
            <div className="flex flex-col items-baseline justify-start">
                <Flex direction="row" align="center" className="gap-4 w-full">
                    <Flex direction="column" className="gap-2 w-full">
                        <Text size="8" weight="bold">
                            Personal
                        </Text>
                        <Text color="gray" size="3">
                            Aquí puedes gestionar el personal de tu tienda, añadir nuevos empleados y editar los existentes.
                        </Text>
                    </Flex>

                    <Dialog.Root>
                        <Tooltip content="Añadir Personal" side="top" align="center">
                            <Dialog.Trigger>
                                <Button variant="soft" className="ml-auto">
                                    <PlusIcon className="mr-2" />
                                    Añadir Personal
                                </Button>
                            </Dialog.Trigger>
                        </Tooltip>

                        <Dialog.Content>
                            <Dialog.Title>Agregar Personal</Dialog.Title>
                            <Dialog.Description>
                                Completa el formulario para agregar un nuevo integrante al personal de la tienda.
                            </Dialog.Description>

                            <Flex direction="column" gap="3" className="w-full">
                                <Form.Root className="FormRoot"
                                    onSubmit={async (event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);

                                        const nombre = formData.get('nombre');
                                        const correo = formData.get('correo');
                                        const rol = formData.get('rol');
                                        const direccion = formData.get('direccion');
                                        const password = formData.get('password');

                                        const res = await addPersonal(
                                            nombre as string,
                                            correo as string,
                                            rol as string,
                                            direccion as string,
                                            password as string
                                        )
                                        if (res) {
                                            const personal = await getPersonal()
                                            setPersonal(personal)
                                            toast.success(
                                                'Personal ' + nombre + ' agregado correctamente', {
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

                                    <Form.Field className="FormField" name="rol">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Rol del Integrante
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa un rol
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="text" required placeholder="Ingresa un rol" />
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

                                    <Form.Field className="FormField" name="password">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Contraseña
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa una contraseña
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="password" required placeholder="Ingresa una contraseña" />
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
                </Flex>
            </div>

            <ToastContainer />

            <Dialog.Root open={
                selectedPersonal !== null

            }>
                <Dialog.Content>
                    <Dialog.Title>Agregar Personal</Dialog.Title>
                    <Dialog.Description>
                        Completa el formulario para agregar un nuevo integrante al personal de la tienda.
                    </Dialog.Description>

                    <Flex direction="column" gap="3" className="w-full">
                        <Form.Root className="FormRoot"
                            onSubmit={async (event) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);

                                const id = selectedPersonal?.id;
                                const nombre = formData.get('nombre');
                                const correo = formData.get('correo');
                                const rol = formData.get('rol');
                                const direccion = formData.get('direccion');
                                const password = formData.get('password');

                                const res = await updatePersonal(
                                    id as string,
                                    nombre as string,
                                    correo as string,
                                    rol as string,
                                    direccion as string,
                                    password as string
                                )
                                if (res) {
                                    const personal = await getPersonal()
                                    setPersonal(personal)
                                    toast.success(
                                        'Personal ' + nombre + ' actualizado correctamente', {
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
                                    setSelectedPersonal(null)
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
                                    <input type="text" required placeholder="Ingresa el nombre"
                                        content={selectedPersonal?.name}
                                        defaultValue={selectedPersonal?.name}
                                    />
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
                                    <input type="email" required placeholder="Ingresa el correo electrónico"
                                        content={selectedPersonal?.email}
                                        defaultValue={selectedPersonal?.email}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="rol">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Rol del Integrante
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa un rol
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="text" required placeholder="Ingresa un rol"
                                        content={selectedPersonal?.rol}
                                        defaultValue={selectedPersonal?.rol}
                                    />
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
                                    <input type="text" required placeholder="Ingresa una dirección"
                                        content={selectedPersonal?.address}
                                        defaultValue={selectedPersonal?.address}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="password">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Contraseña
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa una contraseña
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="password" required placeholder="Ingresa una contraseña"
                                        content={selectedPersonal?.password}
                                        defaultValue={selectedPersonal?.password}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Flex gap="3" mt="4" justify="between">
                                <Dialog.Close>
                                    <Button variant="soft" color="gray"
                                        onClick={() => setSelectedPersonal(null)}
                                    >
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

            <div>
                <Table.Root variant="surface" className="mt-6 w-full h-fit" layout="fixed">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Nombre</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Correo Electrónico</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Rol</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Dirección</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            personal.map((per) => (
                                <Table.Row key={per.id}>
                                    <Table.RowHeaderCell>{per.id}</Table.RowHeaderCell>
                                    <Table.Cell>{per.name}</Table.Cell>
                                    <Table.Cell>{per.email}</Table.Cell>
                                    <Table.Cell>{per.rol}</Table.Cell>
                                    <Table.Cell>{per.address}</Table.Cell>
                                    <Table.Cell>
                                        <Flex direction="row" align="center" className="gap-2 w-5">
                                            <Tooltip content="Editar producto" side="top" align="center">
                                                <Button variant="outline"
                                                    onClick={() => {
                                                        setSelectedPersonal(per)
                                                    }}
                                                >
                                                    <Pencil1Icon />
                                                    Editar
                                                </Button>
                                            </Tooltip>

                                            <Tooltip content="Eliminar producto" side="top" align="center">
                                                <Button variant="outline" color="red"
                                                    onClick={() => {
                                                        deletePersonal(per.id)
                                                        setPersonal(personal.filter((p) => p.id !== per.id))
                                                        toast.warning(
                                                            'Personal ' + per.name + ' eliminado correctamente', {
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
        </div>
    )
}