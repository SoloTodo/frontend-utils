import {
  ApiFormSelect,
  ApiFormSelectProps,
} from "./fields/select/ApiFormSelect";
import { FetchJsonInit } from "../network/utils";
import { fetchAuth } from "../nextjs/utils";
import {
  ApiFormPaginationProps,
  ApiFormPagination,
} from "./fields/pagination/ApiFormPagination";
import { ApiFormText, ApiFormTextProps } from "./fields/text/ApiFormText";
import {
  ApiFormSubmit,
  ApiFormSubmitProps,
} from "./fields/submit/ApiFormSubmit";
import {
  ApiFormRemoveListField,
  ApiFormRemoveListFieldProps,
} from "./fields/remove/ApiFormRemoveListField";
import {
  ApiFormDateRangePicker,
  ApiFormDateRangePickerProps,
} from "./fields/range_picker/ApiFormDateRangePicker";
import {
  ApiFormSlider,
  ApiFormSliderProps,
} from "./fields/slider/ApiFormSlider";
import {
  ApiFormPriceRange,
  ApiFormPriceRangeProps,
} from "./fields/price_range/ApiFormPriceRange";
import { ApiFormTree, ApiFormTreeProps } from "./fields/tree/ApiFormTree";
import { NextPageContext } from "next/types";

export type ApiFormFieldMetadata =
  | ApiFormSelectProps
  | ApiFormPaginationProps
  | ApiFormTextProps
  | ApiFormDateRangePickerProps
  | ApiFormSubmitProps
  | ApiFormRemoveListFieldProps
  | ApiFormSliderProps
  | ApiFormPriceRangeProps
  | ApiFormTreeProps;
export type ApiFormField =
  | ApiFormSelect
  | ApiFormPagination
  | ApiFormText
  | ApiFormDateRangePicker
  | ApiFormSubmit
  | ApiFormRemoveListField
  | ApiFormSlider
  | ApiFormPriceRange
  | ApiFormTree;

export class ApiForm {
  private fields: Record<string, ApiFormField> = {};
  private endpoint: URL;
  private fetchFunction: (input: string, init?: FetchJsonInit) => Promise<any>;

  constructor(
    fieldsMetadata: ApiFormFieldMetadata[],
    endpoint: string,
    initialData?: URLSearchParams
  ) {
    this.endpoint = new URL(endpoint);
    this.fetchFunction = (input: string, init?: FetchJsonInit) =>
      fetchAuth(null, input, init);

    for (const fieldMetadata of fieldsMetadata) {
      switch (fieldMetadata.fieldType) {
        case "select":
          this.fields[fieldMetadata.name] = new ApiFormSelect(
            fieldMetadata.name,
            fieldMetadata.choices,
            fieldMetadata.multiple,
            fieldMetadata.required,
            initialData
          );
          break;
        case "pagination":
          this.fields["pagination"] = new ApiFormPagination(initialData);
          break;
        case "text":
          this.fields[fieldMetadata.name] = new ApiFormText(
            fieldMetadata.name,
            initialData
          );
          break;
        case "date_range":
          this.fields[fieldMetadata.name] = new ApiFormDateRangePicker(
            fieldMetadata.name,
            fieldMetadata.required,
            initialData
          );
          break;
        case "submit":
          this.fields["submit"] = new ApiFormSubmit(initialData);
          break;
        case "remove":
          this.fields[fieldMetadata.name] = new ApiFormRemoveListField(
            fieldMetadata.name,
            initialData
          );
          break;
        case "slider":
          this.fields[fieldMetadata.name] = new ApiFormSlider(
            fieldMetadata.name,
            fieldMetadata.choices,
            fieldMetadata.step,
            fieldMetadata.unit,
            initialData
          );
          break;
        case "price_range":
          this.fields[fieldMetadata.name] = new ApiFormPriceRange(
            fieldMetadata.name,
            initialData
          );
          break;
        case "tree":
          this.fields[fieldMetadata.name] = new ApiFormTree(
            fieldMetadata.name,
            fieldMetadata.choices,
            fieldMetadata.multiple,
            fieldMetadata.required,
            initialData
          );
          break;
      }
    }
  }

  initialize(context?: NextPageContext) {
    this.fetchFunction = (input: string, init?: FetchJsonInit) =>
      fetchAuth(context, input, init);

    let currentUrl;

    if (context) {
      if (context.req) {
        currentUrl = new URL(
          context.req.url || "",
          `https://${context.req.headers.host}`
        );
      } else {
        currentUrl = new URL(`https://www.solotodo.cl${context.asPath}`);
      }
    } else {
      currentUrl = new URL(window.location.href);
    }

    const query = currentUrl.searchParams;
    for (const field of Object.values(this.fields)) {
      field.loadData(query);
    }
  }

  getQueryUrl() {
    const endpointSearch = this.endpoint.searchParams.toString();
    const querySearchParams: URLSearchParams = new URLSearchParams(
      endpointSearch
    );

    for (const field of Object.values(this.fields)) {
      for (const [key, values] of Object.entries(field.getApiParams())) {
        for (const value of values) {
          querySearchParams.append(key, value);
        }
      }
    }

    const querySearch = querySearchParams.toString();
    const queryUrl = new URL(this.endpoint.href);
    queryUrl.search = "?" + querySearch;
    return queryUrl;
  }

  submit(signal?: AbortSignal) {
    if (!this.isValid()) {
      throw Error("Form must be valid in order to be submitted");
    }

    const queryUrl = this.getQueryUrl();

    return this.fetchFunction(queryUrl.href, { signal: signal });
  }

  isValid(): boolean {
    return Object.values(this.fields).every((field) => field.isValid());
  }

  getField(name: string): ApiFormField {
    return this.fields[name];
  }

  setEndpoint(newEndpoint: string) {
    this.endpoint = new URL(newEndpoint);
  }
}
