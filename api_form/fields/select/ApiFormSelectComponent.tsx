import React, { useContext } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormSelect, ApiFormSelectChoice } from "./ApiFormSelect";

type ApiFormSelectComponentProps = {
  name: string;
  label: string;
  exact?: boolean;
  selectOnly?: boolean;
};

type DocCount = {
  id: string | number;
  doc_count: number;
};

export const choicesYesNo = [
  { label: "Si", value: 1 },
  { label: "No", value: 0 },
];

export default function ApiFormSelectComponent(
  props: ApiFormSelectComponentProps
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const context = useContext(ApiFormContext);
  const field = context.getField(props.name) as ApiFormSelect | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${props.name}`;
  }

  const handleChange = (
    selected: ApiFormSelectChoice | ApiFormSelectChoice[] | null
  ) => {
    let name = props.name;
    if (name.endsWith("_min")) name = name.replace("_min", "_start");
    if (name.endsWith("_max")) name = name.replace("_max", "_end");

    if (selected === null) {
      context.updateUrl({ [name]: [] });
      return;
    }

    if ("length" in selected) {
      const newValues = selected.map((option) => option.value.toString());
      context.updateUrl({ [name]: newValues });
    } else {
      context.updateUrl({ [name]: [selected.value.toString()] });
    }
  };

  let cleanedData:
    | ApiFormSelectChoice
    | ApiFormSelectChoice[]
    | null
    | undefined = field.cleanedData;
  if (
    typeof field.cleanedData === "undefined" ||
    field.cleanedData.length === 0
  ) {
    if (field.multiple) {
      cleanedData = [];
    } else {
      cleanedData = null;
    }
  } else if (!field.multiple) {
    cleanedData = field.cleanedData[0];
  }

  let choices = field.choices;
  let strictName = field.name.replace("_min", "").replace("_max", "");
  if (
    context.currentResult !== null &&
    typeof context.currentResult.aggs !== "undefined" &&
    typeof context.currentResult.aggs[strictName] !== "undefined"
  ) {
    let docCountTotal = context.currentResult.aggs[strictName].reduce(
      (acc: number, a: DocCount) => (acc += a.doc_count),
      0
    );
    let docCountZero = 0;
    choices = field.choices.reduce(
      (acc: { value: string | number; label: string }[], a) => {
        const choiceWithDoc = context.currentResult.aggs[strictName].filter(
          (c: DocCount) => c.id === a.value
        );
        if (choiceWithDoc.length > 0) {
          acc.push({
            value: a.value,
            label: `${a.label} (${
              props.exact
                ? choiceWithDoc[0].doc_count
                : field.name.includes("_min")
                ? docCountTotal
                : docCountZero
            })`,
          });
          docCountTotal -= choiceWithDoc[0].doc_count;
          docCountZero += choiceWithDoc[0].doc_count;
        }
        return acc;
      },
      []
    );
    if (
      cleanedData !== null &&
      typeof cleanedData !== "undefined" &&
      choices.length !== 0
    ) {
      if (Array.isArray(cleanedData)) {
        cleanedData = cleanedData.reduce((acc: ApiFormSelectChoice[], c) => {
          const ch = choices.filter((choice) => c.value === choice.value);
          if (ch.length !== 0)
            acc.push({
              value: c.value,
              label: ch[0].label,
            });
          return acc;
        }, []);
      } else {
        const actualValue = cleanedData.value;
        const ch = choices.filter((choice) => actualValue === choice.value);
        if (ch.length !== 0) {
          cleanedData = {
            value: actualValue,
            label: ch[0].label,
          };
        } else {
          cleanedData = null;
        }
      }
    }
  }

  const isOptionEqualToValue = (
    option: ApiFormSelectChoice,
    value: ApiFormSelectChoice
  ) => {
    return option.value === value.value;
  };

  const handleChangeSelect = (
    selected: string | number | (string | number)[]
  ) => {
    if (typeof selected === "string" || typeof selected === "number") {
      const selectedChoices = choices.filter((c) => c.value === selected);
      handleChange(selectedChoices);
    } else {
      const selectedChoices = choices.filter((c) => selected.includes(c.value));
      handleChange(selectedChoices);
    }
  };

  return isMobile || props.selectOnly ? (
    <FormControl fullWidth>
      <InputLabel id="multiple-name-label">{props.label}</InputLabel>
      <Select
        labelId="multiple-name-label"
        id="multiple-name"
        multiple={field.multiple}
        required={field.required}
        label={props.label}
        value={
          typeof cleanedData === "undefined" || cleanedData === null
            ? ""
            : "length" in cleanedData
            ? cleanedData.map((c) => c.value)
            : cleanedData.value
        }
        renderValue={(selected) =>
          typeof selected !== "string" && typeof selected !== "number" ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((s) => (
                <Chip
                  key={s}
                  label={choices.filter((c) => c.value === s)[0].label}
                />
              ))}
            </Box>
          ) : (
            choices.find((c) => c.value === selected)?.label
          )
        }
        onChange={(evt) => handleChangeSelect(evt.target.value)}
      >
        {choices.map((c) => (
          <MenuItem key={c.value} value={c.value}>
            {c.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <Autocomplete<ApiFormSelectChoice, boolean, boolean>
      multiple={field.multiple}
      options={choices}
      renderInput={(params) => <TextField {...params} label={props.label} />}
      renderOption={(props, option) => (
        <li {...props} key={option.value}>
          {option.label}
        </li>
      )}
      filterSelectedOptions
      onChange={(_evt, newValues) => handleChange(newValues)}
      value={cleanedData}
      disableClearable={field.required}
      loading={context.isLoading}
      isOptionEqualToValue={isOptionEqualToValue}
    />
  );
}
