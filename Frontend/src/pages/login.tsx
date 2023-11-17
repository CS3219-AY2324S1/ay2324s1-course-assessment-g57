/* eslint-disable react/no-children-prop */
// Do not claim the design as my own
// Taken from https://codesandbox.io/s/chakra-ui-login-page-ncc3q
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
    Flex,
    Heading,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    chakra,
    Box,
    Link,
    Avatar,
    FormControl,
    InputRightElement,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { push } = useRouter();

    const handleShowClick = () => setShowPassword(!showPassword);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        try {
            // Replace the URL and body with your actual authentication endpoint and payload
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 401) {
                toast.error('Invalid username or password');
                return;
            }
            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);

                // For demonstration purposes, store the token in local storage
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('username', username);

                // Redirect to the dashboard after successful login
                push('/dashboard');
            } else {
                console.error('Login failed');
                // You might want to handle login failure, e.g., show an error message
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            backgroundColor="gray.200"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                flexDir="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
            >
                <Avatar bg="teal.500" />
                <Heading color="teal.400">Welcome</Heading>
                <Box minW={{ base: '90%', md: '468px' }}>
                    <form onSubmit={handleLogin} method="post">
                        <Stack
                            spacing={4}
                            p="1rem"
                            backgroundColor="whiteAlpha.900"
                            boxShadow="md"
                        >
                            <FormControl isRequired>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={
                                            <CFaUserAlt color="gray.300" />
                                        }
                                    />
                                    <Input
                                        name="username"
                                        type="text"
                                        placeholder="username"
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl isRequired>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        color="gray.300"
                                        children={<CFaLock color="gray.300" />}
                                    />
                                    <Input
                                        name="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="Password"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button
                                            h="1.75rem"
                                            size="sm"
                                            onClick={handleShowClick}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Button
                                borderRadius={0}
                                type="submit"
                                variant="solid"
                                colorScheme="teal"
                                width="full"
                            >
                                Login
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
            <Box>
                New to us?{' '}
                <Link color="teal.500" href="/register">
                    Sign Up
                </Link>
            </Box>
        </Flex>
    );
};

export default Login;
