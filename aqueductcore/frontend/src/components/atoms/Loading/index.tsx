import { LinearProgress } from "@mui/material";
import { styled } from "@mui/system";

const Container = styled("div")`
  width: calc(100% + 48px);
  left: -24px;
  top: -124px;
  position: relative;
`;
export const Loading = () => {
  return (
    <Container>
      <LinearProgress color="primary" />
    </Container>
  );
};
