// http 모듈을 로드
var http = require('http');
var fs = require('fs');

// 숫자를 쓴다
function writeNumbers(res){
	var counter = 0;

	// 숫자를 증가해가면서 클라이언트에게 쓴다
	for(var i=0; i<100; i++){
		counter++;
		res.write(counter.toString() + '\n');
	}
}

// http 서버를 생성
http.createServer(function(req, res){
	var query = require('url').parse(req.url).query;
	var app = require('querystring').parse(query).file + '.txt';

	// 컨텐츠 헤더
	res.writeHead(200, {'Content-Type': 'text/plain'});

	// 숫자를 쓴다
	writeNumbers(res);

	//파일을 열고 내용을 읽기 위한 타이머
	setTimeout(function(){

		console.log('opening' + app);

		//파일 내용을 열고 읽음
		fs.readFile(app, 'utf8', function(err, data){
			if(err)
				res.write('Could not find or open file for reading\n');
			else {
				res.write(data);
			}
			//응답완료
			res.end();
		});
	}, 2000);
}).listen(8124);

console.log('Server running at 8124');