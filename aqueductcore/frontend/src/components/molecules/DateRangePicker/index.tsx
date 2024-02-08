import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { styled } from "@mui/system";
import { Grid } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

const PickerContainer = styled(Grid)`
  margin-right: ${(props) => props.theme.spacing(2)};
`;

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  handleStartDateUpdate: (value: Dayjs | null) => void;
  handleEndDateUpdate: (value: Dayjs | null) => void;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  handleStartDateUpdate,
  handleEndDateUpdate,
}: DateRangePickerProps) => {
  return (
    <Grid container>
      {/* start data DatePicker*/}
      <PickerContainer item>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={startDate}
            maxDate={endDate ? endDate : dayjs()}
            format="DD/MM/YYYY"
            onChange={(value) => handleStartDateUpdate(value as Dayjs)}
            sx={{
              mt: { xs: 2, md: 0 },
              marginLeft: 0,
              width: 200,
            }}
            slotProps={{
              inputAdornment: {
                position: "start",
                sx: {
                  marginRight: 0.4,
                },
              },
              textField: {
                id: "start-date",
                placeholder: "Start Date",
                size: "small",
              },
              field: { clearable: true, onClear: () => handleStartDateUpdate(null) },
            }}
          />
        </LocalizationProvider>
      </PickerContainer>
      {/* end data DatePicker */}
      <PickerContainer item>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={endDate}
            minDate={startDate ? startDate : dayjs(0)}
            format="DD/MM/YYYY"
            maxDate={dayjs()}
            onChange={(value) => handleEndDateUpdate(value as Dayjs)}
            sx={{
              mt: { xs: 2, md: 0 },
              width: 200,
            }}
            slotProps={{
              inputAdornment: {
                position: "start",
                sx: {
                  marginRight: 0.4,
                },
              },
              textField: {
                placeholder: "End Date",
                size: "small",
              },
              field: { clearable: true, onClear: () => handleEndDateUpdate(null) },
            }}
          />
        </LocalizationProvider>
      </PickerContainer>
    </Grid>
  );
};
