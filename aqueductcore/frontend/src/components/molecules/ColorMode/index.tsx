import { styled, ToggleButton, ToggleButtonGroup, useColorScheme } from "@mui/material";
import Box from "@mui/material/Box";

import { ThemeModeTypes } from "types/componentTypes";

const Container = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.palette.text.primary};
  border-radius: ${(props) => props.theme.spacing(1)};
  padding: ${(props) => props.theme.spacing(3)};
`;

function ColorMode() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event: React.MouseEvent<HTMLElement>, newMode: ThemeModeTypes) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <Container>
      <ToggleButtonGroup
        color="primary"
        value={mode}
        exclusive
        onChange={handleChange}
        aria-label="theme-select"
      >
        <ToggleButton value="light">Light</ToggleButton>
        <ToggleButton value="dark">Dark</ToggleButton>
      </ToggleButtonGroup>
    </Container>
  );
}

export default ColorMode;
