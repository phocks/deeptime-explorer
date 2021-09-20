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

import CanvasForceDots from "../CanvasForceDots";
import mapData from "../../lib/dataMapper"

import localData from "./localData.json"
const mappedData = mapData(localData);
console.log(mappedData)


const App = () => {
  return (
    <ChakraProvider>
      <div className={styles.root}>
        <div className={styles.stage}>
          <CanvasForceDots
            data={mappedData}
            // pattern={}
            // drawLinks={drawLinks}
            // forces={forces}
            // linkStrength={linkStrength}
            percentWidth={80}
          />
        </div>
        <div className={styles.controls}>Hello</div>
      </div>
    </ChakraProvider>
  );
};

export default App;
