export const handleMovementKeys = (
  key: 'KeyQ' | 'KeyW' | 'KeyE' | 'KeyS',
  controls: any,
  playerMovementSpeed: number
) => {
  switch (key) {
    case 'KeyW':
      return controls.current.moveForward(playerMovementSpeed);
    case 'KeyS':
      return controls.current.moveForward(-playerMovementSpeed);
    case 'KeyQ':
      return controls.current.moveRight(-playerMovementSpeed);
    case 'KeyE':
      return controls.current.moveRight(playerMovementSpeed);
    default:
      return null;
  }
};
