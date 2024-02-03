export const genUUID = () => {
  return Math.random().toString(36).substr(2);
};

import { nextTick } from 'vue';
export const scrollToBottom = (selector) => {
  nextTick(() => {
    const scrollContainer = document.querySelector(selector);
    scrollContainer.scroll({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth',
    })
  });
}
