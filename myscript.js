chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
			console.log(details.url);
			var url = details.url;
			var valval = sendToClarifi(url);
			//alert("woohooo: "+valval);
			// if((details.url.indexOf("images")!= -1 || details.url.indexOf("jpg")!= -1 || details.url.indexOf("png")!= -1) && valval){
			if(valval){
				//alert("URL22");
				// url = "https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif";
				url = "icon2.jpg";
			}
return {
    redirectUrl: url
  };        },
        {urls: ["<all_urls>"], types:["image"]},
        ["blocking"]);
var badDict = {};
var badwords = {};

 chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
			var referer = ""; var accept = ""; var host ="";
          for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'Accept') {
				accept = details.requestHeaders[i].value;
            }else if (details.requestHeaders[i].name === 'Referer') {
				referer = details.requestHeaders[i].value;
            }else if (details.requestHeaders[i].name === 'Host') {
				host = details.requestHeaders[i].value;
            }
          }
		  //alert(referer.split('/')[2]+"   "+details.url.split('/')[2]);
		  if(accept.indexOf("text/html")!=-1 && referer.split('/')[2]!=details.url.split('/')[2]){
			  //alert("in header");
			  loadTxtFile(function (text) {
				badwords = text.split('\n');
				for (var i=0; i<badwords.length; i++) {
				badDict[badwords[i]] = true;
			}
			//alert(badDict);
			});
		  }
			  
          return {requestHeaders: details.requestHeaders};
        },
        {urls: ["<all_urls>"]},
        ["blocking", "requestHeaders"]);
		

function loadTxtFile(callback) {   
	var rawFile = new XMLHttpRequest();
	//rawFile.overrideMimeType("application/txt");
    rawFile.open("GET", "https://raw.githubusercontent.com/ShashwathKumar/WebSanitizer/master/bad-words.txt", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState == 4 && rawFile.status == "200")
        {
            var text = rawFile.responseText;
            callback(rawFile.responseText);
        }
    }

    rawFile.send(null);
}  




//var badWords = text.split("\n");

/*var srcList = $('img').get();

console.log(srcList);*/

// setTimeout(function(){
//     console.log("THIS IS");
// }, 5000);

/*for (var i=0;i<srcList.length;i++) {
	//console.log(srcList[i]);
	sendToClarifi(srcList[i].src);
}*/
//sendToClarifi('https://drscdn.500px.org/photo/155841899/q%3D80_m%3D1500/65a62d508837176ed2b6eae08943980d');

  
function sendToClarifi(link){
	var isProfaneVar = false;
	//alert("send to clarifi"+link);
	//alert("https://api.clarifai.com/v1/tag/?url=" + link+'&access_token=OYr34p8u15BmBQhSwNUJozU9jvijF0');
  $.ajax({
  type: "GET",
  //url: "https://api.clarifai.com/v1/tag/?url=" + link+'&access_token=3MdWoUytY3a3QuXxdBl7oRkwqyql7A',
  url: "https://api.clarifai.com/v1/tag/?url=" + link+'&access_token=OYr34p8u15BmBQhSwNUJozU9jvijF0',
  success: function(data){
  	//console.log(response.results[0].result.tag.classes);
	//alert("success: "+data.results[0].result.tag.classes);
    if (isProfane(data.results[0].result.tag.classes)=='true'){
		//alert("there");
    	console.log("PROFANE");
    	console.log(link);
		isProfaneVar = 'true';
		//return 'true';
    }
    else{
    	//alert("furr");
	}
  },
  dataType: "json",
  cache: false,
  async: false
});
return isProfaneVar;
}

function isProfane(tagList) {
	count = 0;
	for (i=0;i<tagList.length;i++){
		//alert(tagList[i]+"  "+badDict[tagList[i]]);
		if (badDict[tagList[i]]){
			//alert("condition is met");
			//alert(tagList[i]);
			count += 1;
			if (count >= 1)
				return 'true';
		}
	}
	return 'false';
}

