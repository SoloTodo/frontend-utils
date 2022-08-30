import { ApiFormApiParams } from "../../types";

export type ApiFormTreeChoice = {
  value: number | string;
  label: string;
};

export type ApiFormTreeProps = {
  fieldType: "tree";
  name: string;
  choices: ApiFormTreeChoice[];
  multiple?: boolean;
  required?: boolean;
};

export class ApiFormTree {
  readonly name: string;
  readonly choices: ApiFormTreeChoice[];
  readonly multiple: boolean;
  readonly required: boolean;
  cleanedData?: ApiFormTreeChoice[];

  constructor(
    name: string,
    choices: ApiFormTreeChoice[],
    multiple?: boolean,
    required?: boolean,
    cleanedData?: ApiFormTreeChoice[]
  ) {
    this.name = name;
    this.choices = choices;
    this.multiple = multiple || false;
    this.required = required || false;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    this.cleanedData = this.cleanData(query.getAll(this.name));
  }

  cleanData(data?: string | string[]): ApiFormTreeChoice[] | undefined {
    const normalizedData = typeof data === "string" ? [data] : data;
    const parsedData = normalizedData
      ? (normalizedData
          .map((id) =>
            this.choices.find((elem) =>
              typeof elem.value === "string"
                ? elem.value === id
                : elem.value === parseInt(id)
            )
          )
          .filter(
            (choice) => typeof choice !== "undefined"
          ) as ApiFormTreeChoice[])
      : undefined;

    if (typeof parsedData === "undefined") {
      if (!this.required) {
        return [];
      } else {
        return [this.choices[0]];
      }
    }

    if (this.required && parsedData.length === 0) {
      return [this.choices[0]];
    }

    if (!this.multiple && parsedData.length > 0) {
      return [parsedData[0]];
    }

    return parsedData;
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }

    const apiParams: ApiFormApiParams = {};
    apiParams[this.name] = this.cleanedData.map((val) => val.value.toString());
    return apiParams;
  }
}
