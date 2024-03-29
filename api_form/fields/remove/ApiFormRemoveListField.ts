import { ApiFormApiParams } from "../../types";

export type ApiFormRemoveListFieldProps = {
  fieldType: "remove";
  name: string;
};

export class ApiFormRemoveListField {
  readonly name: string;
  cleanedData?: string[];

  constructor(name: string, cleanedData?: URLSearchParams) {
    this.name = name;
    cleanedData && this.loadData(cleanedData);
  }

  loadData(query: URLSearchParams) {
    this.cleanedData = query.getAll(this.name);
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }

    const apiParams: ApiFormApiParams = {};
    apiParams[this.name] = this.cleanedData;
    return apiParams;
  }
}
