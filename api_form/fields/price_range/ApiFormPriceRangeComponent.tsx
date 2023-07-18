/* eslint-disable react-hooks/exhaustive-deps */
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { Currency } from "../../../redux/api_resources/types"
import ApiFormContext from "../../ApiFormContext";
import { ApiFormPriceRange } from "./ApiFormPriceRange";
// currency
import currency from "currency.js";

type PriceRanges = {
  "80th": number;
  min: number;
  max: number;
};

export default function ApiFormPriceRangeComponent({
  name,
  label,
  currencyUsed,
}: {
  name: string;
  label: string;
  currencyUsed: Currency;
}) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormPriceRange | undefined;
  const [cleanedData, setCleanedData] = useState([0, 0]);
  const [priceRanges, setPriceRanges] = useState<PriceRanges>({
    "80th": 0,
    min: 0,
    max: 0,
  });

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  useEffect(() => {
    if (
      typeof field.cleanedData !== "undefined" &&
      context.currentResult !== null &&
      context.currentResult.price_ranges !== null &&
      JSON.stringify(context.currentResult.price_ranges) !==
        JSON.stringify(priceRanges)
    ) {
      const price_ranges = context.currentResult.price_ranges[name];
      if (
        price_ranges.min < priceRanges.min ||
        price_ranges.max > priceRanges.max
      ) {
        setPriceRanges(price_ranges);
      }
    }
  }, [context.currentResult]);

  useEffect(() => {
    if (typeof field.cleanedData !== "undefined" && priceRanges["80th"] !== 0) {
      const minNorm = normalizeValue(field.cleanedData[0], 0);
      const maxNorm = normalizeValue(field.cleanedData[1], 1000);
      setCleanedData([
        isNaN(minNorm) ? 0 : currency(minNorm, { precision: 0 }).intValue,
        isNaN(maxNorm) ? 1000 : currency(maxNorm, { precision: 0 }).intValue,
      ]);
    }
  }, [field.cleanedData, priceRanges["80th"]]);

  if (
    context.currentResult === null ||
    typeof field.cleanedData === "undefined"
  ) {
    return (
      <Stack direction="column">
        <Typography>{label}</Typography>
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
        </div>
      </Stack>
    );
  }

  const normalizeValue = (
    denormalizedValue: number | null,
    baseOption: number
  ) => {
    if (denormalizedValue === null) return baseOption;

    if (denormalizedValue <= priceRanges["80th"]) {
      return (
        (800 * (denormalizedValue - priceRanges.min)) /
        (priceRanges["80th"] - priceRanges.min)
      );
    } else {
      return (
        800 +
        (200 * (denormalizedValue - priceRanges["80th"])) /
          (priceRanges.max - priceRanges["80th"])
      );
    }
  };

  const denormalizeValue = (value: number) => {
    if (value <= 800) {
      return (
        Math.round(
          (priceRanges.min +
            (value / 800) * (priceRanges["80th"] - priceRanges.min)) *
            100
        ) / 100
      );
    } else {
      return (
        Math.round(
          (priceRanges["80th"] +
            ((value - 800) / 200) * (priceRanges.max - priceRanges["80th"])) *
            100
        ) / 100
      );
    }
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    setCleanedData(newValue as number[]);
  };

  const handleChangeSubmit = (
    _event: Event | SyntheticEvent<Element, Event>,
    _newValue: number | number[]
  ) => {
    if (
      cleanedData[0] === normalizeValue(field.cleanedData![0], 0) &&
      cleanedData[1] === normalizeValue(field.cleanedData![1], 1000)
    )
      return;

    let minValue: string[] = [];
    let maxValue: string[] = [];
    if (cleanedData[0] !== 0) {
      minValue = [denormalizeValue(cleanedData[0]).toString()];
    }
    if (cleanedData[1] !== 1000) {
      maxValue = [denormalizeValue(cleanedData[1]).toString()];
    }
    context.updateUrl({
      [`${name}_start`]: minValue,
      [`${name}_end`]: maxValue,
    });
  };

  const valueLabelFormat = (value: number) => {
    return currency(denormalizeValue(value), { precision: 0 })
      .multiply(currencyUsed.exchange_rate)
      .format();
  };

  return (
    <Stack direction="column">
      <Typography>{label}</Typography>
      <Box sx={{ width: "90%", alignSelf: "center" }}>
        <Slider
          value={cleanedData}
          min={0}
          max={1000}
          valueLabelDisplay={"auto"}
          onChange={handleChange}
          onChangeCommitted={handleChangeSubmit}
          valueLabelFormat={valueLabelFormat}
          disableSwap
        />
      </Box>
    </Stack>
  );
}
