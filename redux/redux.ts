import { configureStore } from "@reduxjs/toolkit";
import apiResourceObjectsSlice from "./api_resources/apiResources";
import userSlice from "./user";

export default function reactUtilsStore(initialState: undefined) {
  return configureStore({
    reducer: {
      user: userSlice.reducer,
      apiResourceObjects: apiResourceObjectsSlice.reducer,
    },
    preloadedState: initialState,
  });
}

// THE store VARIABLE EXISTS ONLY TO DETERMINE THE RootState and AppDispatch
// TYPES BELOW IF YOU WANT TO EDIT THE configureStore OF THE APP YOU
// ALSO NEED TO EDIT THE initializeStore FUNCTION IN THE END
const store = configureStore({
  reducer: {
      user: userSlice.reducer,
      apiResourceObjects: apiResourceObjectsSlice.reducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
