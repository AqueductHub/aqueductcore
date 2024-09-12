import { LinearProgress } from "@mui/material";
import { styled } from "@mui/system";

const Container = styled("div")`
  width: calc(100% + 48px);
  left: -24px;
  top: -124px;
  position: relative;
`;
const ContainerGlobal = styled("div")`
  width: calc(100% + 24px);
  left: -24px;
  top: 0px;
  position: absolute;
`;
export const Loading = ({ isGlobal }: { isGlobal?: boolean }) => {
  if (isGlobal) return (
    <ContainerGlobal>
      <LinearProgress color="primary" />
    </ContainerGlobal>
  )
  return (
    <Container>
      <LinearProgress color="primary" />
    </Container>
  );
};
