import axios from "axios";
export const loginCall = async (userCredentials, dispatch) => {
  // console.log("usercredential = "+userCredentials);
  // console.log("dispatch = "+dispatch);
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login", userCredentials);
    console.log("res.data = " + JSON.stringify(res.data));
    // saving user info in localStorage
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};


// user fetchFriendList
export const fetchFriendList= async (user) => {
  try {
    const friendList = await axios.get(`users/friends/${user?._id}`);
    return friendList;
  } catch (error) {
    console.log(error);
  }
}
