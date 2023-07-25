/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useMemo, useState } from "react";
import { ApiForm, ApiFormFieldMetadata } from "./ApiForm";
import { ApiFormProvider } from "./ApiFormContext";
import { useRouter } from "next/router";
import queryString from "query-string";
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
  const [currentResult, setCurrentResult] = useState(
    props.initialState ? props.initialState.initialResult : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useMemo(() => {
    props.onResultsChange &&
      !props.requiresSubmit &&
      typeof window !== "undefined" &&
      props.onResultsChange(props.initialState?.initialResult);
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
    const myAbortController = new AbortController();
    form.setEndpoint(props.endpoint);
    form.initialize();
    if (
      !props.initialState ||
      (props.initialState && props.initialState.initialResult !== currentResult)
    ) {
      const parseUrl = queryString.parseUrl(router.asPath);
      if (!props.requiresSubmit || submitReady(parseUrl.query.submit)) {
        setIsLoading(true);
        form
          .submit(myAbortController.signal)
          .then((results) => {
            setCurrentResult(results);
            props.onResultsChange && props.onResultsChange(results);
            setIsLoading(false);
          })
          .catch((_) => {
            setIsLoading(false);
          });
        if (props.requiresSubmit) updateUrl({ ...parseUrl.query, submit: [] });
      } else {
        setCurrentResult([]);
      }
    }

    return () => {
      !props.requiresSubmit && myAbortController.abort();
    };
  }, [router.asPath, props.endpoint]);

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
