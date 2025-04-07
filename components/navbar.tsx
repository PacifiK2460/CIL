'use client'

import { Avatar, Box, Card, Flex, IconButton, Separator, TabNav, Text, Tooltip } from '@radix-ui/themes'
import Image from 'next/image'
import { ExitIcon } from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const path = usePathname();
    return (
        <div>
            <div className="h-20 flex items-center justify-between px-4 z-10">
                <Flex direction="row" gap="4">
                    <Image
                        src="/vercel.svg"
                        width={25}
                        height={25}
                        alt="Logo"
                    />

                    <Text size="5" weight="bold">
                        Control de Inventario
                    </Text>
                </Flex>
                <div>
                    <TabNav.Root>
                        <TabNav.Link href="/products" active={
                            path === '/products'
                        }>
                            Productos
                        </TabNav.Link>
                        <TabNav.Link href="/providers" active={
                            path === '/providers'
                        }>
                            Proveedores
                        </TabNav.Link>
                        <TabNav.Link href="/personal" active={
                            path === '/personal'}>
                            Personal
                        </TabNav.Link>
                        <TabNav.Link href="/fleet" active={
                            path === '/fleet'
                        }>
                            Flotas
                        </TabNav.Link>
                    </TabNav.Root>
                </div>
                <div>
                    <Flex gap="4" align="center">
                        <Box>
                            <Card>
                                <Flex gap="3" align="center">
                                    <Avatar
                                        size="3"
                                        radius="full"
                                        fallback="ML"
                                    />
                                    <Box display={{
                                        initial: 'none',
                                        sm: 'block'
                                    }}>
                                        <Flex gap="4">
                                            <Box>
                                                <Text as="div" size="1" weight="bold">
                                                    Santiago de la cruz Martinez Lara
                                                </Text>
                                                <Text as="div" size="1" color="gray">
                                                    AQ1316
                                                </Text>
                                            </Box>
                                            <Tooltip content="Cerrar sesión">
                                                <IconButton variant='outline' onClick={() => {
                                                    window.location.href = '/signout'
                                                }}>
                                                    <ExitIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Flex>
                                    </Box>
                                </Flex>
                            </Card>
                        </Box>
                    </Flex>
                </div>


            </div>
            <Separator size="4" />
        </div>
    )
}