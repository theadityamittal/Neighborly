import axiosInstance from "../utils/axiosInstance";

export const uploadEvent = async (formData, token) => {
    if (!token) {
      return null;
    }
    try {
      const response = await axiosInstance.post('/events/api/events/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      return response;
  
    } catch (error) {
      console.error(error);
    }
};

export const getEventsByUser = async (formData, token) => {
  if (!token) {
    return null;
  }
  try {
    const response = await axiosInstance.get('/events/api/events/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response;

  } catch (error) {
    console.error(error);
    throw(error)
  }
};