import React, { ReactNode } from "react";
import { ApiForm, ApiFormField } from "./ApiForm";

const ApiFormContext = React.createContext({
  getField: (name: string) => undefined as ApiFormField | undefined,
  updateUrl: (newUrlParams: Record<string, string[]>) => {},
  currentResult: undefined as any,
  setCurrentResult: (newCurrentResult: any) => {},
  isLoading: true,
  getQueryUrl: () => undefined as unknown as URL,
});

type ApiFormProviderProps = {
  children: ReactNode;
  form: ApiForm;
  updateUrl: (newUrlParams: Record<string, string[]>) => void;
  currentResult: any;
  setCurrentResult: React.Dispatch<any>;
  isLoading: boolean;
};

export const ApiFormProvider = ({
  children,
  form,
  updateUrl,
  currentResult,
  setCurrentResult,
  isLoading,
}: ApiFormProviderProps) => {
  const getField = (name: string) => form.getField(name);
  const getQueryUrl = () => form.getQueryUrl();

  return (
    <ApiFormContext.Provider
      value={{
        getField: getField,
        getQueryUrl: getQueryUrl,
        updateUrl: updateUrl,
        currentResult: currentResult,
        setCurrentResult: setCurrentResult,
        isLoading: isLoading,
      }}
    >
      {children}
    </ApiFormContext.Provider>
  );
};

export default ApiFormContext;
