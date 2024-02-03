<template>
  <div class="questions">
    <head-bar :userInfo="userInfo"/>
    <div class="back" @click="() => $router.go(-1)">👈返回</div>

    <div style="display: flex; gap: 10px; margin: 10px;">
      <button @click="randomQuestion()">新增随机问题</button>
      <button @click="handleAddQuestion()">新增问题</button>
    </div>

    <div class="question-list">
      <section class="accordion accordion--radio">
        <div
          v-for="(question, index) in questions"
          class="tab"
        >
          <input v-model="expandQuestion" type="radio" name="accordion-2" :id="`rd${index}`" :value="`rd${index}`">
          <label :for="`rd${index}`" class="tab__label">
            <span style="display: flex; flex-direction: column;">
              <em>问题：{{ question.question.join('，') }}</em>
              <em>答案：{{ question.answer }}</em>
            </span>
          </label>
          <div class="tab__content">
            <div class="input-wrap">
              <label for="question">答案：</label>
              <input v-model="question.answer" type="text" placeholder="请输入答案"/>
            </div>
            <div class="input-wrap">
              <label for="question">提示1：</label>
              <input v-model="question.question[1]" type="text" placeholder="请输入提示1"/>
            </div>
            <div class="input-wrap">
              <label for="question">提示2：</label>
              <input v-model="question.question[2]" type="text" placeholder="请输入提示2"/>
            </div>

            <div style="text-align: center;">
              <button @click="handleDeleteQuestion(index)">删除</button>
            </div>
          </div>
        </div>

        <div class="tab">
          <input type="radio" name="accordion-2" id="rdClose">
          <label for="rdClose" class="tab__close">Close open tab &times;</label>
        </div>
      </section>
    </div>

    <button @click="setQuestion()" style="margin-top: 20px;">保存</button>
  </div>
</template>

<script setup>
import {getUserInfo, getQuestions, setQuestions} from "@/store/localforage.js";
import HeadBar from "@/components/HeadBar.vue";
import {showToast} from "@/components/zToast/index.js";
import {getRandomQuestion} from "@/api/index.js";

defineOptions({
  name: "Questions"
})

const userInfo = ref({});
getUserInfo().then((data) => {
  userInfo.value = data;
});

const questions = ref([]);
getQuestions().then((data) => {
  questions.value = data;
});

const expandQuestion = ref('');
const handleAddQuestion = () => {
  questions.value.unshift({
    question: [],
    answer: ''
  });
  expandQuestion.value = `rd0`;
}

const randomQuestion = () => {
  getRandomQuestion().then(({data}) => {
    const question = {
      question: data.question,
      answer: data.answer
    };
    questions.value.unshift(question);
  });
  expandQuestion.value = `rd0`;
}

const handleDeleteQuestion = (index) => {
  questions.value.splice(index, 1);
  expandQuestion.value = '';
}

const setQuestion = () => {
  for (let i = 0; i < questions.value.length; i++) {
    const question = questions.value[i];
    question.question = question.question.filter(Boolean);
    if (question.question.length === 0) {
      showToast('问题不能为空');
      expandQuestion.value = `rd${i}`;
      return;
    }

    if (question.answer.length === 0) {
      showToast('答案不能为空');
      expandQuestion.value = `rd${i}`;
      return;
    }

    if (question.question.length < 3) {
      question.question.unshift(question.answer.length + '个字');
    }
  }

  setQuestions(questions.value).then(() => {
    showToast('保存成功');
  });
}


</script>

<style scoped>
.questions {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  width: 100%;
}

.back {
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px;
  cursor: pointer;
  color: #333;
  height: 50px;
  line-height: 50px;
  margin-left: auto;
}

.question-list {
  overflow-y: auto;
  padding: 20px;
  background: white;
}

.tab input[type="radio"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.tab input[type="text"] {
  all: unset;
  width: 100%;
  padding: 8px 1rem;
  border: none;
  border-bottom: 1px solid #f5f5f5;
  box-sizing: border-box;
}

.tab input[type="text"]:focus {
  border-color: #2196F3;
}

.input-wrap {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.input-wrap label {
  width: 100px;
  text-align: right;
  margin-right: 10px;
}

button {
  all: unset;
  margin-top: 4px;
  width: 100%;
  min-width: 150px;
  max-width: 200px;
  padding: 8px 1rem;
  border: none;
  border-radius: 4px;
  background: #2196F3;
  color: white;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.35s;
}

.tab__content {
  max-height: 0;
  overflow: hidden;
  transition: all 0.35s;
}

.tab input[type="radio"]:checked ~ .tab__content {
  max-height: 160px;
  border-bottom: 1px solid #f5f5f5;
}

.accordion {
  overflow: hidden;
}

.tab__label,
.tab__close {
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  cursor: pointer;
}

.tab__label {
  justify-content: space-between;
  padding: 1rem;
}

.tab__label::after {
  content: "\276F";
  width: 1em;
  height: 1em;
  text-align: center;
  transform: rotate(90deg);
  transition: all 0.35s;
}

.tab input:checked + .tab__label::after {
  transform: rotate(270deg);
}

.tab__content p {
  margin: 0;
  padding: 1rem;
}

.tab__close {
  justify-content: flex-end;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.tab input:not(:checked) + .tab__label:hover::after {
  animation: bounce .5s infinite;
}

@keyframes bounce {
  25% {
    transform: rotate(90deg) translate(.25rem);
  }
  75% {
    transform: rotate(90deg) translate(-.25rem);
  }
}

</style>
