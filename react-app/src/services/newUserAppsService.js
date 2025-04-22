import axiosInstance from "../utils/axiosInstance";

export const getApps = async (token) => {
    if (!token) {
      return null;
    }
    try {
      const response = await axiosInstance.get('/documents/UserDocuments/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      return response;
  
    } catch (error) {
      console.error(error);
    }
};
  
export const verifyApp = async (formData, token) => {
    if (!token) {
      return null;
    }
    try {
      const response = await axiosInstance.patch('/documents/verificationDocument/', formData,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      return response;
  
    } catch (error) {
      console.error(error);
    }
};