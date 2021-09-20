import styles from "./App.module.scss";

import {
  Container,
  Button,
  ButtonGroup,
  Box,
  Input,
  Checkbox,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Grid,
  GridItem,
  useBoolean,
  Divider,
  Link,
  useColorMode
} from "@chakra-ui/react";
import DynamicLink from "next/link";

const App = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  console.log(colorMode);
  
  return (
    <div className={styles.root}>
      <Container>
        <Heading size="md" py="4">Deep Time Exploration Tools</Heading>
        <DynamicLink href={"/starmap"} passHref><Link>Star Map &rarr;</Link></DynamicLink>

      </Container>
    </div>
  );
};

export default App;
