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

const historyRooms = ref([]);
export const setHistoryRooms = (data) => {
  historyRooms.value = data;
}

export const getHistoryRooms = () => {
  return historyRooms;
}

const QUESTIONS = 'questions';
export const getQuestions = async () => {
  const questions = await localforage.getItem(QUESTIONS);
  if (!questions) {
    return [];
  }
  return JSON.parse(questions);
}

export const setQuestions = (questions) => {
  return localforage.setItem(QUESTIONS, JSON.stringify(questions));
}
