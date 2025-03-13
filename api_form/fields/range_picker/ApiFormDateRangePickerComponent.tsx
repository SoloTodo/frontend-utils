import { useContext } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormDateRangePicker } from "./ApiFormDateRangePicker";
import {Stack, TextField, TextFieldProps} from "@mui/material";
import { isValid, set } from "date-fns";

export default function ApiFormDateRangePickerComponent({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormDateRangePicker | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const cleanedData =
    typeof field.cleanedData !== "undefined" ? field.cleanedData : [null, null];

  const handleChange = (newValue: Date | null, position: number) => {
    if (newValue !== null && isValid(newValue)) {
      newValue = set(newValue, { hours: 0, minutes: 0, seconds: 0 });
      if (position === 0) {
        context.updateUrl({ [`${name}_after`]: [newValue.toISOString()] });
      } else if (position === 1) {
        context.updateUrl({ [`${name}_before`]: [newValue.toISOString()] });
      }
    } else {
      if (position === 0) {
        context.updateUrl({ [`${name}_after`]: [] });
      } else {
        context.updateUrl({ [`${name}_before`]: [] });
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={1} direction="row">
        <DatePicker
          label={`${label} desde`}
          value={cleanedData[0]}
          maxDate={cleanedData[1] || new Date()}
          // inputFormat="dd/MM/yyyy"
          onChange={(newValue: Date | null) => handleChange(newValue, 0)}
          // renderInput={(params: TextFieldProps) => <TextField {...params} />}
        />
        <DatePicker
          label="hasta"
          value={cleanedData[1]}
          minDate={cleanedData[0] || undefined}
          maxDate={new Date()}
          // inputFormat="dd/MM/yyyy"
          onChange={(newValue: Date | null) => handleChange(newValue, 1)}
          // renderInput={(params: TextFieldProps) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
