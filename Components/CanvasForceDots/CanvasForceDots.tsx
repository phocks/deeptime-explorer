import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useWindowSize } from "@react-hook/window-size";
import * as topojson from "topojson-client";
import {
  randomIntFromInterval,
  randomFloatFromInterval,
  getSpiralPositions,
  debounce,
  sleep,
} from "./helpers";
import Immutable from "immutable";

import * as d3selection from "d3-selection";
import * as d3force from "d3-force";
import * as d3scale from "d3-scale";
import * as d3geo from "d3-geo";
import * as d3zoom from "d3-zoom";

// For D3 it's easier to use require
const d3 = {
  ...d3selection,
  ...d3force,
  ...d3scale,
  ...d3geo,
  ...d3zoom,
};

import { getForce } from "./forceActions";
import { usePrevious } from "./helpers";

// Component styles
import styles from "./styles.module.scss";

// Import map of Australia data
import australiaTopo from "./australia.topo.json";
let focusPoint = [133.15399233370441, -24.656909465155994];
const geoMargin = 100;

const objects = Object.values(australiaTopo.objects); // Get array of objects so we don't need the name
const ausGeoJson = topojson.merge(
  australiaTopo,
  australiaTopo.objects.states.geometries
); // Megrge all the states (as boundaries don't exist... yet)

// Used to rotate the projection
const invertLongLat = (longlat) => {
  return [-longlat[0], -longlat[1]];
};

// Return nodes that have latitude and longitude
// in .mapped
const getNodesWithLatLong = (nodes: any[]) => {
  return nodes.filter((node) => {
    if (node.mapped?.latLong) return true;
    else return false;
  });
};

const splitLatLong = (coordinateString: string) => {
  const [lat, long] = coordinateString.split(",");
  return [parseFloat(lat), parseFloat(long)];
};

// Type checking
type CanvasForceDotsProps = {
  data: any[] | undefined;
  color?: string;
  minDotRadius?: number;
  maxDotRadius?: number;
  defaultDotRadius?: number;
  alphaDecay?: number;
  alphaMin?: number;
  pattern?: string;
  forces?: Immutable.Set<string>;
  children?: React.ReactNode;
  alphaTarget?: number;
  velocityDecay?: number;
  drawLinks?: boolean;
  linkStrength?: number;
  percentWidth?: number;
};

// The function component
const CanvasForceDots = ({
  // Default values for props
  data,
  color = "white",
  minDotRadius = 2,
  maxDotRadius = 3.6,
  defaultDotRadius = 3,
  alphaDecay = 0.02, // D3 default = 0.0228
  velocityDecay = 0.4, // D3 default = 0.4
  alphaTarget = 0.0, // D3 default 0
  alphaMin = 0.001, // D3 default 0.001
  pattern = "default",
  forces = Immutable.Set(),
  drawLinks = false,
  linkStrength = 0.001,
  percentWidth = 100,
  ...props
}: CanvasForceDotsProps) => {
  // DOM references (must use null for some reason)
  const canvasEl = useRef(null);

  // Set up component ref to store data that doesn't change on render
  // It's an object, you can store stuff in.
  const componentRef = useRef({});
  const { current: my }: { current: any } = componentRef;

  // Instance vars that set to component ref on re-render
  // so they *retain* their value in Component Effects
  // Note: Still not sure if this is the best way
  let canvas = my.canvas;
  let simulation = my.simulation;
  let nodes = my.nodes;
  let links = my.links;
  let context = my.context;
  let debouncedRemoveCenter = my.debouncedRemoveCenter;
  let timeScaleX = my.timeScaleX;
  let projection = my.projection;
  let pathGenerator = my.pathGenerator;

  // A collection of positions
  const positionRef = useRef({});
  const { current: positions }: { current: any } = positionRef;

  const [windowWidth, windowHeight] = useWindowSize();
  const canvasWidth = (windowWidth * percentWidth) / 100;

  // Previous value of props.forces
  const prevForces: any = usePrevious(forces);

  // Dot size scale
  // Story length for now
  const dotScale = d3
    .scaleLinear()
    .domain([0, 900])
    .range([minDotRadius, maxDotRadius]);

  const updateForces = () => {
    // Don't forget to remove tick listener
    // and set it again, or else the new nodes won't be added
    // due to closures or whatever
    resetRender();

    // Loops through each force and applies
    forces.forEach((forceName: string) => {
      simulation.force(forceName, getForce({ forceName, links, linkStrength }));
    });

    // If previous force not there any more, remove them
    prevForces?.forEach((force: string) => {
      if (!forces.includes(force)) {
        simulation.force(force, null);
      }
    });

    // Custom patterns
    // TODO: Move these into separate forces that can be added
    // and remove at will
    switch (pattern) {
      case "default":
        simulation
          .force(
            "x",
            d3.forceX((d, i) => {
              // Loops back around if more nodes than positions
              const loopIndex = i % positions[pattern].length;
              return positions[pattern][loopIndex]?.x;
            })
          )
          .force(
            "y",
            d3.forceY((d, i) => {
              // Loops back around if more nodes than positions
              const loopIndex = i % positions[pattern].length;
              return positions[pattern][loopIndex]?.y;
            })
          );
        break;
      case "spiral":
        positions.spiral = getSpiralPositions({
          n: nodes.length,
          centerX: canvasWidth / 2,
          centerY: windowHeight / 2,
        });

        simulation
          .force(
            "x",
            d3.forceX((d, i) => {
              // Loops back around if more nodes than positions
              const loopIndex = i % positions.spiral.length;
              return positions.spiral[loopIndex]?.x;
            })
            // .strength(0.06)
          )
          .force(
            "y",
            d3.forceY((d, i) => {
              // Loops back around if more nodes than positions
              const loopIndex = i % positions.spiral.length;
              return positions.spiral[loopIndex]?.y;
            })
            // .strength(0.06)
          );
        break;
      case "timeline":
        simulation.force(
          "x",
          d3.forceX((d, i) => {
            if (!d.mapped.yearsAgo) {
              return mapDefaultPos({ positions, i, axis: "x" });
            }
            return timeScaleX(d.mapped.yearsAgo);
          })
        );

        simulation.force(
          "y",
          d3.forceY((d, i) => {
            // No years ago, map to random
            if (!d.mapped.yearsAgo) {
              return mapDefaultPos({ positions, i, axis: "y" });
            }

            return windowHeight / 2;
          })
        );
        break;
      case "geographic":
        simulation.force(
          "x",
          d3.forceX((d, i) => {
            if (d.mapped.latLong) {
              const [lat, long] = splitLatLong(d.mapped.latLong);
              return projection([long, lat])[0];
            } else {
              return mapDefaultPos({ positions, i, axis: "x" });
            }
          })
        );

        simulation.force(
          "y",
          d3.forceY((d, i) => {
            if (d.mapped.latLong) {
              const [lat, long] = splitLatLong(d.mapped.latLong);
              return projection([long, lat])[1];
            } else {
              return mapDefaultPos({ positions, i, axis: "y" });
            }
          })
        );
    }

    simulation.alpha(1.0).restart();
  };

  // Clears canvas and draws each animation frame
  const renderFrame = () => {
    // Use canvas reference instead of any state due to React
    // not updating in callbacks etc.
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paths (namely: Australia)
    if (pattern === "geographic") {
      context.beginPath();
      pathGenerator(ausGeoJson);
      context.lineWidth = 1;
      context.strokeStyle = "#333";
      context.stroke();
    }

    // Draw links
    context.beginPath();
    if (forces.find((forceName) => forceName === "time-link"))
      links.forEach(drawLink);
    context.strokeStyle = "#555";
    context.stroke();

    // Loop through nodes and draw them
    for (const node of nodes) {
      context.beginPath();
      drawNode(node);
      context.fillStyle = color;
      context.fill();
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {
      context.moveTo(d.x + d.radius, d.y);
      context.arc(d.x, d.y, d.radius || defaultDotRadius, 0, 2 * Math.PI);
    }
  };

  function getRandomPositions(amount: number) {
    let positions: any[] = [];
    for (let i = 0; i < amount; i++) {
      positions.push({
        x: randomIntFromInterval(0, canvasWidth),
        y: randomIntFromInterval(0, windowHeight),
        radius: randomIntFromInterval(minDotRadius, maxDotRadius),
      });
    }
    return positions;
  }

  // Reset the render function otherwise it doesn't
  // track new nodes
  function resetRender() {
    simulation.on("tick", null);
    simulation.on("tick", renderFrame);
  }

  // onMount
  useEffect(() => {
    nodes = my.nodes = [];
    links = my.links = [];

    // Generate a default random position list
    positions.default = getRandomPositions(500);

    simulation = my.simulation = d3
      .forceSimulation()
      .alphaDecay(alphaDecay)
      .alphaTarget(alphaTarget)
      .alphaMin(alphaMin)
      .velocityDecay(velocityDecay);

    canvas = my.canvas = canvasEl.current;

    // Set up high DPI (retina) screens
    context = my.context = canvas?.getContext("2d");

    d3.select(context.canvas).call(
      d3
        .zoom()
        .scaleExtent([1, 8])
        .on("zoom", ({ transform }) => zoomed(transform))
    );

    function zoomed(transform) {
      context.save();
      context.clearRect(0, 0, canvasWidth, windowHeight);
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);
      renderFrame();

      context.restore();
    }

    // Note: Event listeners don't get state updates properly
    simulation.on("tick", renderFrame);
    simulation.stop(); // Restart later

    // Function to remove center force
    function removeCenter() {
      console.log("removing center force");
      simulation.force("center", null);
    }

    // Set debounced function for removing center force
    debouncedRemoveCenter = my.debouncedRemoveCenter = debounce(
      removeCenter,
      250
    );

    projection = my.projection = d3
      .geoOrthographic()
      .rotate(invertLongLat(focusPoint))
      .fitExtent(
        // Auto zoom
        [
          [geoMargin, geoMargin],
          [canvasWidth - geoMargin, windowHeight - geoMargin],
        ],
        ausGeoJson
      );

    pathGenerator = my.pathGenerator = d3
      .geoPath()
      .projection(projection)
      .context(context);

    return () => {
      simulation.stop();
    };
  }, []);

  // Width & height onResize effect
  // (Note: Also fires on mount so use to set up forces etc.)
  useEffect(() => {
    console.log("Width:", canvasWidth, "Height:", windowHeight);

    // Make work on HighDPI aka RETINA screens
    const pixelRatio = window.devicePixelRatio || 1;

    timeScaleX = my.timeScaleX = d3
      .scaleLinear()
      .domain([-10000, 80000])
      .range([0, canvasWidth]);

    // Centre all the things
    // simulation.force("center", d3.forceCenter(width / 2, height / 2));
    // debouncedRemoveCenter();

    canvas.width = canvasWidth * pixelRatio;
    canvas.height = windowHeight * pixelRatio;

    // Context scaling must done after canvas is resised
    context.scale(pixelRatio, pixelRatio);

    updateForces();
  }, [windowWidth, windowHeight]);

  // On data
  useEffect(() => {
    if (!data || data.length < 1) return;

    // Are there any new nodes?
    const newNodes = data.filter((d) => {
      const idToFind = d.id;

      const found = nodes.find((node) => node.id === idToFind);

      if (found) return false;
      else return true;
    });

    // Initialise the nodes
    const nodesToPush = newNodes.map((d) => {
      return {
        ...d,
        x: randomIntFromInterval(0, canvasWidth),
        y: randomIntFromInterval(0, windowHeight),
        radius: dotScale(d.mapped.story?.length || 0), //randomIntFromInterval(minDotRadius, maxDotRadius)
      };
    });

    // Push new nodes
    // nodes.push(...nodesToPush);

    const nodePush = async () => {
      for (const node of nodesToPush) {
        nodes.push(node);
        simulation.nodes(nodes);
        await new Promise((r) => setTimeout(r, 1));
      }
    };

    nodePush();

    // Calculate links
    const linkData = data.filter((d) => {
      return d.mapped.yearsAgo;
    });

    // Sort links by time
    const linkDataSorted = linkData.sort((a, b) => {
      return a.mapped.yearsAgo < b.mapped.yearsAgo ? -1 : 1;
    });

    links = my.links = linkDataSorted.map((d, i) => {
      // Detect final node
      if (i === linkDataSorted.length - 1)
        return { source: d.id, target: d.id };
      return { source: d.id, target: linkDataSorted[i + 1].id };
    });

    updateForces();
  }, [data]);

  useEffect(() => {
    updateForces();
  }, [pattern]);

  useEffect(() => {
    renderFrame();
  }, [drawLinks]);

  useEffect(() => {
    updateForces();
  }, [forces, linkStrength]);

  return (
    <div className={styles.root}>
      <canvas ref={canvasEl} className={styles.canvas}></canvas>
      {props.children}
    </div>
  );
};

export default CanvasForceDots;

// PURE FUNCTIONS!!!
function mapDefaultPos({ positions, i, axis }) {
  const loopIndex = i % positions.default.length;
  return positions.default[loopIndex][axis];
}
