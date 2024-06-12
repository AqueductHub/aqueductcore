import { Typography, styled } from "@mui/material";

export const FieldTitle = styled(Typography)`
    font-size: 1rem;
    font-weight: bold;
    display: inline;
    margin-right: ${(props) => props.theme.spacing(0.5)};
`;

export const RequiredFieldIndicator = styled(Typography)`
    font-size: 0.3;
    font-weight: bold;
    display: inline;
    color: red;
    margin-right: ${(props) => props.theme.spacing(1)};
`;

export const FieldType = styled(Typography)`
    font-size: 0.8rem;
    display: inline;
    font-family: monospace;
    color: ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.grey[600]};
`;

export const FieldDescription = styled(Typography)`
  font-size: 0.8rem;
  font-style: italic;
  border-left: 1px solid ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.grey[600]};
  color: #555;
  height: 100%;
`;

export const InputFieldHint = styled(Typography)`
  font-size: 0.8rem;
  font-family: monospace;
`;
