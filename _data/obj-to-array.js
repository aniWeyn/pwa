const ajaxURL = 'latest-posts.json';
console.log(ajaxURL);
let output;
let resLength;
var data;
// fetch returns a promise and a 'stream'.
// We need to convert stream to JSON
fetch(ajaxURL)
	.then(function(response) {
		// can only be consumed once so clone if using twice
		// var clone = response.clone();
		console.log('response will have a body stream');
		console.log(response);
		// 404 is not an error just no responseult
		if (response.ok) {
			// must have return to pass responseult to next .then
			return response;
		} else {
			console.log('ERROR');
			return;
		}
	})
	// response.body is a readable stream so we must use the json/textr/blob
	// function to read it.
	.then(function(response) {
		return response.json();
	})
	.then((result) => {
		// Prints result from `response.json()`
		console.log('json() converts stream to JSON');
		console.log(result);
		var resLength = result.length;
		console.log('Number of items: ' + resLength);
		// ES6 Template Literals
		let outputData = `<h1>URL: ${ajaxURL}</h1>`;
		for (i = 0; i < resLength; i++) {
			//Split for ease of understanding
			outputData += 'ID: ' + result[i].id + ' Title: <b>' + result[i].title.rendered;
			outputData += '</b> written by: <b>' + result[i].authorName.toUpperCase() + '</b>';
			//outputData += " Title: " + result[i].title.rendered;
			outputData += '<br>';
		}
		const main = document.getElementById('mainContent');
		main.innerHTML = outputData;
	})
	.catch(function(error) {
		console.error(error);
	});
