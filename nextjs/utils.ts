import {destroyCookie, parseCookies, setCookie} from "nookies";
import {fetchJson, FetchJsonInit, InvalidTokenError} from "../network/utils";
import atob from "atob";
import {apiSettings} from "../settings";
import {GetServerSidePropsContext, NextPageContext} from "next/types";
import {CategoryColumn} from "../types/store";

type NextPageContextOrNull =
    | NextPageContext
    | GetServerSidePropsContext
    | null
    | undefined;

export function getAuthTokens(ctx: NextPageContextOrNull) {
    const tokens = JSON.parse(parseCookies(ctx)["authTokens"]);

    if (!tokens.access || !tokens.refresh) {
        throw new InvalidTokenError("Missing or invalid JSON in authTokens cookie");
    }

    return tokens;
}

type AuthTokensType = {
    refresh: string;
};

export function saveAuthTokens(
    context: NextPageContextOrNull,
    authTokens: AuthTokensType,
) {
    const decodedRefreshToken = JSON.parse(
        atob(authTokens.refresh.split(".")[1]),
    );

    const cookieParameters = {
        maxAge: decodedRefreshToken.exp,
        path: "/",
        domain: undefined as string | undefined,
    };

    const hostname =
        context && context.req
            ? context.req.headers.host
            : window.location.hostname;

    if (hostname && hostname.includes(".solotodo.com")) {
        cookieParameters.domain = ".solotodo.com";
    }

    setCookie(
        context,
        "authTokens",
        JSON.stringify(authTokens),
        cookieParameters,
    );
}

export function deleteAuthTokens(context: NextPageContextOrNull) {
    const cookieParameters = {
        path: "/",
        domain: undefined as string | undefined,
    };

    const hostname =
        context && context.req
            ? context.req.headers.host
            : window.location.hostname;

    if (hostname && hostname.includes(".solotodo.com")) {
        cookieParameters.domain = ".solotodo.com";
    }

    destroyCookie(context, "authTokens", cookieParameters);
}

export async function jwtFetch(
    context: NextPageContextOrNull,
    input: string,
    init?: FetchJsonInit,
) {
    console.log(input)
    let {access, refresh} = getAuthTokens(context);

    const decodedAccessToken = JSON.parse(atob(access.split(".")[1]));
    const now = new Date();
    const accessTokenExpiration = new Date(decodedAccessToken.exp * 1000);

    if (accessTokenExpiration < now) {
        // The access token has expired, try and refresh it
        const decodedRefreshToken = JSON.parse(atob(refresh.split(".")[1]));
        const refreshTokenExpiration = new Date(decodedRefreshToken.exp * 1000);

        if (refreshTokenExpiration < now) {
            // Both tokens have expired. The tokens' cookie is set to have a
            // maxAge equal to the refresh token so this path should never
            // happen
            throw new InvalidTokenError("Access and expiration tokens have expired");
        }

        const refreshTokenParams = {
            method: "POST",
            body: JSON.stringify({refresh: refresh}),
        };

        // TODO put type in this response
        const res = await fetchJson("auth/token/refresh/", refreshTokenParams);
        access = res.access;

        const cookieParameters = {
            maxAge: decodedRefreshToken.exp,
            path: "/",
            domain: undefined as string | undefined,
        };

        const hostname =
            context && context.req
                ? context.req.headers.host
                : window.location.hostname;

        if (hostname && hostname.includes(".solotodo.com")) {
            cookieParameters.domain = ".solotodo.com";
        }

        const newAuthTokens = {
            access,
            refresh,
        };

        saveAuthTokens(context, newAuthTokens);
    }

    const requestInit = init || ({} as FetchJsonInit);

    if (!requestInit.headers) {
        requestInit.headers = {};
    }

    requestInit.headers.Authorization = `Bearer ${access}`;

    return await fetchJson(input, requestInit);
}

export const getStore = async (context: NextPageContext) => {
    try {
        const store = await jwtFetch(
            context,
            `${apiSettings.apiResourceEndpoints.stores}${context.query["id"]}`,
        );
        return {
            props: {
                store: store,
            },
        };
    } catch {
        return {
            notFound: true,
        };
    }
};

export const getCategorySpecsFromLayout = async (
    context: NextPageContext,
    websiteId: number,
) => {
    let categorySpecsFormLayout: { website: string; name: string } | null = null;
    try {
        const response = await jwtFetch(
            context,
            `${apiSettings.apiResourceEndpoints.category_specs_form_layouts}?category=${context.query["id"]}&website=${websiteId}`,
        );
        response.forEach((res: { website: string; name: string }) => {
            if (res.name === null) categorySpecsFormLayout = res;
        });
        return categorySpecsFormLayout;
    } catch {
        return null;
    }
};

export const getCategoryColumns = async (
    context: NextPageContext,
    purposeId: number,
): Promise<CategoryColumn[] | null> => {
    try {
        return jwtFetch(
            context,
            `${apiSettings.apiResourceEndpoints.category_columns}?categories=${context.query["id"]}&purposes=${purposeId}`,
        );
    } catch {
        return null;
    }
};

export function fetchAuth(
    context: NextPageContextOrNull,
    input: string,
    init?: FetchJsonInit,
) {
    if (typeof parseCookies(context)["authTokens"] !== "undefined") {
        return jwtFetch(context, input, init);
    } else {
        return fetchJson(input, init);
    }
}

// A nice helper to tell us if we're on the server
export const isServer = !(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);
