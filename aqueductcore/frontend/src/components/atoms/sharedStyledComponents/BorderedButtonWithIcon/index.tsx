import { Button, styled } from "@mui/material";

export const BorderedButtonWithIcon = styled(Button)`
  border-color: ${(props) => props.theme.palette.neutral.main};
  color: ${(props) =>
        props.theme.palette.mode === "dark"
            ? props.theme.palette.common.white
            : props.theme.palette.common.black};
  text-transform: none;
  padding-left: ${(props) => `${props.theme.spacing}`};
  padding-right: ${(props) => `${props.theme.spacing}`};
`;
