import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import { loginThunk,meThunk ,registerThunk,logoutThunk} from "./authThunk";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authChecked :false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
reducers: {
  clearError: (state) => {
    state.error = null;
  },
},
  extraReducers: (builder) => {
    builder

       .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.error = null;
       state. authChecked = true
      })

    .addCase(registerThunk.rejected, (state, action) => {
  state.loading = false;
  state.user = null;
  state.isAuthenticated = false;
  state.error = action.payload as string;
  state.authChecked = true;
})


      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.error = null;
       state. authChecked = true
      })

    .addCase(loginThunk.rejected, (state, action) => {
  state.loading = false;
  state.user = null;
  state.isAuthenticated = false;
  state.error = action.payload as string;
  state.authChecked = true;
})

.addCase(meThunk.pending, (state) => {
  state.loading = true;
})

.addCase(meThunk.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.data;
  state.isAuthenticated = true;
  state.error = null;
  state.authChecked = true;

})

.addCase(meThunk.rejected, (state) => {
  state.loading = false;
  state.user = null;
  state.isAuthenticated = false;
  state.error = null;
  state.authChecked = true;
})


// logout 

.addCase(logoutThunk.pending, (state) => {
    state.loading = true;
    state.error = null;
})
.addCase(logoutThunk.fulfilled, (state) => {
    state.loading = false;
    state.user = null;
    state.isAuthenticated = false;
    state.error = null;
    state.authChecked = true;
})

.addCase(logoutThunk.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
})
  },
});
export const { clearError } = authSlice.actions;

export default authSlice.reducer;