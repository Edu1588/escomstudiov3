console.log("Finger groups definition:");
const fingerGroups = [
  {
    name: "thumb",
    baseX: -0.130, baseY: 0.680, baseZ: 0.010,
    parts: ["tripo_part_31", "tripo_part_34", "tripo_part_48", "tripo_part_30", "tripo_part_35"],
    curlAxis: { x: 0.12, y: 0.08, z: 0.15 },
    speed: 1.2, phase: 0.2
  },
  {
    name: "index",
    baseX: -0.155, baseY: 0.700, baseZ: 0.055,
    parts: ["tripo_part_27", "tripo_part_32", "tripo_part_15"],
    curlAxis: { x: 0.20, y: 0.05, z: -0.05 },
    speed: 1.1, phase: 0.0
  },
  {
    name: "middle",
    baseX: -0.127, baseY: 0.695, baseZ: 0.058,
    parts: ["tripo_part_45", "tripo_part_49", "tripo_part_40", "tripo_part_12"],
    curlAxis: { x: 0.22, y: 0.03, z: -0.02 },
    speed: 1.15, phase: 0.3
  },
  {
    name: "ring",
    baseX: -0.108, baseY: 0.695, baseZ: 0.055,
    parts: ["tripo_part_46", "tripo_part_37"],
    curlAxis: { x: 0.24, y: 0.0, z: 0.03 },
    speed: 1.2, phase: 0.5
  },
  {
    name: "pinky",
    baseX: -0.092, baseY: 0.710, baseZ: 0.048,
    parts: ["tripo_part_54", "tripo_part_43"],
    curlAxis: { x: 0.26, y: -0.03, z: 0.06 },
    speed: 1.25, phase: 0.7
  }
];

console.log(JSON.stringify(fingerGroups, null, 2));
