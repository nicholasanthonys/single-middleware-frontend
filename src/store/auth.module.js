import ApiService from "@/services/common/api.service";
import JwtService from "@/services/common/jwt.service";
import router from "@/router/routes";
import { decodeToken, getToken } from "../services/common/jwt.service";

const auth = {
  namespaced: true,
  state: () => ({
    errors: null,
    message: null,
    user: decodeToken(getToken()) ? decodeToken(getToken()) : null,
    loggedIn: !!JwtService.getToken(),
  }),
  getters: {
    currentUser(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.loggedIn;
    },
  },
  actions: {
    login(context, credentials) {
      const { email, password, redirect } = credentials;
      return new Promise((resolve, reject) => {
        ApiService.init();
        ApiService.post("/api/v1/auth/login", {
          email,
          password,
        }).then(
          (response) => {
            if (response.status === 200) {
              context.commit("setAccessToken", response.data.accessToken);
              context.commit("setAuth", {
                user: response.data.user,
              });
              router.push({ path: redirect });

              resolve(response);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
    logout(context, redirect) {
      context.commit("purgeAuth");
      router.push({ name: redirect });
    },
    register(context, credentials) {
      const { name, email, password } = credentials;
      return new Promise((resolve, reject) => {
        ApiService.init();
        ApiService.post("/api/v1/auth/register", {
          email: email,
          name,
          password,
        }).then(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
  },

  mutations: {
    setError(state, error) {
      state.errors = error;
    },
    setAuth(state, user) {
      state.loggedIn = true;
      state.user = user;
      state.errors = {};
    },
    setAccessToken(state, data) {
      JwtService.saveToken(data);
    },
    purgeAuth(state) {
      state.loggedIn = false;
      state.user = {};
      state.errors = {};
      JwtService.destroyToken();
    },
  },
};

export default auth;
