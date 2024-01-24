import localforage from 'localforage'

localforage.config({
  name: 'duudle',
  storeName: 'duudle'
});

const USER_INFO = 'userInfo';
export const getUserInfo = () => {
  return localforage.getItem(USER_INFO);
};

export const setUserInfo = (userInfo) => {
  return localforage.setItem(USER_INFO, userInfo);
}