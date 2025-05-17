'use client';

import { Button, Dialog, Flex, Select, Table, Text, Tooltip } from "@radix-ui/themes";
import { PlusIcon, Pencil1Icon, Cross1Icon, BarChartIcon } from "@radix-ui/react-icons";
import { addProduct, deleteProduct, getProducts, getProviders, updateProduct, getHistoryPrice, generateRandomHistoryPrice } from "@/lib/db";
import { Form } from "radix-ui";
import { useEffect, useState } from "react";
import { Data2Plot, Product, Provider } from "@/lib/definitions";
import { Slide, toast, ToastContainer } from "react-toastify";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Tooltip as ChartTooltip,
    Legend,
    Title,
    Filler
} from 'chart.js';

import { Line } from 'react-chartjs-2';

export default function Products() {
    const [productos, setProductos] = useState<Product[]>([]);
    const [proveedores, setProveedores] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<string | null>();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [selectedProductToPlot, setSelectedProductToPlot] = useState<Product | null>(null);
    const [data2plot, setData2Plot] = useState<Data2Plot[] | null>([]);

    useEffect(() => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            LineController,
            ChartTooltip,
            Legend,
            Title,
            Filler
        )

        async function fetchData() {
            const productos = await getProducts();
            const proveedores = await getProviders();

            setProductos(productos);
            setProveedores(proveedores);
        }
        fetchData();
    }, []);

    useEffect(() => {
        getHistoryPrice(selectedProductToPlot?.id || '')
            .then((data) => {
                setData2Plot(data);
            }
            )
            .catch((error) => {
                console.error('Error fetching history price:', error);
            }
            );

    }, [selectedProductToPlot]);

    return (
        <div className="p-6">
            <div className="flex flex-col items-baseline justify-start">
                <Flex direction="row" align="center" className="gap-4 w-full">
                    <Flex direction="column" className="gap-2 w-full">
                        <Text size="8" weight="bold">
                            Productos
                        </Text>
                        <Text color="gray" size="3">
                            Aquí puedes gestionar los productos de tu tienda, añadir nuevos productos y editar los existentes.
                        </Text>
                    </Flex>

                    <Dialog.Root>
                        <Tooltip content="Añadir producto" side="top" align="center">
                            <Dialog.Trigger>
                                <Button variant="soft" className="ml-auto">
                                    <PlusIcon className="mr-2" />
                                    Añadir Producto
                                </Button>
                            </Dialog.Trigger>
                        </Tooltip>

                        <Dialog.Content>
                            <Dialog.Title>Agregar Producto</Dialog.Title>
                            <Dialog.Description>
                                Completa los campos para agregar un nuevo producto a tu tienda.
                            </Dialog.Description>

                            <Flex direction="column" gap="3" className="w-full" mt="6">
                                <Form.Root className="FormRoot"
                                    onSubmit={async (event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);
                                        const provider = formData.get('provider');
                                        const nombre = formData.get('nombre');
                                        const quantity = formData.get('quantity');
                                        const location = formData.get('location');
                                        const price = formData.get('price');


                                        const res = await addProduct(
                                            provider as string,
                                            nombre as string,
                                            Number(quantity) || 0,
                                            location as string,
                                            Number(price) || 0
                                        )
                                        console.log('Response:', res);
                                        if (res) {
                                            console.log('Producto agregado correctamente')
                                            const newProducts = await getProducts();
                                            setProductos(newProducts);
                                            setSelectedProvider(null);
                                            toast.success(
                                                'Producto ' + nombre + ' agregado correctamente', {
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

                                    <Form.Field className="FormField" name="provider">

                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Proveedor
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Selecciona un proveedor
                                            </Text>
                                        </Form.Message>

                                        {/* Hidden Input to Store Selected Value */}
                                        <Form.Control asChild className="w-full">
                                            <input
                                                type="text"
                                                hidden
                                                required
                                                name="provider"
                                                value={selectedProvider || ''}
                                                readOnly
                                            />
                                        </Form.Control>

                                        <Select.Root size="2"
                                            onValueChange={(value) => {
                                                setSelectedProvider(value);
                                            }}
                                        >
                                            <Select.Trigger placeholder="Selecciona un proveedor" variant="surface" />
                                            <Select.Content >
                                                <Select.Group className="w-full">
                                                    {
                                                        proveedores.map((proveedor) => (
                                                            <Select.Item key={proveedor.id} value={proveedor.id}>
                                                                {proveedor.name}
                                                            </Select.Item>
                                                        ))
                                                    }
                                                </Select.Group>
                                            </Select.Content>
                                        </Select.Root>

                                    </Form.Field>

                                    <Form.Field className="FormField" name="nombre">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Nombre del Producto
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa un nombre de producto
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="text" required placeholder="Ingresa un nombre de producto" />
                                        </Form.Control>
                                    </Form.Field>

                                    <Form.Field className="FormField" name="quantity">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Cantidad Inicial
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa una cantidad inicial
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="number" required placeholder="Ingresa una cantidad inicial" />
                                        </Form.Control>
                                    </Form.Field>

                                    <Form.Field className="FormField" name="location">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Ubicación Física
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa la ubicación física del producto
                                            </Text>
                                        </Form.Message>
                                        <Form.Message className="FormMessage" match="typeMismatch">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa una ubicación válida
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="text" required placeholder="Ingresa la ubicación del producto" />
                                        </Form.Control>
                                    </Form.Field>

                                    <Form.Field className="FormField" name="price">
                                        <Form.Label className="FormLabel" asChild>
                                            <Text as="div" size="3" mb="1" weight="bold">
                                                Precio
                                            </Text>
                                        </Form.Label>
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            <Text size="1" color="red" weight="regular" >
                                                Ingresa un precio
                                            </Text>
                                        </Form.Message>
                                        <Form.Control asChild className="w-full">
                                            <input type="number" required placeholder="Ingresa un precio" />
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
                selectedProduct !== null
            }>
                <Dialog.Content>
                    <Dialog.Title>Agregar Producto</Dialog.Title>
                    <Dialog.Description>
                        Completa los campos para agregar un nuevo producto a tu tienda.
                    </Dialog.Description>

                    <Flex direction="column" gap="3" className="w-full" mt="6">
                        <Form.Root className="FormRoot"
                            onSubmit={async (event) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);
                                const id = selectedProduct?.id;
                                const provider = formData.get('provider');
                                const nombre = formData.get('nombre');
                                const quantity = formData.get('quantity');
                                const location = formData.get('location');
                                const price = formData.get('price');


                                const res = await updateProduct(
                                    id as string,
                                    provider as string,
                                    nombre as string,
                                    Number(quantity) || 0,
                                    location as string,
                                    Number(price) || 0
                                )
                                console.log('Response:', res);
                                if (res) {
                                    const newProducts = await getProducts();
                                    setProductos(newProducts);
                                    setSelectedProvider(null);
                                    toast.success(
                                        'Producto ' + nombre + ' editado correctamente', {
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

                                    setSelectedProduct(null);
                                }
                            }}
                        >

                            <Form.Field className="FormField" name="provider">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Proveedor
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Selecciona un proveedor
                                    </Text>
                                </Form.Message>
                                {/* Hidden Input to Store Selected Value */}
                                <Form.Control asChild className="w-full">
                                    <input
                                        type="text"
                                        hidden
                                        required
                                        name="provider"
                                        value={selectedProduct?.provider || ''}
                                        readOnly
                                    />
                                </Form.Control>
                                <Select.Root size="2"
                                    onValueChange={(value) => {
                                        setSelectedProvider(value);
                                    }}
                                    value={selectedProduct?.provider || ''}
                                >
                                    <Select.Trigger placeholder="Selecciona un proveedor" variant="surface" />
                                    <Select.Content >
                                        <Select.Group className="w-full">
                                            {
                                                proveedores.map((proveedor) => (
                                                    <Select.Item key={proveedor.id} value={proveedor.id}>
                                                        {proveedor.name}
                                                    </Select.Item>
                                                ))
                                            }
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>

                            </Form.Field>

                            <Form.Field className="FormField" name="nombre">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Nombre del Producto
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa un nombre de producto
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="text" required placeholder="Ingresa un nombre de producto"
                                        content={selectedProduct?.name || ''}
                                        defaultValue={selectedProduct?.name || ''}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="quantity">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Cantidad Inicial
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa una cantidad inicial
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="number" required placeholder="Ingresa una cantidad inicial"
                                        defaultValue={selectedProduct?.quantity || 0}
                                        content={String(selectedProduct?.quantity) || "0"}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="location">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Ubicación Física
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa la ubicación física del producto
                                    </Text>
                                </Form.Message>
                                <Form.Message className="FormMessage" match="typeMismatch">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa una ubicación válida
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="text" required placeholder="Ingresa la ubicación del producto"
                                        defaultValue={selectedProduct?.location || ''}
                                        content={selectedProduct?.location || ''}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field className="FormField" name="price">
                                <Form.Label className="FormLabel" asChild>
                                    <Text as="div" size="3" mb="1" weight="bold">
                                        Precio
                                    </Text>
                                </Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    <Text size="1" color="red" weight="regular" >
                                        Ingresa un precio
                                    </Text>
                                </Form.Message>
                                <Form.Control asChild className="w-full">
                                    <input type="number" required placeholder="Ingresa un precio"
                                        defaultValue={selectedProduct?.Price || 0}
                                        content={String(selectedProduct?.Price) || "0"}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <Flex gap="3" mt="4" justify="between">
                                <Dialog.Close>
                                    <Button variant="soft" color="gray"
                                        onClick={() => {
                                            setSelectedProduct(null);
                                        }}
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

            <Dialog.Root open={
                selectedProductToPlot !== null
            }>
                <Dialog.Content>
                    <Dialog.Title>Precio Histórico</Dialog.Title>
                    <Dialog.Description>
                        Aquí puedes ver el precio histórico del producto seleccionado.
                    </Dialog.Description>

                    <Flex direction="column" gap="3" className="w-full" mt="6">

                        {
                            data2plot && data2plot.length > 0 ? (
                                <Line
                                    data={{
                                        labels: data2plot?.map((data) => data.ProductId),
                                        datasets: [
                                            {
                                                label: 'Precio Histórico',
                                                data: data2plot?.map((data) => data.newPrice),
                                                fill: true,
                                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                                borderColor: 'rgba(75, 192, 192, 1)',
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                                display: false,
                                            },
                                            title: {
                                                display: false,
                                                text: 'Precio Histórico del Producto',
                                            },
                                        },
                                    }}
                                />
                            ) : (
                                <Text size="3" color="gray">
                                    No hay datos disponibles para este producto.
                                </Text>
                            )
                        }

                    </Flex>
                    <Flex gap="3" mt="4" justify="between">
                        <Dialog.Close>
                            <Button variant="soft" color="red"
                                onClick={() => {
                                    setSelectedProductToPlot(null);
                                }}
                            >
                                Cerrar
                            </Button>
                        </Dialog.Close>

                        <Dialog.Close>
                            <Button variant="soft" color="gray"
                                onClick={() => {
                                    generateRandomHistoryPrice(selectedProductToPlot?.id || '');
                                    setSelectedProductToPlot(null);
                                }}
                            >
                                Generar Datos Aleatorios
                            </Button>
                        </Dialog.Close>
                    </Flex>

                </Dialog.Content>
            </Dialog.Root>

            <div>
                <Table.Root variant="surface" className="mt-6 w-full h-fit" layout="auto">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Proveedor</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Precio</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Cantidad en Inventario</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Ubicación</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            productos.map((producto) => (
                                <Table.Row key={producto.id}>
                                    <Table.RowHeaderCell>{producto.id}</Table.RowHeaderCell>
                                    <Table.Cell>{
                                        proveedores.find((proveedor) => proveedor.id === producto.provider)?.name || 'Proveedor no encontrado'
                                    }</Table.Cell>
                                    <Table.Cell>{producto.name}</Table.Cell>
                                    <Table.Cell>{producto.Price}</Table.Cell>
                                    <Table.Cell>{producto.quantity}</Table.Cell>
                                    <Table.Cell>{producto.location}</Table.Cell>
                                    <Table.Cell>
                                        <Flex direction="row" align="center" className="gap-2">
                                            <Tooltip content="Editar producto" side="top" align="center">
                                                <Button variant="outline"
                                                    onClick={() => {
                                                        setSelectedProduct(producto);
                                                    }}
                                                >
                                                    <Pencil1Icon />
                                                    Editar
                                                </Button>
                                            </Tooltip>

                                            <Tooltip content="Eliminar producto" side="top" align="center">
                                                <Button variant="outline" color="red"
                                                    onClick={() => {
                                                        deleteProduct(producto.id);
                                                        const newProducts = productos.filter((prod) => prod.id !== producto.id);
                                                        setProductos(newProducts);
                                                        toast.warning(
                                                            'Producto ' + producto.name + ' eliminado correctamente', {
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

                                            <Tooltip content="Ver Gráfica" side="top" align="center">
                                                <Button variant="outline" onClick={
                                                    () => {
                                                        setSelectedProductToPlot(producto);
                                                    }
                                                }>
                                                    <BarChartIcon />
                                                    Ver Gráfica
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