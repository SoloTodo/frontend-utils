/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiForm, ApiFormFieldMetadata } from "./ApiForm";
import { ApiFormProvider } from "./ApiFormContext";
import { useRouter } from "next/router";
import * as queryString from "query-string";
import { ApiFormInitialState } from "./types";
import { submitReady } from "./fields/submit/ApiFormSubmit";

type ApiFormComponentProps = {
  fieldsMetadata: ApiFormFieldMetadata[];
  endpoint: string;
  live?: boolean;
  initialState?: ApiFormInitialState;
  children?: ReactNode;
  requiresSubmit?: boolean;
  onResultsChange?: Function;
};

export default function ApiFormComponent(props: ApiFormComponentProps) {
  const router = useRouter();

  const form = useMemo(
    () =>
      new ApiForm(
        props.fieldsMetadata,
        props.endpoint,
        props.initialState && props.initialState.initialData
      ),
    []
  );
  const [currentResult, setCurrentResult] = useState(
    props.initialState ? props.initialState.initialResult : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [marker, setMarker] = useState(0);

  const updateUrl = (newUrlParams: Record<string, string[]>) => {
    const currentQuery = router.query;
    for (const [key, value] of Object.entries(newUrlParams)) {
      currentQuery[key] = value;
    }

    if (!Object.keys(newUrlParams).includes("page"))
      delete currentQuery["page"];

    const newSearch = queryString.stringify(currentQuery);
    const newPath = newSearch ? `${router.route}?${newSearch}` : router.route;
    router.push(newPath, undefined, { shallow: true });
  };

  useEffect(() => {
    form.initialize();
    const parseUrl = queryString.parseUrl(router.asPath);
    if (!props.requiresSubmit || submitReady(parseUrl.query.submit)) {
      setIsLoading(true);
      form.submit().then((results) => {
        setCurrentResult(results);
        props.onResultsChange && props.onResultsChange(results);
        setIsLoading(false);
      });
      if (props.requiresSubmit) updateUrl({ ...parseUrl.query, submit: [] });
    } else {
      setMarker(marker + 1);
    }
  }, [router.asPath]);

  return (
    <ApiFormProvider
      form={form}
      updateUrl={updateUrl}
      currentResult={currentResult}
      setCurrentResult={setCurrentResult}
      isLoading={isLoading}
    >
      {props.children}
    </ApiFormProvider>
  );
}
