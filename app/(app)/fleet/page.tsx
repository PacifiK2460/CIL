'use client'

import { Button, Dialog, Flex, Select, Table, Text, Tooltip } from "@radix-ui/themes";
import { PlusIcon, Pencil1Icon, Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { Fleet, Invoice, FleetStatus, Product } from "@/lib/definitions";
import { getFleet, deleteFleet, updateFleet, addFleet, getInvoices, getProducts } from "@/lib/db";
=======
import { Fleet, Invoice, FleetStatus } from "@/lib/definitions";
import { getFleet, deleteFleet, addFleet, getInvoices } from "@/lib/db";
>>>>>>> 1bcde9a4fc75c98738ffae5cd5bb88dd43e89839
import { Form } from "radix-ui";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function FleetCom() {
    const [fleets, setFleet] = useState<Fleet[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [productos, setProductos] = useState<Product[]>([]);

    // Get only the ids of the invoices
    const invoiceIds = invoices.map((invoice) => invoice.id);
    // Remove duplicates
    const groupedInvoices = [...new Set(invoiceIds)];

    const [selectedInvoice, setSelectedInvoice] = useState<string>();

    const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getFleet();
            setFleet(data);

            const invoiceData = await getInvoices();
            setInvoices(invoiceData);

            const productos = await getProducts();
            setProductos(productos);

            console.log(data);
        };
        fetchData();
    }, [])

    return (
        <div className="p-6">
            <div className="flex flex-col items-baseline justify-start">
                <Flex direction="row" align="center" className="gap-4 w-full">
                    <Flex direction="column" className="gap-2 w-full">
                        <Text size="8" weight="bold">
                            Flotas
                        </Text>
                        <Text color="gray" size="3">
                            Aquí puedes gestionar las flotas de tu tienda, añadir nuevas flotas y editar las existentes.
                        </Text>
                    </Flex>

                    <Dialog.Root>
                        <Tooltip content="Añadir Flota" side="top" align="center">
                            <Dialog.Trigger>
                                <Button variant="soft" className="ml-auto">
                                    <PlusIcon className="mr-2" />
                                    Añadir Flota
                                </Button>
                            </Dialog.Trigger>
                        </Tooltip>

                        <Dialog.Content>
                            <Dialog.Title>Agregar Flota</Dialog.Title>
                            <Dialog.Description>
                                Aquí puedes agregar una nueva flota a tu tienda. Asegúrate de completar todos los campos requeridos.
                            </Dialog.Description>

                            <Flex direction="column" gap="3" className="w-full">
                                <Form.Root className="FormRoot"
                                    onSubmit={async (event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);

                                        const invoice = formData.get('provider') as string;
                                        const departure = formData.get('exit') as string;
                                        const destination = formData.get('rol') as string;
                                        const status = FleetStatus.Pending

                                        const res = await addFleet(
                                            invoice,
                                            departure,
                                            destination,
                                            status
                                        )

                                        if (res) {
                                            toast.success('Flota agregada correctamente', {
                                                position: "top-right",
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                transition: Slide
                                            });
                                            const data = await getFleet();
                                            setFleet(data);
                                            setSelectedInvoice("");
                                        } else {
                                            toast.error('Error al agregar la flota', {
                                                position: "bottom-right",
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                transition: Slide
                                            });
                                        }
                                    }}
                                >

                                    <Form.Field className="FormField" name="provider">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Factura
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Selecciona una factura
                                            </Text>
                                        </Form.Message>
                                        {/* Hidden Input to Store Selected Value */}
                                        <Form.Control asChild className="w-full">
                                            <input
                                                type="text"
                                                hidden
                                                required
                                                name="provider"
                                                value={selectedInvoice || ''}
                                                readOnly
                                            />
                                        </Form.Control>
                                        <Select.Root
                                            onValueChange={(value) => {
                                                setSelectedInvoice(value);
                                            }}
                                        >
                                            <Select.Trigger placeholder="Selecciona una factura" variant="surface" />
                                            <Select.Content >
                                                <Select.Group className="w-full">
                                                    {
                                                        invoices.map((invoice) => (
                                                            <Select.Item key={invoice.id} value={invoice.id}>
                                                                {invoice.id}
                                                            </Select.Item>
                                                        ))
                                                    }
                                                </Select.Group>
                                            </Select.Content>
                                        </Select.Root>
                                    </Form.Field>

                                    <Form.Field className="FormField" name="exit">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Salida
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa una salida
                                            </Text>
                                        </Form.Message>
                                        <Form.Message className="FormMessage" match="typeMismatch">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa una salida válida
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="text" required placeholder="Ingresa el correo electrónico" />
                                        </Form.Control>
                                    </Form.Field>

                                    <Form.Field className="FormField" name="rol">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Destino
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa un destino
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="text" required placeholder="Ingresa un rol" />
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


            <Dialog.Root
                open={selectedFleet !== null}
            >
                <Dialog.Content>
                    <Dialog.Title>Editar Flota</Dialog.Title>
                    <Dialog.Description>
                        Aquí puedes editar una flota existente. Asegúrate de completar todos los campos requeridos.
                    </Dialog.Description>

                    <Flex direction="column" gap="3" className="w-full">
                        <Form.Root className="FormRoot"
                            onSubmit={async (event) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);

                                const invoice = formData.get('provider') as string;
                                const departure = formData.get('exit') as string;
                                const destination = formData.get('rol') as string;
                                const status = formData.get('status') as FleetStatus;
                                const id = selectedFleet?.id as string;

                                const res = await updateFleet(
                                    id,
                                    invoice,
                                    departure,
                                    destination,
                                    status
                                )
                                if (res) {
                                    toast.success('Flota editada correctamente', {
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
                                    const data = await getFleet();
                                    setFleet(data);
                                    setSelectedInvoice("");
                                } else {
                                    toast.error('Error al editar la flota', {
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

                                setSelectedFleet(null);
                                // Edit the fleet 
                                const updatesdFleets = fleets.map((fleet) => {
                                    if (fleet.id === selectedFleet?.id) {
                                        return {
                                            ...fleet,
                                            invoice: invoice,
                                            departure: departure,
                                            destination: destination,
                                            status: status
                                        }
                                    }
                                    return fleet;
                                })

                                setFleet(updatesdFleets);
                            }}
                        >

                            <Form.Field className="FormField" name="provider">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Factura {selectedFleet?.invoice}
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Selecciona una factura
                                    </Text>
                                </Form.Message>
                            </Form.Field>

                            <Form.Field className="FormField" name="exit">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Salida
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa una salida
                                    </Text>
                                </Form.Message>
                                <Form.Message className="FormMessage" match="typeMismatch">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa una salida válida
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="text" required placeholder="Ingresa la salida" defaultValue={
                                        selectedFleet?.departure
                                    } />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="rol">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Destino
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa un destino
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="text" required placeholder="Ingresa el destino"
                                        defaultValue={selectedFleet?.destination} />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="status">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Estado
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Selecciona un estado
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <Select.Root
                                        defaultValue={selectedFleet?.status}
                                        onValueChange={(value) => {
                                            setSelectedFleet((prev) => prev ? { ...prev, status: value as FleetStatus } : null)
                                        }}
                                    >
                                        <Select.Trigger placeholder="Selecciona un estado" variant="surface" />
                                        <Select.Content >
                                            <Select.Group className="w-full">
                                                {
                                                    Object.values(FleetStatus).map((status) => (
                                                        <Select.Item key={status} value={status}>
                                                            {status}
                                                        </Select.Item>
                                                    ))
                                                }
                                            </Select.Group>
                                        </Select.Content>
                                    </Select.Root>

                                </Form.Control>
                            </Form.Field>

                            <Flex gap="3" mt="4" justify="between">
                                <Dialog.Close>
                                    <Button variant="soft" color="gray" onClick={() => setSelectedFleet(null)}>
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
                            <Table.ColumnHeaderCell>Factura</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Productos</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Salida</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Destino</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            fleets.map((fleet) => (
                                <Table.Row key={fleet.id}>
                                    <Table.RowHeaderCell>{fleet.id}</Table.RowHeaderCell>
                                    <Table.Cell>{fleet.invoice}</Table.Cell>
                                    <Table.Cell>
                                        <Flex direction="column" gap="2">
                                            {
                                                groupedInvoices.map((invoiceId) => {
                                                    const invoice = invoices.find((inv) => inv.id === invoiceId);
                                                    const product = productos.find((prod) => prod.id === invoice?.productId);
                                                    return (
                                                        <Flex key={invoiceId} direction="row" gap="2" align="center" className="w-full h-full">
                                                            <Text size="2" color="gray">
                                                                {invoice?.quantity} x
                                                            </Text>
                                                            <Text size="2" weight="bold">
                                                                {product?.name}
                                                            </Text>
                                                            <Text size="1" color="gray">
                                                                {product?.location}
                                                            </Text>
                                                        </Flex>
                                                    )
                                                })
                                            }
                                        </Flex>
                                    </Table.Cell>
                                    <Table.Cell>{fleet.departure}</Table.Cell>
                                    <Table.Cell>{fleet.destination}</Table.Cell>
                                    <Table.Cell>{fleet.status}</Table.Cell>
                                    <Table.Cell>
                                        <Flex direction="row" align="center" className="gap-2 w-5">
                                            <Tooltip content="Editar producto (PROXIMAMENTE)" side="top" align="center">
                                                <Button variant="outline" onClick={
                                                    () => {
                                                        setSelectedFleet(fleet);
                                                    }
                                                }>
                                                    <Pencil1Icon />
                                                    Editar
                                                </Button>
                                            </Tooltip>

                                            <Tooltip content="Eliminar producto" side="top" align="center">
                                                <Button variant="outline" color="red"
                                                    onClick={async () => {
                                                        const res = await deleteFleet(fleet.id);
                                                        if (res) {
                                                            toast.success('Flota eliminada correctamente', {
                                                                position: "top-right",
                                                                autoClose: 3000,
                                                                hideProgressBar: false,
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress: undefined,
                                                                transition: Slide
                                                            });
                                                            const data = await getFleet();
                                                            setFleet(data);
                                                        } else {
                                                            toast.error('Error al eliminar la flota', {
                                                                position: "bottom-right",
                                                                autoClose: 3000,
                                                                hideProgressBar: false,
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress: undefined,
                                                                transition: Slide
                                                            });
                                                        }
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