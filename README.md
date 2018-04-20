# nodestudy
생활코딩 Node.js 강의 수강내용 

```
# 환경변수 등록하기 

1. export PASSWORD=hello
2. node 콘솔에서 process.env로 확인하기
3. echo $PASSWORD로도 확인가능함 
```

```
# 인증서 생성 및 읽어오기

최근에 페이스북 앱을 새로 만드셨다면 로그인 설정 -> 클라이언트 OAuth 설정 부분에서 HTTPS 적용이 강제로 "예"로 설정이 되어있습니다. 그래서 로컬에서 작업하시더라도 인증서를 생성하셔야 합니다. 
또한, 리디렉션 URI에 Strict 모드 사용이 강제로 "예"로 설정되어 있기 때문에 "유효한 OAuth 리디렉션 URI" 설정 부분에 반드시 정확한 callbackURL을 등록해주셔야 합니다. 이 강의에서는 https://<도메인 주소>/auth/facebook/callback을 등록해주시면 됩니다. 

1. 인증서 생성 
https://jamielinux.com/docs/openssl-certificate-authority/index.html
링크에 가셔서 "Sign server and client certificates" 부분까지 따라하세요. 

* 주의사항 
Create the root pair, Create the intermediate pair 에 openssl.cnf 라는 설정파일이 있는데 
두 개의 설정파일에 추가해야 할 사항이 있습니다. 
[ v3_ca ], [ v3_intermediate_ca ], [ server_cert ] 부분에 
아래 두 줄을 추가해줍니다. 
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
또한, 독립적으로, 아래 코드를 추가합니다. 
----------------------------------------
[alt_names]
DNS.1 = www.example.com
DNS.2 = example.com
----------------------------------------
위 주의사항을 지키지 않으시면, 크롬 개발자 콘솔의 security 탭 부분에 에러가 뜰 겁니다. 
에러내용은 결국 인증서에 "Subject Alternative Name" 항목이 없다는 겁니다. 
"View certificate"을 해서 details를 보시면 없을 겁니다. 

이렇게 하시면 인증서가 생성이 될 것이고 필요한 파일은 아래와 같습니다. 
-----------------------------------------
ca-chain.cert.pem
www.example.com.key.pem
www.example.com.cert.pem
-----------------------------------------
생성된 3개의 파일을 server_side_javascript에 ssl이라는 폴더를 생성하고 그리로 복사하세요.
권한 때문에 복사가 제대로 되지 않으시면 커맨드창에서 cp 명령어로 복사해옵니다. 

2. 크롬 브라우저에 인증서 등록하기 

크롬 브라우저 settings -> Advanced를 들어가시면 "Manage certificates"를 클릭하세요.
"AUTORITIES"탭을 클릭하시면 import로 인증서를 등록하실수 있습니다. 
반드시 "ca-chain.cert.pem" 파일을 등록하세요. 왜냐면 root certificate, intermediate certificate, server certificate 이 체인으로 묶여서 한꺼번에 등록이 되기 때문입니다. 

3. app_passport_file.js 에 생성한 인증서 읽어오는 코드 추가하기 

파일 상단에 아래 코드를 추가하세요.
------------------------------------------
var fs = require('fs');
var https = require('https');
------------------------------------------
파일 맨 아래에 아래 코드를 추가하세요. 
-----------------------------------------------------------------------
var options = { 
	ca: fs.readFileSync('ssl/ca-chain.cert.pem'),
    key: fs.readFileSync('ssl/www.example.com.key.pem'), 
    cert: fs.readFileSync('ssl/www.example.com.cert.pem'), 
    passphrase: 'secretpassword'
}; 
https.createServer(options, app).listen(443, () => {
	console.log('Connected 443 port !');
});
---------------------------------------------------------------------
* 주의사항 
passphrase 속성에 여러분이 인증서를 생성할 때 설정한 비밀번호를 입력해주셔야 합니다.
개개인마다 생성할때 비밀번호를 다르게 설정할 수 있으므로 주의하세요.
만약, 인증서 생성하실때 해당 링크 튜토리얼을 그대로 따라하셨다면 
위와 같이 passphrase는 secretpassword가 됩니다. 

4. 로컬호스트 IP에 도메인 연결하기 

커맨드 창을 열고 sudo vim /etc/hosts 파일을 여시고,
아래 코드를 맨 아래에 추가하세요. 
------------------------------------------
127.0.0.1 www.example.com
------------------------------------------
* 주의사항 
만약 인증서 생성시 Common Name에 도메인 주소를 
다르게 생성하셧다면 Common Name과 일치하는 주소로 
host를 등록해주셔야 합니다. 

위의 모든 과정을 따라하셨다면, 
아마 페이스북 API에 잘 접속이 되실 겁니다. 

마지막으로 반드시 페이스북 앱의 로그인 설정에서 
"유효한 OAuth 리디렉션 URI" 에
https://<도메인 주소>/auth/facebook/callback
을 등록해주시는걸 까먹지 마세요. 
이 부분 때문에 몇일을 삽질했습니다. 

그리고 앱 설정 -> 기본설정에서 "앱 도메인", "사이트 URL", "개인정보처리방침 URL" 에 모두 
host에 등록된 도메인 주소를 입력해주세요. 
또한, 앱 설정 -> 고급설정에 "앱 시크릿 코드 요청"을 "아니요"로 해주시고,
리디렉션 공유 화이트리스트에서 "도메인 간 공유 리디렉션 허용"을 "예"로 
해주시면 아마 잘 되리라고 생각이 됩니다.  
```
