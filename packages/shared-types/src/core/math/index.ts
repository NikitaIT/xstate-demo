export function inRange(x: number, y: number) {
  return (z: number) => x <= z && z <= y;
}
