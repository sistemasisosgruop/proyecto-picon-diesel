import axios from "axios";

export async function axiosRequest(method, url, data = null) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios({
      method,
      url,
      data,
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}
