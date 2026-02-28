import api from "./api";

export const login = async (data:any) => {
    const res = await api.post("/login",data);
    return res.data;
}

export const getUser = async () => {
  const res = await api.get("/user");
  return res.data;
};

export const logoutRequest = async () => {
  const res = await api.post("/logout");
  return res;
}