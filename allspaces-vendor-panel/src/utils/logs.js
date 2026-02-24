import moment from "moment";
import { toast } from "react-toastify";

export const showLogMessage = (message) => {
  console.log(`${moment().format("DD/MM/YYYY HH:MM:SS")} ~ ${message}`);
};

export const showToast = (message, type = "default") => {
  toast(message, { autoClose: true, draggable: true, type: type });
};
