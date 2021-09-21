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
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import DynamicLink from "next/link";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className={styles.root}>
      <Container>
        <Heading size="md" py="4">
          Deep Time Exploration Tools
        </Heading>
        <Text>
          <DynamicLink href={"/starmap"} passHref>
            <Link>Star Map &rarr;</Link>
          </DynamicLink>
        </Text>
        <Divider my="4" />
        <IconButton
          aria-label="Toggle dark mode"
          onClick={toggleColorMode}
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        />
      </Container>
    </div>
  );
};

export default App;
