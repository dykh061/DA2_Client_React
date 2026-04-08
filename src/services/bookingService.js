import { API_ENDPOINTS } from "../config/api";
import { apiRequest } from "./apiClient";

export const createBooking = async (bookingData) => {
  const res = await apiRequest(
    API_ENDPOINTS.CREATE_BOOKING,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    },
    "Dat san that bai",
  );

  return res;
};
