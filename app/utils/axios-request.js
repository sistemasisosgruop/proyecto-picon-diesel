import axios from "axios";

export async function axiosRequest(method, url, data = null, contentType = null) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        Accept: "application/json",
        "Content-Type": contentType ?? "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    if (method === "post") {
      throw error;
    }
    if (method === "delete") {
      throw error;
    }
  }
}
