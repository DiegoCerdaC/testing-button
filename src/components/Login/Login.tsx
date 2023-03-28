import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Image,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../../redux/slices/accountSlice";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React from "react";

interface Props {
  nextStep: () => void;
}

const Login = ({ nextStep }: Props) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const onPress = async () => {
    try {
      const urlSignEmailPass = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;

      const signInEmailPassResponse = await axios({
        url: urlSignEmailPass,
        method: "POST",
        data: {
          email: state.email,
          password: state.password,
          returnSecureToken: true,
        },
      });

      console.log(signInEmailPassResponse);
      const localId = signInEmailPassResponse.data.localId;

      console.log("USER LOGGED IN WITH EMAIL + PASS");
      console.log("USER LOGIN RESPONSE", signInEmailPassResponse.data);

      const urlCreateCustomToken = `${process.env.REACT_APP_SERVER_ENDPOINT}/createToken`;

      const createCustomTokenResponse = await axios({
        url: urlCreateCustomToken,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          localId,
        },
      });
      console.log(createCustomTokenResponse.data);

      if (!createCustomTokenResponse.data.consent) {
        localStorage.setItem("user", localId);
        nextStep();
        return;
      }

      console.log("CUSTOM TOKEN WITH SCOPES CREATED FOR THIS USER");
      console.log("CUSTOM TOKEN:", createCustomTokenResponse.data.token);

      const urlSignInCustomToken = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;

      const signInCustomTokenResponse = await axios({
        url: urlSignInCustomToken,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          token: createCustomTokenResponse.data.token,
          returnSecureToken: true,
        },
      });

      const decodeIdToken = jwtDecode(signInCustomTokenResponse.data.idToken);
      console.log("USER LOGGED IN WITH CUSTOM TOKEN");
      console.log(
        "RESPONSE CUSTOM TOKEN LOGIN",
        signInCustomTokenResponse.data
      );
      dispatch(
        updateUserInfo({
          decodeIdToken,
          idToken: signInCustomTokenResponse.data.idToken,
        })
      );

      navigate("/user", { state: decodeIdToken });
    } catch (error: any) {
      console.log(error.message);
      return error;
    }
  };

  const onChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Stack spacing="8">
      <Stack spacing="6">
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            <Box display={"flex"} justifyContent="center">
              {/* <Image src={Logo} width={100} /> */}
            </Box>
            <Text mt={2}>Sign in</Text>
          </Heading>
        </Stack>
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
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="login_email"
                name="email"
                type="email"
                onChange={onChange}
              />
            </FormControl>
            <FormControl id="login_password">
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
          </Stack>
          <HStack justify="space-between">
            <Checkbox defaultChecked>Remember me</Checkbox>
            <Button variant="link" colorScheme="blue" size="sm">
              Forgot password?
            </Button>
          </HStack>
          <Stack spacing={10} pt={2}>
            <Button
              loadingText="Submitting"
              size="lg"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={onPress}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Login;
