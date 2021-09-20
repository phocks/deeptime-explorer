import * as d3force from "d3-force";

const d3 = {
  ...d3force,
};

export const applyForce = ({
  simulation,
  force,
}: {
  simulation: any;
  force: string;
}) => {};

export const removeForce = ({
  simulation,
  force,
}: {
  simulation: any;
  force: string;
}) => {
  simulation.force(force, null);
  simulation.force(`${force}X`, null);
  simulation.force(`${force}Y`, null);
};

// Returns a D3 force for a given name.
export const getForce = ({ forceName, links = [], linkStrength }) => {
  switch (forceName) {
    case "collide":
      return d3.forceCollide((d) => d.radius + 1);
    case "time-link":
      return d3
        .forceLink(links)
        .id((d) => d.id)
        .strength(linkStrength)
        .distance(1);
  }
};
