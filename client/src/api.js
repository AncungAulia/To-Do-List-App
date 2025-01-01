import axios from "axios";

const token = localStorage.getItem("auth_token");
export const getTodos = async () => {
  try {
    const response = await axios.get("/todos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
