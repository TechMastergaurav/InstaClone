import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

export const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setMessages(Array.isArray(res.data.messages) ? res.data.messages : []));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedUser?._id) {
      fetchAllMessages();
    }
  }, [selectedUser, dispatch]); // ✅ Add selectedUser & dispatch to dependencies
};
