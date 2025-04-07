'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Card, Text } from '@radix-ui/themes';
import BackgroundSvg from '@/public/background'
import { EnterIcon } from '@radix-ui/react-icons';

import { login } from '@/lib/db';

export default function SignIn() {
    const router = useRouter();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const email = formData.get('username')
        const password = formData.get('password')

        const res = (await login(email as string, password as string))[0];
        console.log('Response:', res)
        if (res) {
            console.log('Login successful')

            // set a cookie with the session ID
            const userID = res.id
            const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
            document.cookie = `userID=${userID}; path=/; expires=${expires.toUTCString()}`

            router.push('/')
        } else {
            console.error('Login failed')
        }
    }

    return (
        <>
            <Box className="-z-50 w-full h-full">
                <BackgroundSvg className="absolute inset-0 w-full h-full" />
            </Box>
            <div className='absolute inset-0 z-10 flex items-center justify-center w-full h-full'>
                <Card className='w-96 p-8 shadow-lg'>
                    <form onSubmit={handleSubmit}>
                        <Text as="div" size="7" weight="bold">
                            Iniciar sesión
                        </Text>

                        <div className='flex flex-col gap-4 mt-4'>
                            <div className='flex flex-col gap-1'>
                                <Text as="label" size="3" weight="regular" htmlFor="email">
                                    Nombre de Usuario
                                </Text>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    required
                                    aria-label='username'
                                    className='p-2 border-[1px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Text as="label" size="3" weight="regular" htmlFor="password">
                                    Contraseña
                                </Text>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    required
                                    aria-label='password'
                                    className='p-2 border-[1px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>

                            <Button>
                                <EnterIcon /> Bookmark
                            </Button>

                        </div>
                    </form>
                </Card>
            </div>
        </>
    )
}