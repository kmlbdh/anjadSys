class customError extends Error{
  constructor(msg, code){
    super(msg);
    this.code = code;
  }
}