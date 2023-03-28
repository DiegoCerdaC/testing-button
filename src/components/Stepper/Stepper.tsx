import { Container } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import React from "react";
import Consent from "../Consent";
import Login from "../Login";

const Stepper = () => {
  const { nextStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const login = <Login nextStep={nextStep} />;
  const consent = <Consent />;

  const steps = [
    { label: "Step Login", content: login },
    { label: "Step Consent", content: consent },
  ];

  return (
    <Container
      maxW="lg"
      height={"2xl"}
      py={{ base: "0", md: "8" }}
      px={{ base: "0", sm: "8" }}
    >
      <Steps activeStep={activeStep} orientation={"horizontal"}>
        {steps.map(({ label, content }, index) => (
          <Step key={label} icon={() => null} checkIcon={() => null}>
            {content}
          </Step>
        ))}
      </Steps>
    </Container>
  );
};

export default Stepper;
