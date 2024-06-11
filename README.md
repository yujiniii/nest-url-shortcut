## 개요
[가상 면접 사례로 배우는 대규모 시스템 설계 기초](https://www.yes24.com/Product/Goods/124138645) 를 읽고, **8장 URL 단축키 설계** 를 직접 구현해본 예제입니다.    
책에서 제안한 2가지 접근법 모두 구현합니다. : `해시 후 충돌 해소 전략` `base-62 변환`  
NestJS를 사용하였고, DB는 실물 엑셀 파일으로 갈음하였습니다.

### 앱 실행
```bash
$ yarn install
$ yarn run start
```

## 프로젝트 상세
> 이 프로젝트는 `http://localhost:3000/short/:key`으로 접속했을 때, key 값에 따라 원래 url 로 이동하게끔 작성되었습니다.

![스크린샷 2024-06-11 오후 7 29 59](https://github.com/yujiniii/nest-url-shortcut/assets/50348197/954e9520-951d-4d95-ae3d-61c94960ce7f)


### short url 발급

```bash
$ curl --location 'localhost:3000/short' \
--header 'Content-Type: application/json' \
--data '{
    "url":"http://localhost:3000/real/testtest-4" # 단축을 원하는 url 입력
}'
```
<img width="855" alt="스크린샷 2024-06-11 오후 7 28 26" src="https://github.com/yujiniii/nest-url-shortcut/assets/50348197/e6c2b2e7-f884-4bbc-85d3-b07c0dc0f143">


### short url 사용
아까 발급된 키가 만약 `ufnlUnx` 이라면, `http://localhost:3000/short/ufnlUnx` 을 주소에 입력합니다.   
( 같은 주소를 바라보는 2개의 short url을 만들었기 때문에, `64b5f8ve3v6w` 도 동일하게 적용됩니다)  

![스크린샷 2024-06-11 오후 5 18 01](https://github.com/yujiniii/nest-url-shortcut/assets/50348197/826e1a47-49b0-4161-9a37-dc79722a9559)


원하는 주소로 잘 redirect 된 것을 확인할 수 있습니다. 

![스크린샷 2024-06-11 오후 5 18 06](https://github.com/yujiniii/nest-url-shortcut/assets/50348197/5408c42b-1462-4d87-8441-78a36dad5eb1)
