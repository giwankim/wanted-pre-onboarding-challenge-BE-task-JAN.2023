# 함수형 프로그래밍, 실무에서 사용할 수 있나요? (feat. TypeScript, Nest.js)

해당 코스는 아래와 같은 주제로 진행돼요

- 함수형 프로그래밍의 기본 개념과 친숙해질 거예요.
- 함수형 패러다임으로 사고하며, 좋은 코드란 무엇일까 함께 고민하는 거예요.
- 실무에서 사용하는 아키텍처에서 함수형 프로그래밍의 사용 사례를 경험해 보는 거예요.


## 사전과제 진행 가이드

- 주제 전달을 위해 언어와 프레임워크를 선정했습니다.
- TypeScript, [Nest.js](https://docs.nestjs.com/), [FxTS](https://fxts.dev/) 를 사용해서 강의를 진행합니다.
- 강의 수강 전 미리 숙지하면 좋을 내용들로 사전과제를 준비했습니다.

> 사전과제는 해당 레포지토리 **Issues** 탭에 미리 올려 둔 template 을 복사해서 새로운 이슈로 사전과제 풀이를 올려주세요. (Pull Request X)

## 사전과제

1. 본인이 작성했던 코드 중 공유하고 싶은 코드를 이유와 함께 마크다운 코드블락을 사용해 올려주세요
   - 언어 상관없음
   - 어떤 로직이든 상관없음
   - 단, 길이가 길지 않은 함수 단위가 좋습니다

퍼블릭 블록체인에 서버에서 트랜잭션을 발생시켜 NFT를 민팅하는 코드입니다. 이정에 좇기다 보니 본의 아니게 약간 길고 많은 일을 하는 비지니스 로직이 구현되었습니다. 그럼에도 불구하고 공유하게 된 이유는 이런 코드를 리팩토링하고 싶다는 강한 의지가 있기 때문입니다.

  ```javascript
  async function mintPublic ({
  orderNumber,
  orderDate,
  productName,
  productType
}) {
  const imagePath = await imageGenerator.createImage({
    filename: 'image-public.png',
    orderNumber,
    orderDate,
    productName,
    productType
  })
  const { imageUrl, tokenUri } = await uploadImageAndMetadata({
    imagePath,
    productName,
    productType,
    orderNumber,
    orderDate
  })

  const { caver, address } = caverUtils.getInstance({
    endpoint: PUBLIC_KLAYTN_RPC_ENDPOINT,
    privateKey: PUBLIC_PRIVATE_KEY
  })
  const nftContract = caver.contract.create(
    PUBLIC_NFT_CONTRACT_ABI,
    PUBLIC_NFT_CONTRACT_ADDRESS
  )
  const receipt = await nftContract.send(
    { from: address, gas: MAX_GAS },
    'createToken',
    tokenUri
  )
  const mintTxHash = receipt.transactionHash
  const tokenId = receipt.events.Transfer.returnValues.tokenId
  await dbUtils.query(INSERT_NFT, [
    orderNumber,
    orderDate,
    productName,
    productType,
    CHAIN_ID,
    PUBLIC_NFT_CONTRACT_ADDRESS,
    mintTxHash,
    tokenId,
    imageUrl,
    tokenUri
  ])
  return {
    imageUrl,
    tokenUri,
    chainId: CHAIN_ID,
    contractAddress: PUBLIC_NFT_CONTRACT_ADDRESS,
    tokenId
  }
}
  ```

2. Layered Architecture(계층 아키텍처)에 대해서 설명해 주세요

마틴 파울러의 **엔터프라이즈 애플리케이션 아키텍처 패턴**에서는 다음과 같은 3계층 분리를 데이터 중심 에플리케이션을 모듈화하는 대표적인 방법으로 제시한다.

![layers](https://martinfowler.com/bliki/images/presentationDomainDataLayering/all_basic.png)

계층화를 하는 이유 또한 다음과 같은 세가지로 이야기하고 있다.

- 관심사 분리하여 개발자 뇌의 부하 분산
- 모듈들의 구체적 구현체 교체의 용이성
- 모듈 분기점들이 존재함으로서 좀 더 쉽게 테스트 가능한 코드를 작성하게 됨.

1. Dependency Injection(의존성 주입)의 개념과 함께, 왜 필요한지 작성해 주세요

객체의 의존 관계를 외부에서 결정하고 런타임에 주입하는 것이 의존성 주입이다. 토비의 스프링에서는 다음의 세 가지 조건을 충족하는 작업을 의존관계 주입이라 말한다.

- 클래스 모델이나 코드에는 런타임 시점의 의존관계가 드러나지 않는다. 그러기 위해서는 인터페이스만 의존하고 있어야 한다.
- 런타임 시점의 의존관계는 컨테이너나 팩토리 같은 제3의 존재가 결정한다.
- 의존관계는 사용할 오브젝트에 대한 레퍼런스를 외부에서 제공(주입)해줌으로써 만들어진다.

이일민, 토비의 스프링 3.1, 에이콘(2012), p114

DI의 장접으로는
- 의존성이 줄어든다.
- 재사용성이 높은 코드가 된다.
- 테스트하기 좋은 코드가 된다.
- 가독성이 높아진다.
 
1. 본인이 사용하는 언어의 Functional Programming(함수형 프로그래밍) 스펙을 예제와 함께 소개해 주세요

Higher-order 함수들인 filter, map, reduce는 함수형 프로그래밍에 중요한 요소이다.

배열의 원소들의 합을 구하는 함수를 map을 사용하여 다음과 같이 구현할 수 있다.

```js
function sum(numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}
```

5. (코드 작성) 다음 스펙을 만족하는 delay 함수를 작성해 주세요 (hint: Promise 사용)

```ts
type SomeFunctionReturnString = () => string

function delay(f: SomeFunctionReturnString, seconds: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(f());
      } catch (error) {
        reject(`${error.name}: ${error.message}`);
      }
    }, seconds * MS_IN_SECOND);
  });
};

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
```

**결과값**

```text
$ ts-node delay.ts
after 2 seconds
successfully done
Error: failed
```

6. 강의를 통해서 기대하는 바, 또는 얻고 싶은 팁을 적어주세요
함수형 사고 방식과 자바스크립트 함수형 문법을 익히고 실무에서 레거시 코드를 함수형으로 리팩토링 하는 방법과 이로 인헤 얻을 수 있는 효과에 대해서 배우고 싶습니다.
