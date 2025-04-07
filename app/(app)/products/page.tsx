import { Button, Flex, Table, Text, Tooltip } from "@radix-ui/themes";
import { PlusIcon, Pencil1Icon, Cross1Icon } from "@radix-ui/react-icons";

export default function Products() {
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

                    <Tooltip content="Añadir producto" side="top" align="center">
                        <Button variant="soft" className="ml-auto">
                            <PlusIcon className="mr-2" />
                            Añadir Producto
                        </Button>
                    </Tooltip>
                </Flex>
            </div>

            <div>
                <Table.Root variant="surface" className="mt-6 w-full h-fit" layout="fixed">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Proveedor</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Cantidad en Inventario</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Ubicación</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
                            <Table.Cell>danilo@example.com</Table.Cell>
                            <Table.Cell>Developer</Table.Cell>
                            <Table.Cell>123 Main St, City</Table.Cell>
                            <Table.Cell>123 Main St, City</Table.Cell>
                            <Table.Cell>
                                <Flex direction="row" align="center" className="gap-2 w-5">
                                    <Tooltip content="Editar producto" side="top" align="center">
                                        <Button variant="outline">
                                            <Pencil1Icon />
                                            Editar
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="Eliminar producto" side="top" align="center">
                                        <Button variant="outline" color="red">
                                            <Cross1Icon />
                                            Eliminar
                                        </Button>
                                    </Tooltip>
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </div>
        </div>
    )
}