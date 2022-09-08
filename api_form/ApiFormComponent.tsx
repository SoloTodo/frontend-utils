/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
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
  const notInitialRender = useRef(!props.initialState);
  const [currentResult, setCurrentResult] = useState(
    props.initialState ? props.initialState.initialResult : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useMemo(() => {
    notInitialRender.current = !props.initialState;
    props.initialState && setCurrentResult(props.initialState.initialResult);
    return new ApiForm(
      props.fieldsMetadata,
      props.endpoint,
      props.initialState && props.initialState.initialData
    );
  }, [props.endpoint]);

  const updateUrl = (newUrlParams: Record<string, string[]>) => {
    const currentQuery = router.query;
    for (const [key, value] of Object.entries(newUrlParams)) {
      currentQuery[key] = value;
    }

    if (!Object.keys(newUrlParams).includes("page"))
      delete currentQuery["page"];

    const newSearch = queryString.stringify(currentQuery);
    const newPath = newSearch ? `${router.route}?${newSearch}` : router.route;
    router.push(newPath, undefined, { shallow: true, scroll: true });
  };

  useEffect(() => {
    form.initialize();
    if (notInitialRender.current) {
      const parseUrl = queryString.parseUrl(router.asPath);
      if (!props.requiresSubmit || submitReady(parseUrl.query.submit)) {
        setIsLoading(true);
        form.submit().then((results) => {
          setCurrentResult(results);
          props.onResultsChange && props.onResultsChange(results);
          setIsLoading(false);
        });
        if (props.requiresSubmit) updateUrl({ ...parseUrl.query, submit: [] });
      }
    } else {
      notInitialRender.current = true;
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
