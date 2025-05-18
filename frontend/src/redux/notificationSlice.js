import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
    markAsRead: (state) => {
      state.unreadCount = 0;
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        read: true
      }));
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    }
  }
});

export const { setNotifications, markAsRead, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 