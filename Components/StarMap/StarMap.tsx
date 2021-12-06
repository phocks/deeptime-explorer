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

const patterns = ["default", "geographic", "spiral", "timeline", "random"];

const App = () => {
  const [pattern, setPattern] = useState<any>("default");
  const [forces, setForces] = useState(Set(["collide", "time-link"]));
  const [isZoomable, setIsZoomable] = useState(false);

  return (
    <ChakraProvider>
      <div className={styles.root}>
        <div className={styles.stage}>
          <CanvasForceDots
            data={mappedData}
            pattern={pattern}
            drawLinks={true}
            forces={forces}
            // linkStrength={linkStrength}
            percentWidth={80}
            isZoomable={isZoomable}
          />
        </div>
        <div className={styles.controls}>
          <Stack spacing={3}>
            <Button
              rounded={0}
              onClick={() => {
                setPattern((pattern) => getNextPattern(pattern, patterns));
              }}
            >
              Change pattern
            </Button>
            <FormControl display="flex" alignItems="center">
              <Switch
                id="zoom-toggle"
                spacing={6}
                checked={isZoomable}
                onChange={() => {
                  setIsZoomable((isZoomable) => !isZoomable);
                }}
              />
              <FormLabel htmlFor="zoom-toggle" mb="0" ml="3">
                Pan and zoom
              </FormLabel>
            </FormControl>
          </Stack>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default App;
