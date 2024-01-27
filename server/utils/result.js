const ERROR = 0;
const ERROR_MSG = '操作失败';

const SUCCESS = 1;
const SUCCESS_MSG = '操作成功';

class Result {
  /**
   * 构造函数
   * 重载：
   * 1. new Result(code, message, data)
   * 2. new Result(code, data)
   *
   * @param {number|string} code
   * @param {string|object?} message
   * @param {any?} data
   */
  constructor(code, message, data) {
    if (code == null) {
      throw new Error("code is null");
    }

    if (typeof message === "object") {
      const temp = data;
      data = message;

      if (typeof data === "string") {
        message = temp;
      } else {
        message = null;
      }
    }

    if (message == null) {
      message = ERROR_MSG
    }

    this.code = code;
    this.message = message;
    this.data = data;

    if (this.code === ERROR) {
      console.error(this.message, this.data);
    }
  }

  /**
   * 静态函数，成功返回
   * 重载：
   * 1. success(data)
   * 2. success(data, message)
   * 3. success(message, data)
   *
   * @param {string|object} message 消息内容
   * @param {any?} data 数据
   * @return {Result}
   */
  static success(message, data) {
    if (typeof message === "object") {
      const temp = data;
      data = message;

      if (typeof data === "string") {
        message = temp;
      } else {
        message = null;
      }
    }

    if (message == null) {
      message = SUCCESS;
    }

    return new Result(SUCCESS, message, data);
  }

  /**
   * 静态函数，失败返回
   * 重载：
   * 1. fail(data)
   * 2. fail(data, message)
   * 3. fail(message, data)
   *
   * @param {string|object} message 消息内容
   * @param {any?} data 数据
   * @return {Result}
   */
  static fail(message, data) {
    if (typeof message === "object") {
      const temp = data;
      data = message;

      if (typeof data === "string") {
        message = temp;
      } else {
        message = null;
      }
    }

    if (message == null) {
      message = ERROR_MSG;
    }

    return new Result(ERROR, message, data);
  }

  send(res) {
    res.send(this);
  }

}

export default Result;
