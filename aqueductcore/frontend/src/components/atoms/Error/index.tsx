import { Alert, AlertTitle } from "@mui/material";

interface ErrorProps {
  message?: string;
}

export const Error = ({ message }: ErrorProps) => {
  return (
    <div>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {message ? message : "There is some problems with the system"}
      </Alert>
    </div>
  );
};
