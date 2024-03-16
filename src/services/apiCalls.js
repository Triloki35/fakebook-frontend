import axios from "axios";
const API = process.env.REACT_APP_API;
export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`${API}auth/login`, userCredentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    const { notifications, bookmarks, ...userInfo } = res.data;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};

// user fetchFriendList
export const fetchFriendList = async (user) => {
  try {
    const friendList = await axios.get(`${API}users/friends/${user?._id}`);
    return friendList;
  } catch (error) {
    console.log(error);
  }
};
