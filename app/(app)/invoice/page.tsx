'use client'

import { Button, CheckboxCards, Dialog, Flex, Table, Text, Tooltip, ScrollArea } from "@radix-ui/themes";
import { PlusIcon, Pencil1Icon, Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Invoice, Product, Provider } from "@/lib/definitions";
import { addInvoice, getInvoices, getProducts, getProviders, updateInvoice, deleteInvoice } from "@/lib/db";
import { Form } from "radix-ui";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function FleetCom() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [productos, setProductos] = useState<Product[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);

    const [selectedProducts, setSelectedProducts] = useState<{ Prod: Product, Qnty: number, Selected: boolean }[]>([]);

    // Get only the ids of the invoices
    const invoiceIds = invoices.map((invoice) => invoice.id);
    // Remove duplicates
    const groupedInvoices = [...new Set(invoiceIds)];

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getInvoices();
            setInvoices(data);

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

                    <Dialog.Root >
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
                                                <CheckboxCards.Root defaultValue={[]} columns={{ initial: "1" }}
                                                    className="CheckboxCardsRoot"
                                                    onValueChange={(value) => {
                                                        // Value is an array of selected product ids
                                                        // Change the selected product state based on the checkbox value
                                                        const selectedProducts = productos.map((producto) => {
                                                            return {
                                                                Prod: producto,
                                                                Qnty: 0,
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
                                                                        defaultValue={0}
                                                                        content="0"
                                                                        min={0}
                                                                        max={
                                                                            producto.quantity
                                                                        } className="font-extralight" required placeholder="Cantidad a facturar"
                                                                        onChange={(e) => {
                                                                            const value = parseInt(e.target.value);

                                                                            const _Selected = selectedProducts.map((product) => {
                                                                                if (product.Prod.id === producto.id) {
                                                                                    return {
                                                                                        ...product,
                                                                                        Qnty: value
                                                                                    }
                                                                                }
                                                                                return product;
                                                                            })

                                                                            setSelectedProducts(_Selected);

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

                                                    const newInvoice: Invoice[] = selectedProductsFiltered.map((product) => {
                                                        return {
                                                            id: "",
                                                            invoiceItemId: "",
                                                            productId: product.Prod.id,
                                                            quantity: product.Qnty
                                                        }
                                                    })

                                                    const res = await addInvoice(newInvoice);

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

                                                    setSelectedProducts([]);
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

            <Dialog.Root
                open={selectedInvoice !== null}
            >
                <Dialog.Content className="max-h-96">
                    <Dialog.Title>Editar Factura</Dialog.Title>
                    <Dialog.Description>
                        Aquí puedes agregar editar una factura al sistema.
                    </Dialog.Description>

                    <Flex direction="column" gap="3" className="w-full">
                        <Form.Root className="FormRoot"
                        // onSubmit={async () => {
                        //     const selectedProductsFiltered = selectedProducts.filter((product) => product.Selected);
                        //     console.log("Selected", selectedProductsFiltered);
                        // }}
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
                                        <CheckboxCards.Root defaultValue={
                                            selectedInvoice?.map((invoice) => invoice.productId)
                                        } columns={{ initial: "1" }}
                                            className="CheckboxCardsRoot"
                                            onValueChange={(value) => {
                                                // Change the selected product state based on the checkbox value
                                                console.log("Value", value);
                                                console.log("Selected Invoic", selectedInvoice);

                                                const selectedProducts = productos.map((producto) => {
                                                    return {
                                                        Prod: producto,
                                                        Selected: value.includes(producto.id),
                                                        Qnty: selectedInvoice?.find((inv) => inv.productId === producto.id)?.quantity || 0
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
                                                            <input
                                                                defaultValue={
                                                                    selectedInvoice?.find((inv) => inv.productId === producto.id)?.quantity
                                                                }
                                                                type="number"
                                                                min={1}
                                                                max={
                                                                    producto.quantity
                                                                } className="font-extralight" required placeholder="Cantidad a facturar"
                                                                onChange={(e) => {
                                                                    const value = parseInt(e.target.value);

                                                                    const _Selected = selectedProducts.map((product) => {
                                                                        if (product.Prod.id === producto.id) {
                                                                            return {
                                                                                ...product,
                                                                                Qnty: value
                                                                            }
                                                                        }
                                                                        return product;
                                                                    })

                                                                    setSelectedProducts(_Selected);
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
                                    <Button variant="soft" color="gray" onClick={() => {
                                        setSelectedInvoice(null)
                                    }}>
                                        Cancelar
                                    </Button>
                                </Dialog.Close>
                                <Dialog.Close>
                                    <Button
                                        onClick={async () => {
                                            if(selectedInvoice === null) return;

                                            console.log("Selected Products", selectedProducts);
                                            const selectedProductsFiltered = selectedProducts.filter((product) => product.Selected && product.Qnty > 0);
                                            console.log("Selected", selectedProductsFiltered);

                                            const newInvoice: Invoice[] = selectedProductsFiltered.map((product) => {
                                                return {
                                                    id: selectedInvoice.find((inv) => inv.productId === product.Prod.id)?.id || "",
                                                    invoiceItemId: selectedInvoice.find((inv) => inv.productId === product.Prod.id)?.invoiceItemId || "",
                                                    productId: product.Prod.id,
                                                    quantity: product.Qnty
                                                }
                                            })

                                            console.log("New Invoice", newInvoice);

                                            const res = await updateInvoice(newInvoice);

                                            if (await res) {
                                                const invoices = getInvoices()
                                                setInvoices(await invoices)
                                                toast.success(
                                                    'Factura Editada correctamente', {
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

                                            setSelectedProducts([]);
                                            setSelectedInvoice(null);
                                        }}
                                    >Agregar</Button>
                                </Dialog.Close>
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
                            <Table.ColumnHeaderCell>Productos</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            groupedInvoices.map((invoiceId) => {
                                const groupedInvoices = invoices.filter((inv) => inv.id === invoiceId)

                                return (
                                    <Table.Row key={invoiceId}>
                                        <Table.Cell>{invoiceId}</Table.Cell>
                                        <Table.Cell>
                                            <Flex direction="column" gap="2">
                                                {
                                                    productos.filter((producto) => groupedInvoices.some((inv) => inv.productId === producto.id)).map((producto) => (
                                                        <Flex key={producto.id} direction="row" gap="2" align="center" className="w-full h-full">
                                                            <Text size="2" color="gray">
                                                                {
                                                                    groupedInvoices.find((inv) => inv.productId === producto.id)?.quantity
                                                                }
                                                                x
                                                            </Text>
                                                            <Text size="2" weight="bold">
                                                                {producto.name}
                                                            </Text>
                                                            <Text size="1" color="gray">
                                                                {
                                                                    providers.find((provider) => provider.id === producto.provider)?.name
                                                                }
                                                            </Text>
                                                        </Flex>
                                                    ))
                                                }
                                            </Flex>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Flex gap="2">
                                                <Tooltip content="Editar" side="top" align="center">
                                                    <Button variant="soft" size="1" onClick={() => {
                                                        const selectedInvoice = invoices.filter((inv) => inv.id === invoiceId)
                                                        console.log("Invoices", invoices);
                                                        console.log("Selected Invoice", selectedInvoice);
                                                        setSelectedInvoice(
                                                            selectedInvoice
                                                        )

                                                        // Set the selected products to the selected invoice
                                                        const selectedProducts = selectedInvoice?.map((item) => {
                                                            return {
                                                                Prod: productos.find((prod) => prod.id === item.productId) || { id: "", name: "", provider: "", quantity: 0, location: "", Price: 0 },
                                                                Qnty: item.quantity,
                                                                Selected: true
                                                            }
                                                        })
                                                        console.log("Selected Products", invoices.filter((inv) => inv.id === invoiceId));

                                                        setSelectedProducts(selectedProducts);
                                                    }}>
                                                        <Pencil1Icon />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Eliminar" side="top" align="center">
                                                    <Button variant="soft" color="red" size="1"
                                                        onClick={async () => {
                                                            deleteInvoice(invoiceId)

                                                            const res = await deleteInvoice(invoiceId);

                                                            if (await res) {
                                                                const invoices = getInvoices()
                                                                setInvoices(await invoices)
                                                                toast.success(
                                                                    'Factura eliminada correctamente', {
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
                                                        }}>
                                                        <Cross1Icon />
                                                    </Button>
                                                </Tooltip>
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }

                    </Table.Body>
                </Table.Root>
            </div>
        </div>
    )
}