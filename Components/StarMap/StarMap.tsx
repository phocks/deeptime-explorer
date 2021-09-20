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
import { useState, useEffect } from "react";
import { Set } from "immutable";

import CanvasForceDots from "../CanvasForceDots";
import mapData from "../../lib/dataMapper";

import localData from "./localData.json";
const mappedData = mapData(localData);

import { getNextPattern } from "./helpers";

const patterns = ["default", "geographic", "spiral", "timeline"];

const App = () => {
  const [pattern, setPattern] = useState<any>("default");
  const [forces, setForces] = useState(Set(["collide"]));

  return (
    <ChakraProvider>
      <div className={styles.root}>
        <div className={styles.stage}>
          <CanvasForceDots
            data={mappedData}
            pattern={pattern}
            // drawLinks={drawLinks}
            forces={forces}
            // linkStrength={linkStrength}
            percentWidth={80}
          />
        </div>
        <div className={styles.controls}>
          <Button
          rounded={0}
            onClick={() => {
              setPattern(getNextPattern(pattern, patterns));
            }}
          >
            Change pattern
          </Button>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default App;
