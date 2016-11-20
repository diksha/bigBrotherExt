// content.js
//alert("Hello from your Chrome extension!")
//var firstHref = $("a[href^='http']").eq(0).attr("img");
var newVal = [];
var images = document.getElementsByClassName('userContentWrapper _5pcr');
for (var i = 0, l = images.length; i < l; i++) {
	console.log(images[i].innerHTML);
//console.log(images[i].innerHTML);
photos = images[i].innerHTML.split("photo.php?fbid=")[1];
if(photos!=undefined){
	postId = photos.split("&")[0];
	newVal[postId] = images[i];
}
post = images[i].innerHTML.split("posts/");
//console.log(post[1]);
if(post[1]!=undefined){
postId = post[1].split("\" ")[0];
newVal[postId] = images[i];
}
//console.log(postId[0]);
$.ajax({
					url: "https://172.30.8.117:8080/posts/postid/" + postId,
					type: "GET",
					// Request body
			}).done(function(data){
				//console.log(data);
				if(data.length!=0) {
					var id = data[0].id;
					id = id.split("_")[1];
					newVal[id].style.display="none";
				}
			}).fail(function(err) {
				console.log(err);
			});

//images[i].style.display="none";
}

window.addEventListener('scroll', function() {
	console.log('scroll');
	var images = document.getElementsByClassName('userContentWrapper _5pcr');
	for (var i = 0, l = images.length; i < l; i++) {
		console.log(images[i].innerHTML);
	//console.log(images[i].innerHTML);
	photos = images[i].innerHTML.split("photo.php?fbid=")[1];
	if(photos!=undefined){
		postId = photos.split("&")[0];
		newVal[postId] = images[i];
	}
	post = images[i].innerHTML.split("posts/");
	//console.log(post[1]);
	if(post[1]!=undefined){
	postId = post[1].split("\" ")[0];
	newVal[postId] = images[i];
	}
	//console.log(postId[0]);
	$.ajax({
						url: "https://172.30.8.117:8080/posts/postid/" + postId,
						type: "GET",
						// Request body
				}).done(function(data){
					//console.log(data);
					if(data.length!=0) {
						var id = data[0].id;
						id = id.split("_")[1];
						newVal[id].style.display="none";
					}
				}).fail(function(err) {
					console.log(err);
				});

	//images[i].style.display="none";
	}
});

// var srcList = $('img').get();
// console.log(srcList);
//
// var badwords = ["lingerie", "sexy", "nude", "pantie", "underwear", "erotic",
// 				"blood", "horror", "offense",
// 				"liquor", "alcohol", "wine"];
// var badDict = {};
// for (var i=0; i<badwords.length; i++) {
// 	badDict[badwords[i]] = true;
// }
//
//
// if (srcList.length==1){
// 	if(sendToClarifi(srcList[0].src)){
// 		//srcList[0].src = "https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif";
// 		$('body').append('<img style="-webkit-user-select: none" src="https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif">');
// 		$('img').attr('src',"https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif");
// 		console.log(srcList[0].src);
// 	}
// }
//
// function sendToClarifi(link){
// 	var isProfaneVar = false;
// 	//alert("send to clarifi"+link);
// 	//alert("https://api.clarifai.com/v1/tag/?url=" + link+'&access_token=OYr34p8u15BmBQhSwNUJozU9jvijF0');
//   $.ajax({
//   type: "GET",
//   url: "https://api.clarifai.com/v1/tag/?url=" + link+'&access_token=7RrbcxdQkZduFcfi5KwmmDKZxzOYVC',
//   success: function(data){
// 	//alert("success: "+data.results[0].result.tag.classes);
//     if (isProfane(data.results[0].result.tag.classes)=='true'){
// 		//alert("there");
//     	console.log("PROFANE");
//     	console.log(link);
// 		isProfaneVar = 'true';
// 		//return 'true';
//     }
//     else{
//     	//alert("furr");
// 	}
//   },
//   dataType: "json",
//   cache: false,
//   async: false
// });
// console.log(isProfaneVar);
// return isProfaneVar;
// }
//
// function isProfane(tagList) {
// 	count = 0;
// 	for (i=0;i<tagList.length;i++){
// 		//alert(tagList[i]+"  "+badDict[tagList[i]]);
// 		if (badDict[tagList[i]]){
// 			//alert("condition is met");
// 			//alert(tagList[i]);
// 			count += 1;
// 			if (count >= 1)
// 				return 'true';
// 		}
// 	}
// 	return 'false';
// }


//---------------------------------------------------------

/*
 chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
			var referer = ""; var accept = ""; var host ="";
          for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'Accept') {
				accept = details.requestHeaders[i].value;
            }else if (details.requestHeaders[i].name === 'Referer') {
				referer = details.requestHeaders[i].value;
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
*/
