
const questions = [
  {
    answers: ['冰箱', '洗衣机', '空调', '电视', '微波炉', '烤箱', '电饭煲', '吸尘器', '电熨斗', '电吹风', '咖啡机', '热水壶'],
    question1: ['一种家用电器', '一种生活必备电子产品', '一种提供生活便利的电器', '一种家用电子设备', '一种家用电子产品'],
    question2: ['制冷设备', '清洁设备', '让人感到舒适', '休闲娱乐', '烹饪设备', '烹饪设备', '烹饪设备', '清洁设备', '清洁设备', '美容设备', '烹饪设备', '烹饪设备'],
  },
  {
    answers: ['鸡蛋', '牛奶', '面包', '酸奶', '饼干', '巧克力', '薯片', '果冻', '蛋糕', '水果', '蔬菜'],
    question1: ['一种食物', '一种食品', '好吃的', '营养丰富', '美味可口的食物'],
    question2: ['圆的', '白色液体', '面粉做的', '白色液体', '圆的', '有黑色和白色', '嘎吱脆', 'QQ弹弹', '小点心', '补充维生素', '绿色的'],
  },
  {
    answers: ['篮球', '足球', '排球', '乒乓球', '羽毛球', '网球', '高尔夫球', '台球', '棒球', '保龄球'],
    question1: ['一种球类运动', '一种体育运动', '一种运动', '一种体育项目', '一种体育运动项目'],
    question2: ['用手拍', '用脚踢', '用手打', '用球拍打', '用球拍打', '用球拍打', '用球杆打', '用球杆打', '用球杆打', '用球打'],
  },
  {
    answers: ['猪', '牛', '羊', '鸡', '鸭', '鹅', '鸽子', '鸭子'],
    question1: ['一种动物', '一种家畜', '生活常见的动物', '一种被人类驯养的动物', '一种家禽'],
    question2: ['能吃', '能吃', '能吃', '能吃', '能吃', '能吃', '能吃', '能吃'],
  },
  {
    answers: ['苹果', '香蕉', '橙子', '梨', '西瓜', '葡萄', '草莓', '樱桃', '柠檬', '柚子', '哈密瓜', '火龙果'],
    question1: ['一种水果', '一种食品', '一种食物', '一种水果', '常见的水果'],
    question2: ['红色', '黄色', '橙色', '黄色', '绿色', '紫色', '红色', '红色', '黄色', '黄色', '黄色', '红色'],
  },
  {
    answers: ['阴天', '下雨', '下雪', '龙卷风', '沙尘暴', '打雷'],
    question1: ['一种天气', '一种自然现象', '生活中常见的天气', '一种天气现象', '一种自然现象'],
    question2: ['没太阳', '没太阳', '没太阳', '有大风', '有大风', '没太阳'],
  },
  {
    answers: ['钢笔', '铅笔', '毛笔', '圆珠笔', '马克笔', '水彩笔', '蜡笔'],
    question1: ['一种文具', '一种书写工具', '用来写字画画的工具'],
    question2: ['用来写字', '用来写字', '用来写字', '用来写字', '用来写字', '用来画画', '用来画画'],
  },
  {
    answers: ['狮子', '老虎', '熊', '狼', '狐狸', '猴子', '大象', '长颈鹿', '斑马', '犀牛', '河马', '猩猩'],
    question1: ['一种动物', '一种野生动物', '一种生物', '一种动物', '一种动物'],
    question2: ['有鬃毛', '有鬃毛', '有毛', '有毛', '有毛', '有毛', '有长鼻子', '有长脖子', '有条纹', '有角', '有角', '有毛'],
  },
  {
    answers: ['火车', '飞机', '轮船', '汽车', '自行车', '摩托车', '电动车', '地铁', '公交车', '出租车', '跑车', '卡车'],
    question1: ['一种交通工具', '公共交通工具', '可以带人的交通工具'],
    question2: ['一堆轮子', '没有轮子', '没有轮子', '四个轮子', '两个轮子', '两个轮子', '两个轮子', '没有轮子', '一堆轮子', '四个轮子', '四个轮子', '一堆轮子'],
  }
]

export const getRandomQuestion = () => {
  const index = Math.floor(Math.random() * questions.length);
  const question = questions[index];

  const answerIndex = Math.floor(Math.random() * question.answers.length);
  const answer = question.answers[answerIndex];

  const question1 = `${answer.length}个字`
  const question2 = question.question1[Math.floor(Math.random() * question.question1.length)];
  const question3 = question.question2[answerIndex];
  return {
    question: [question1, question2, question3],
    answer: answer
  }
}
