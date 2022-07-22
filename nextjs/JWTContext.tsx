import React, { useContext, ReactNode } from "react";
import { useRouter } from "next/router";
import { FetchJsonInit, InvalidTokenError } from "../network/utils";
import { deleteAuthTokens, jwtFetch } from "./utils";
import userSlice from "../redux/user";
import { useSnackbar } from "notistack";
import { useDispatch } from 'react-redux';

function defaultAuthFetch(input: string, init?: FetchJsonInit): Promise<any> {
  return Promise.reject();
}

const AuthContext = React.createContext({
  authFetch: defaultAuthFetch,
  logout: (withRoute = true) => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const authFetch = (input: string, init?: FetchJsonInit) => {
    try {
      return jwtFetch(null, input, init);
    } catch (err) {
      if (err instanceof InvalidTokenError) {
        deleteAuthTokens(null);
        dispatch(userSlice.actions.setUser(null));
        enqueueSnackbar(
          "Error de autenticación, por favor inicie sesión nuevamente",
          { variant: 'error' }
        );
        router.push("/login?next=" + encodeURIComponent(router.asPath));
      } else {
        enqueueSnackbar(
          "Error al ejecutar la petición, por favor intente de nuevo",
          { variant: 'error' }
        );
      }
      return Promise.reject();
    }
  };

  const logout = (withRoute = true) => {
    deleteAuthTokens(null);
    dispatch(userSlice.actions.setUser(null));
    enqueueSnackbar("Sesión cerrada exitosamente");
    withRoute && router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ authFetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
