import styles from "./StarMap.module.scss";

import {
  ChakraProvider,
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
} from "@chakra-ui/react";

const App = () => {
  return (
    <ChakraProvider>
      <div className={styles.root}>
        <div className={styles.stage}>
          {/* <CanvasForceDots
            data={data}
            pattern={pattern}
            drawLinks={drawLinks}
            forces={forces}
            linkStrength={linkStrength}
            percentWidth={80}
          /> */}
        </div>
        <div className={styles.controls}>Hello</div>
      </div>
    </ChakraProvider>
  );
};

export default App;
