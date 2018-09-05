var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, description, control){
	return `
		<!doctype html>
		<html>
		<head>
			<title>WEB1 - ${title}</title>
			<meta charset="utf-8">
		</head>
		<body>
			<h1><a href="/">WEB</a></h1>
			${list}

			${control}

			<h2>${title}</h2>
			${description}
		</body>
		</html>
	`;
}
function templatList(filelist){
	var list = '<ul>';
	for(var i=0, l=filelist.length; i<l; i++) {
		list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
	}
	list += '<ul>';
	return list;
}


var app = http.createServer(function(request,response){
		var _url = request.url;
		var queryData = url.parse(_url, true).query;
		var pathname = url.parse(_url, true).pathname;

		if(pathname === '/'){
			if(queryData.id === undefined){
				fs.readdir('./data', function(error, filelist){
					var title='Welcome';
					var description='Hello, Node.js';
					var list = templatList(filelist);
					var template = templateHTML(title, list, description, `<a href="/create">create</a>`);
					response.writeHead(200);
					response.end(template);
				});
			} else {
				fs.readdir('./data', function(error, filelist){
					fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
						var title = queryData.id;
						var list = templatList(filelist);
						var template = templateHTML(title, list, description, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
						response.writeHead(200);
						response.end(template);
					});
				});
			}
		} else if(pathname === '/create') {
			fs.readdir('./data', function(error, filelist){
				var title='create';
				var list = templatList(filelist);
				var template = templateHTML(title, list, `
					<form action="/create_process" method="post">
						<div>
							<input type="text" name="title" placeholder="title">
						</div>
						<div>
							<textarea name="description" placeholder="description"></textarea>
						</div>
						<div>
							<input type="submit">
						</div>
					</form>
					`, '');
				response.writeHead(200);
				response.end(template);
			});
		} else if(pathname === '/create_process') {
			var body = '';

			request.on('data', function(data){
				body = body + data;
			});
			request.on('end', function(){
				var post = qs.parse(body); //객체로 데이터를 받음
				var title = post.title;
				var description = post.description;
				fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
					response.writeHead(302, {Location: `/?id=${title}`});
					response.end();
				})
			});
		} else if(pathname === '/update') {
			fs.readdir('./data', function(error, filelist){
				fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
					var title = queryData.id;
					var list = templatList(filelist);

					var template = templateHTML(title, list, `
						<form action="/update_process" method="post">
							<input type="hidden" name="id" value="${title}">
							<div>
								<input type="text" name="title" placeholder="title" value="${title}">
							</div>
							<div>
								<textarea name="description" placeholder="description">${description}</textarea>
							</div>
							<div>
								<input type="submit">
							</div>
						</form>`,
						`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);

					response.writeHead(200);
					response.end(template);
				});
			});
		} else {
			response.writeHead(404);
			response.end('Not Found!');
		}
});
app.listen(3000);