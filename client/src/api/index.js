import request from "@/utils/request.js";

export const addUser = (user) => {
  return request.post("/user/add", user);
}
