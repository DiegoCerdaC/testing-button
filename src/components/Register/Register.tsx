import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Container,
  Image,
  Switch,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import React from "react";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState({
    email: "",
    password: "",
    confirm_password: "",
    name: "",
    tempUsername: "",
    isMerchant: false,
  });

  const signUp = async () => {
    const signUpWithEmailUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;

    const signUpResponse = await axios({
      method: "POST",
      url: signUpWithEmailUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      data: {
        email: state.email,
        password: state.password,
        returnSecureToken: true,
      },
    });

    console.log(signUpResponse.data);

    const createUserEndpoint = `${process.env.REACT_APP_SERVER_ENDPOINT}/user/createUserCollection`;
    await axios({
      url: createUserEndpoint,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        uid: signUpResponse.data.localId,
        name: state.name,
        tempUsername: state.tempUsername,
        email: state.email,
        isMerchant: state.isMerchant,
      },
    });
  };

  const onChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container
      maxW="lg"
      height={"2xl"}
      py={{ base: "0", md: "8" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack align={"center"}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          <Box display={"flex"} justifyContent="center">
            {/* <Image src={Logo} width={100} /> */}
          </Box>
          <Text my={2}>Sign up</Text>
        </Heading>
      </Stack>
      <Box
        py={{
          base: "0",
          sm: "8",
        }}
        px={{
          base: "4",
          sm: "10",
        }}
        bg={{
          base: "transparent",
          sm: "bg-surface",
        }}
        boxShadow={{
          base: "none",
          sm: "md",
        }}
        borderRadius={{
          base: "none",
          sm: "xl",
        }}
      >
        <Stack>
          <HStack>
            <Box>
              <FormControl id="firstName" isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input type="text" name="name" onChange={onChange} />
              </FormControl>
            </Box>
            <Box>
              <FormControl id="lastName" isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" name="tempUsername" onChange={onChange} />
              </FormControl>
            </Box>
          </HStack>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" name="email" onChange={onChange} />
          </FormControl>
          <FormControl id="register_password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                name={"password"}
                onChange={onChange}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="confirm_password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showPass ? "text" : "password"}
                name={"confirm_password"}
                onChange={onChange}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() => setShowPass((showPass) => !showPass)}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent={"flex-end"} alignItems={"center"} mt={3}>
              <Text mr={3}>Merchant Account</Text>
              <Switch
                id="Merchant Account"
                onChange={() =>
                  setState({ ...state, isMerchant: !state.isMerchant })
                }
              />
            </Flex>
          </FormControl>
          <Stack spacing={10} pt={2}>
            <Button
              loadingText="Submitting"
              size="lg"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={signUp}
            >
              Sign up
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
