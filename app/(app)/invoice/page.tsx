'use client'

import { Button, CheckboxCards, Dialog, Flex, Table, Text, Tooltip, ScrollArea } from "@radix-ui/themes";
import { PlusIcon, Pencil1Icon, Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Invoice, Product, Provider } from "@/lib/definitions";
import { addInvoice, getInvoices, getProducts, getProviders } from "@/lib/db";
import { Form } from "radix-ui";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function FleetCom() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [productos, setProductos] = useState<Product[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);

    const [selectedProducts, setSelectedProducts] = useState<{ Prod: Product, Qnty: number, Selected: boolean }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getInvoices();
            setInvoices(data);
            console.log("Invoices", JSON.parse(data[0].order_key)[0][0]);

            const productos = await getProducts();
            setProductos(productos);

            const providers = await getProviders();
            setProviders(providers);

            const selected = productos.map((producto) => {
                return {
                    Prod: producto,
                    Qnty: 0,
                    Selected: false
                }
            })
            setSelectedProducts(selected);

        };
        fetchData();

    }, [])

    return (
        <div className="p-6">
            <div className="flex flex-col items-baseline justify-start">
                <Flex direction="row" align="center" className="gap-4 w-full">
                    <Flex direction="column" className="gap-2 w-full">
                        <Text size="8" weight="bold">
                            Facturas
                        </Text>
                        <Text color="gray" size="3">
                            Aquí puedes ver todas las facturas registradas en el sistema.
                        </Text>
                    </Flex>

                    <Dialog.Root>
                        <Tooltip content="Añadir Flota" side="top" align="center">
                            <Dialog.Trigger>
                                <Button variant="soft" className="ml-auto">
                                    <PlusIcon className="mr-2" />
                                    Nueva Factura
                                </Button>
                            </Dialog.Trigger>
                        </Tooltip>

                        <Dialog.Content className="max-h-96">
                            <Dialog.Title>Nueva Factura</Dialog.Title>
                            <Dialog.Description>
                                Aquí puedes agregar una nueva factura al sistema.
                            </Dialog.Description>

                            <Flex direction="column" gap="3" className="w-full">
                                <Form.Root className="FormRoot"
                                    onSubmit={async () => {
                                        const selectedProductsFiltered = selectedProducts.filter((product) => product.Selected);
                                        console.log("Selected", selectedProductsFiltered);


                                        // const nombre = formData.get('nombre');
                                        // const correo = formData.get('correo');
                                        // const rol = formData.get('rol');
                                        // const direccion = formData.get('direccion');
                                        // const password = formData.get('password');

                                        // const res = await addPersonal(
                                        //     nombre as string,
                                        //     correo as string,
                                        //     rol as string,
                                        //     direccion as string,
                                        //     password as string
                                        // )
                                        // if (res) {
                                        //     const personal = await getPersonal()
                                        //     setPersonal(personal)
                                        //     toast.success(
                                        //         'Personal ' + nombre + ' agregado correctamente', {
                                        //         position: "bottom-right",
                                        //         autoClose: 5000,
                                        //         hideProgressBar: false,
                                        //         closeOnClick: false,
                                        //         pauseOnHover: true,
                                        //         draggable: true,
                                        //         progress: undefined,
                                        //         theme: "light",
                                        //         transition: Slide,
                                        //     });
                                        // }
                                    }}
                                >

                                    <Form.Field className="FormField" name="nombre">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Productos
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa algún producto
                                            </Text>
                                        </Form.Message>

                                        <Form.Control asChild className="w-full">
                                            <input hidden type="text" required placeholder="Ingresa algún producto" readOnly
                                                value={selectedProducts.map((product) => product.Prod).join(",")}
                                            />
                                        </Form.Control>

                                        <ScrollArea type="always" scrollbars="vertical" className="h-full">
                                            <Flex direction="column">
                                                <CheckboxCards.Root defaultValue={["0"]} columns={{ initial: "1" }}
                                                    className="CheckboxCardsRoot"
                                                    onValueChange={(value) => {
                                                        // Change the selected product state based on the checkbox value
                                                        const selectedProducts = productos.map((producto, Qnty) => {
                                                            return {
                                                                Prod: producto,
                                                                Qnty: Qnty,
                                                                Selected: value.includes(producto.id)
                                                            }
                                                        })

                                                        setSelectedProducts(selectedProducts);
                                                    }}
                                                >
                                                    {
                                                        productos.map((producto) => (
                                                            <Flex direction="row" gap="3" align="center" className="w-full h-full" key={producto.id}>
                                                                <Flex direction="column">
                                                                    <Text as="div" size="3" mb="1" weight="bold">
                                                                        Cantidad
                                                                    </Text>
                                                                    <input type="number"
                                                                        min={1}
                                                                        max={
                                                                            producto.quantity
                                                                        } className="font-extralight" required placeholder="Cantidad a facturar"
                                                                        onChange={(e) => {
                                                                            const value = parseInt(e.target.value);
                                                                            setSelectedProducts((prev) => {
                                                                                const newProducts = [...prev];
                                                                                const index = newProducts.findIndex((p) => p.Prod.id === producto.id);
                                                                                if (index !== -1) {
                                                                                    newProducts[index].Qnty = value;
                                                                                }
                                                                                return newProducts;
                                                                            });
                                                                        }}
                                                                    />
                                                                </Flex>
                                                                <CheckboxCards.Item key={producto.id} value={producto.id} className="w-full h-full">
                                                                    <Flex direction="column" width="100%" className="w-full h-full">
                                                                        <Text weight="bold" size="4">{producto.name}</Text>
                                                                        <Text weight="light" size="1">{
                                                                            providers.find((provider) => provider.id === producto.provider)?.name
                                                                        } | {
                                                                                producto.id
                                                                            }</Text>
                                                                    </Flex>
                                                                </CheckboxCards.Item>
                                                            </Flex>
                                                        ))
                                                    }
                                                </CheckboxCards.Root>
                                            </Flex>
                                        </ScrollArea>
                                    </Form.Field>
                                    <Flex gap="3" mt="4" justify="between">
                                        <Dialog.Close>
                                            <Button variant="soft" color="gray">
                                                Cancelar
                                            </Button>
                                        </Dialog.Close>
                                        <Dialog.Close>
                                            <Button
                                                onClick={async () => {
                                                    const selectedProductsFiltered = selectedProducts.filter((product) => product.Selected && product.Qnty > 0);
                                                    console.log("Selected", selectedProductsFiltered);

                                                    const res = addInvoice(
                                                        selectedProductsFiltered.map((product) => {
                                                            return [
                                                                product.Prod.id,
                                                                product.Qnty
                                                            ]
                                                        }));

                                                    if (await res) {
                                                        const invoices = getInvoices()
                                                        setInvoices(await invoices)
                                                        toast.success(
                                                            'Factura agregada correctamente', {
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
                                            >Agregar</Button>
                                        </Dialog.Close>
                                    </Flex>
                                </Form.Root>
                            </Flex>


                        </Dialog.Content>
                    </Dialog.Root>
                </Flex>
            </div>

            <ToastContainer />

            <div>
                <Table.Root variant="surface" className="mt-6 w-full h-fit" layout="fixed">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Cantidad</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            invoices.map((invoice) => (
                                // JSON.parse(data[0].order_key)[0][0] -> invoice.id
                                // JSON.parse(data[0].order_key)[0][1] -> invoice.order_value
                                JSON.parse(invoice.order_key).map((
                                    product: [string, number] // [id, quantity]
                                ) => (
                                    <Table.Row key={invoice.id + product[0]}>
                                        <Table.Cell>{invoice.id}</Table.Cell>
                                        <Table.Cell>{
                                            productos.find((producto) => producto.id === product[0])?.name
                                        }</Table.Cell>
                                        <Table.Cell>{product[1]}</Table.Cell>
                                        <Table.Cell className="flex gap-2">
                                            <Tooltip content="Editar Factura (PROXIMAMENTE)" side="top" align="center">
                                                <Button variant="soft" size="1" color="gray" className="w-8 h-8">
                                                    <Pencil1Icon />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Eliminar Producto de Factura (PROXIMAMENTE)" side="top" align="center">
                                                <Button variant="soft" size="1" color="red" className="w-8 h-8"
                                                // onClick={async () => {
                                                //     const res = await deleteInvoice(invoice.id)
                                                //     if (res) {
                                                //         const invoices = await getInvoices()
                                                //         setInvoices(invoices)
                                                //         toast.success(
                                                //             'Factura ' + invoice.id + ' eliminada correctamente', {
                                                //             position: "bottom-right",
                                                //             autoClose: 5000,
                                                //             hideProgressBar: false,
                                                //             closeOnClick: false,
                                                //             pauseOnHover: true,
                                                //             draggable: true,
                                                //             progress: undefined,
                                                //             theme: "light",
                                                //             transition: Slide,
                                                //         });
                                                //     }
                                                // }}
                                                >
                                                    <Cross1Icon />
                                                </Button>
                                            </Tooltip>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ))
                        }
                    </Table.Body>
                </Table.Root>
            </div>
        </div>
    )
}