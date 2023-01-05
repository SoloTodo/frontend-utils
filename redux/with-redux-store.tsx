import React from "react";
import { isServer } from "../nextjs/utils";
import reactUtilsStore from "./redux";
import { NextComponentType, NextPageContext } from "next/types";
import { AppContext } from "next/app";
import { AnyAction, Store } from "@reduxjs/toolkit";

const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__";

function getOrCreateStore(initialState?: any) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return reactUtilsStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!(window as { [key: string]: any })[__NEXT_REDUX_STORE__]) {
    (window as { [key: string]: any })[__NEXT_REDUX_STORE__] =
      reactUtilsStore(initialState);
  }
  return (window as { [key: string]: any })[__NEXT_REDUX_STORE__];
}

export interface MyNextPageContext extends NextPageContext {
  reduxStore: Store<any, AnyAction>;
}

export interface MyAppContext extends AppContext {
  ctx: MyNextPageContext;
}

export type MyNextPage<P = {}, IP = P> = NextComponentType<
  MyNextPageContext,
  IP,
  P
>;

export default function MyApp(App: any) {
  return class AppWithRedux extends React.Component {
    reduxStore: any;

    static async getInitialProps(appContext: MyAppContext) {
      const reduxStore = getOrCreateStore();

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};
      if (typeof App.getInitialProps === "function") {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      };
    }

    constructor(props: any) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />;
    }
  };
}
