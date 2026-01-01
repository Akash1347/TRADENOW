import { toast } from 'react-toastify';

export function showToast(message, type = "info") {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  } else {
    toast.info(message);
  }
}
