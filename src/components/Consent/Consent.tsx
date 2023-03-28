import {
    Box,
    Stack,
    Button,
    Heading,
    Text,
    Image,
    Checkbox,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import axios from "axios";
  import jwtDecode from "jwt-decode";
  import { useDispatch } from "react-redux";
  import { updateUserInfo } from "../../redux/slices/accountSlice";
  import { useNavigate } from "react-router-dom";
  import React from "react";
  
  export default function Consent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [state, setState] = useState({
      email: true,
      name: false,
      picture: false,
      birthdate: false,
    });
  
    const sendConsent = async () => {
      const uid = localStorage.getItem("user");
      const urlCreateCustomToken = `${process.env.REACT_APP_SERVER_ENDPOINT}/createToken`;
  
      const createCustomTokenResponse = await axios({
        url: urlCreateCustomToken,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          localId: uid,
          userConsent: state,
        },
      });
  
      console.log(createCustomTokenResponse.data);
  
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
      console.log("RESPONSE CUSTOM TOKEN LOGIN", signInCustomTokenResponse.data);
      dispatch(
        updateUserInfo({
          decodeIdToken,
          idToken: signInCustomTokenResponse.data.idToken,
        })
      );
  
      navigate("/user", { state: decodeIdToken });
    };
  
    return (
      <>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            <Box display={"flex"} justifyContent="center">
              {/* <Image src={Logo} width={100} /> */}
            </Box>
            <Text my={4} fontSize={24}>
              SphereOne would like to access your account.
            </Text>
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
            <Text>SphereOne is requesting the following permissions:</Text>
            <Box display={"flex"} flexDir={"column"}>
              <Checkbox my={2} isDisabled defaultChecked>
                View your email address.{" "}
              </Checkbox>
              <Checkbox
                onChange={() => setState({ ...state, name: !state.name })}
                my={2}
              >
                Process your personal details.
              </Checkbox>
              <Checkbox
                onChange={() => setState({ ...state, picture: !state.picture })}
                my={2}
              >
                View your profile picture.
              </Checkbox>
              <Checkbox
                onChange={() =>
                  setState({ ...state, birthdate: !state.birthdate })
                }
                my={2}
              >
                Birthdate
              </Checkbox>
            </Box>
  
            <Text>
              Before using this app, you are encouraged to review their privacy
              policy
            </Text>
  
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={sendConsent}
              >
                Allow
              </Button>
            </Stack>
          </Stack>
        </Box>
      </>
    );
  }
  