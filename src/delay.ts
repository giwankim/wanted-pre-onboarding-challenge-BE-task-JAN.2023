type SomeFunctionReturnString = () => string;

const MS_IN_SECOND = 1000;

function delay(f: SomeFunctionReturnString, seconds: number): Promise<string> {
  // 해당 함수 내부를 구현해 주세요
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(f());
      } catch (error) {
        reject(`${error.name}: ${error.message}`);
      }
    }, seconds * MS_IN_SECOND);
  });
}

const success = () => {
  return "successfully done";
};

const fail = () => {
  throw new Error("failed");
};

delay(success, 2)
  .then((res) => console.log(res))
  .catch((e) => console.log(e));

delay(fail, 2)
  .then((res) => console.log(res))
  .catch((e) => console.log(e));
