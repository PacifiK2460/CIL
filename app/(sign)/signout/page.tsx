'use client'

import { Box, Card, Text } from '@radix-ui/themes';
import BackgroundSvg from '@/public/background'
import { useEffect } from 'react';

export default function SIgnOut() {
    useEffect(() => {
        // Clear the session cookie
        document.cookie = 'userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        // Redirect to the login page after a short delay
        setTimeout(() => {
            window.location.href = '/signin'
        }, 2000) // Redirect after 2 seconds
    }, [])

    return (
        <>
            <Box className="-z-50 w-full h-full">
                <BackgroundSvg className="absolute inset-0 w-full h-full" />
            </Box>
            <div className='absolute inset-0 z-10 flex items-center justify-center w-full h-full'>
                <Card className='w-96 p-8 shadow-lg'>
                    <form>
                        <Text as="div" size="7" weight="bold">
                            Sesión cerrada
                        </Text>

                        <Text as="div" size="3" weight="regular" className='mt-4'>
                            La sesión se ha cerrado correctamente.
                        </Text>
                    </form>
                </Card>
            </div>
        </>
    )
}