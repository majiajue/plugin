// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

document.write("<scri"+"pt src='js/jquery.js'></scr"+"ipt>");

var isShowVCode = false;
var version;
var client = "Plugin";

function prevalidVCode() {
	var vCode = document.getElementById('vCode').value;
    if (vCode != '' && vCode.length == 4)
    {
    	console.log("begin validate vCode");
    	
    	chrome.cookies.get({"url":"http://tt.showkey.tv","name":"t_vcode"},function(cookie) {
	        //cookie.value
	        if (cookie === null)
	        {
		        console.log("cookie not exist");
	        }
	        else
	        {
		        var t = cookie.value;
		        var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					console.log(xhr);
					if (xhr.readyState==4 && xhr.status==200)
					{
						var resp = JSON.parse(xhr.responseText);
						//console.log(resp);
						if (resp === true)
						{
							console.log("验证码验证成功")
							
							chrome.cookies.remove({"url": "http://tt.showkey.tv", "name": "t_vcode"});
							document.getElementById('vCode').innerHTML = "";
							document.getElementById('vCodeDiv').style.display = "none";
							
							isShowVCode = false;
							prevalidPinCode();
							
						}
						else
						{
						console.log("验证码验证失败");
						isShowVCode = true;
							getVCode();
						}
					}
				}
				xhr.onerror = function(){
					console.log("请求失败");
				}
				//'/joyplus/checkvcode?t='+$.cookie('t_vcode')+'&vcode='+vcode,
				var requestURL = 'http://tt.showkey.tv/joyplus/checkvcode?t=' + t + '&vcode=' + vCode + '&client=' + client +'&version=' + version;
				xhr.open("GET", requestURL, true);
				xhr.send(null);
	        }
		});
    }
}

function getVCode() {
						//请求验证码
						var t_vcode = new Date().valueOf();
						var req = new XMLHttpRequest();
						req.onreadystatechange = function() {
							//console.log(req.responseText);
							if (req.readyState==4 && req.status==200)
							{
								document.getElementById('vCodeDiv').style.display = "block";
								$('#vCodeImg').attr("src", "http://tt.showkey.tv/joyplus/vcode?t="+t_vcode);
								isShowVCode = true;
								console.log(t_vcode);
								var str_vcode = t_vcode.toString();
								chrome.cookies.set({"url":"http://tt.showkey.tv","name":"t_vcode","value":str_vcode});
							}
						}
						req.onerror = function(){
							console.log("send request fail");
						}
						///joyplus/checkvcode?t='+$.cookie('t_vcode')+'&vcode='+vcode,
						var requestURL1 = 'http://tt.showkey.tv/joyplus/vcode?t=' + t_vcode + '&client=' + client +'&version=' + version;
						console.log(requestURL1);
						req.open("GET", requestURL1, true);
						req.send(null);
}

function prevalidPinCode() {
	console.log("prevalidPinCode called");
    var pincode = document.getElementById('pingCode').value;
    if (pincode != '' && pincode.length == 6 && !isShowVCode)
    {
    
    	chrome.cookies.get({"url":"http://tt.showkey.tv","name":"t_vcode"},function(cookie) {
	        
	        if (cookie === null)
	        {
		        console.log("begin validate pin code");
		   		document.getElementById('errorMsg').innerHTML = '验证中...';
		 	    document.getElementById('pingCode').disabled = true;
		
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
				console.log(xhr);
					if (xhr.readyState==4 && xhr.status==200)
					{
						var resp = JSON.parse(xhr.responseText);
						//console.log(resp.status);
						if (resp.status === true)
						{
							console.log("PIN码正确");
							
							document.getElementById('vCodeDiv').style.display = "none";
							document.getElementById('errorMsg').innerHTML = 'PIN码验证成功';
							document.getElementById('errorMsg').style.color = "#8ac";
							document.getElementById('pin_statue_empty').style.display = "none";
							document.getElementById('pin_statue_success').style.display = "block";
							document.getElementById('pin_statue_fail').style.display = "none";
		
							setVideoUrl();
							//var resp = eval('('+ xhr.responseText + ')');
							//var resp = JSON.parse(xhr.responseText);
							var device = resp.device;
							var channel =  resp.channel;
							var mac = resp.mac;
							var md5 = resp.md5_code;
		
			        		chrome.cookies.set({"url":"http://tt.showkey.tv","name":"md5_code","value":md5});
						}
						else
						{
							console.log("PIN码错误");
							document.getElementById('errorMsg').innerHTML = 'PIN码验证失败,请重新输入';
							document.getElementById('errorMsg').style.color = "#f00";
							document.getElementById('pin_statue_empty').style.display = "none";
							document.getElementById('pin_statue_success').style.display = "none";
							document.getElementById('pin_statue_fail').style.display = "block";
		
							document.getElementById('pingCode').disabled = false;
							
							if (resp.vcode === false)
							{
								getVCode();
							}
						}
		
					}
		
				}
				xhr.onerror = function(){
					console.log("请求失败");
					document.getElementById('pin_statue_empty').style.display = "none";
					document.getElementById('pin_statue_success').style.display = "none";
					document.getElementById('pin_statue_fail').style.display = "block";
					document.getElementById('errorMsg').innerHTML = '验证请求失败';
					document.getElementById('pingCode').disabled = false;
				}
				var requestURL = 'http://tt.showkey.tv/preValidatePinCode?pin_code=' + pincode + '&client=' + client +'&version=' + version;
		
				xhr.open("GET", requestURL, true);
				xhr.send(null);
	        }
	        else
	        {
	        	console.log(cookie.value);
				document.getElementById('vCodeDiv').style.display = "block";
				$('#vCodeImg').attr("src", "http://tt.showkey.tv/joyplus/vcode?t="+cookie.value);
	        }
		});
	}
}

function vCodeImgTouchUp() {
	getVCode();
}

function unbindBtnUp(){
	document.getElementById('unbindImage').src = "http://tvupdate.joyplus.tv/showkeyextension/images/unbind_n.png";
	//chrome.cookies.get({"url":"http://tt.yue001.com:8080","name":"md5_code"}
	chrome.cookies.remove({"url": "http://tt.showkey.tv", "name": "md5_code"});
	document.getElementById('pin_confirmed').style.display="none";
	document.getElementById('inputPinCode').style.display="block";
	document.getElementById('currentUrl').value = "";

}
function unbindBtnDown(){
	document.getElementById('unbindImage').src = "http://tvupdate.joyplus.tv/showkeyextension/images/unbind_f.png";
}
function unbindBtnOut(){
	document.getElementById('unbindImage').src = "http://tvupdate.joyplus.tv/showkeyextension/images/unbind_n.png";
}

function confirmBtnOut(){
	document.getElementById('confirmBtnImage').src = "http://tvupdate.joyplus.tv/showkeyextension/images/confirm_btn.png";
}

function confirmBtnDown(){
	document.getElementById('confirmBtnImage').src = "http://tvupdate.joyplus.tv/showkeyextension/images/confirm_btn_active.png";
}

function confirmBtnUp(){
	document.getElementById('confirmBtnImage').src = "http://tvupdate.joyplus.tv/showkeyextension/images/confirm_btn.png";

	var inputurl = document.getElementById('currentUrl').value;
	//funshion;youku；sina；56；QQ；pptv,letv,sohu,iqiyi
	if((inputurl.indexOf("letv") >= 0)
	|| (inputurl.indexOf("sohu") >= 0)
	||(inputurl.indexOf("iqiyi") >= 0)
	||(inputurl.indexOf("funshion") >= 0)
	||(inputurl.indexOf("youku") >= 0)
	||(inputurl.indexOf("sina") >= 0)
	||(inputurl.indexOf("56") >= 0)
	||(inputurl.indexOf("QQ") >= 0)
	||(inputurl.indexOf("pptv") >= 0)
	||(inputurl.indexOf("ed2k://")>=0)
	||(inputurl.indexOf("magnet:")>=0))
	{
        chrome.cookies.get({"url":"http://tt.showkey.tv","name":"md5_code"},function(cookie) {
	        var md5Code = cookie.value;

	        var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState==4 || xhr.status==200)
				{
					console.log(xhr.responseText);
					if (xhr.responseText == '"allsuccess"')
					{
						document.getElementById('url_empty').style.display="none";
						document.getElementById('url_correct').style.display="block";
						document.getElementById('url_wrong').style.display="none";
						document.getElementById('pushResultMsg').innerHTML = '视频推送成功';
						document.getElementById('pushResultMsg').style.color = "#8ac";
					}
					else
					{
						document.getElementById('url_empty').style.display="none";
						document.getElementById('url_correct').style.display="none";
						document.getElementById('url_wrong').style.display="block";
						document.getElementById('pushResultMsg').innerHTML = '解析视频地址失败';
						document.getElementById('pushResultMsg').style.color = "#f00";
					}
				}
				else
				{
					console.log("fail");
					document.getElementById('url_empty').style.display="none";
					document.getElementById('url_correct').style.display="none";
					document.getElementById('url_wrong').style.display="block";
					document.getElementById('pushResultMsg').innerHTML = '解析视频地址失败';
					document.getElementById('pushResultMsg').style.color = "#f00";
				}
			}
			xhr.onerror = function(){
				console.log("error");
				document.getElementById('url_empty').style.display="none";
				document.getElementById('url_correct').style.display="none";
				document.getElementById('url_wrong').style.display="block";
				document.getElementById('pushResultMsg').innerHTML = '解析视频地址失败';
				document.getElementById('pushResultMsg').style.color = "#f00";
			}
			var curTime = new Date().valueOf();
			var requestURL = 'http://tt.showkey.tv/switchScreen?md5_code='+md5Code+'&url='+inputurl+'&msg_type=5' + '&time=' + curTime  + '&client=' + client +'&version=' + version;
			console.log(requestURL);
			xhr.open("GET", requestURL, true);
			xhr.send(null);

        });
    }
    else
    {
    	document.getElementById('url_empty').style.display="none";
		document.getElementById('url_correct').style.display="none";
		document.getElementById('url_wrong').style.display="block";
		document.getElementById('pushResultMsg').innerHTML = '请输入磁力链、电驴或视频网址';
		document.getElementById('pushResultMsg').style.color = "#f00";
    }
}


function validateMD5Code(md5){

var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState==4 || xhr.status==200)
			{
				if (xhr.responseText !== '"fail"')
				{
					console.log("验证成功");
					var pin_confirmed = document.getElementById('pin_confirmed');
					var inputPin = document.getElementById('inputPinCode');
					pin_confirmed.style.display = 'block';
					inputPin.style.display = 'none';
					setVideoUrl();
				}
				else
				{
					console.log("验证失败");
					document.getElementById('pin_confirmed').style.display="none";
					document.getElementById('inputPinCode').style.display="block";
				}
			}
			else
			{
				console.log("验证失败");
				document.getElementById('pin_confirmed').style.display="none";
				document.getElementById('inputPinCode').style.display="block";
			}
		}
		xhr.onerror = function(){
			document.getElementById('pin_confirmed').style.display="none";
			document.getElementById('inputPinCode').style.display="block";
		}
		var requestURL = 'http://tt.showkey.tv/preValidateMd5Code?md5_code=' + md5 + '&client=' + client +'&version=' + version;
		xhr.open("GET", requestURL, true);
		xhr.send(null);

}

function setVideoUrl(){

	var inputurl;
	chrome.tabs.getSelected(null, function(tab) {
	  	//console.log(tab);
	  	inputurl = tab.url;
	  	//console.log(inputurl);
		if((inputurl.indexOf("letv") >= 0)
		|| (inputurl.indexOf("sohu") >= 0)
		||(inputurl.indexOf("iqiyi") >= 0)
		||(inputurl.indexOf("funshion") >= 0)
		||(inputurl.indexOf("youku") >= 0)
		||(inputurl.indexOf("sina") >= 0)
		||(inputurl.indexOf("56") >= 0)
		||(inputurl.indexOf("QQ") >= 0)
		||(inputurl.indexOf("pptv") >= 0))
		{
			document.getElementById('currentUrl').value = tab.url;
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {

  chrome.cookies.get({"url":"http://tt.showkey.tv","name":"md5_code"},function(cookie) {
	        if (cookie == null)
	        {
	        	console.log("Cookie 为空");
		        document.getElementById('pin_confirmed').style.display="none";
				document.getElementById('inputPinCode').style.display="block";
	        }
	        else
	        {
	        	console.log("存在Cookie,验证MD5:" + cookie.value);
		        validateMD5Code(cookie.value);
	        }
  });


  var pingCode = document.getElementById('pingCode');
  pingCode.addEventListener('keyup', prevalidPinCode);
  pingCode.addEventListener('blur', prevalidPinCode);
  
  var vCode = document.getElementById('vCode');
  vCode.addEventListener('keyup', prevalidVCode);
  vCode.addEventListener('blur', prevalidVCode);

  var vCodeImg = document.getElementById('vCodeImg');
  vCodeImg.addEventListener('mouseup', vCodeImgTouchUp);

  var unbindBtn = document.getElementById('unbindBtn');
  unbindBtn.addEventListener('mouseup', unbindBtnUp);
  unbindBtn.addEventListener('mouseout', unbindBtnOut);
  unbindBtn.addEventListener('mousedown', unbindBtnDown);

  var confirmBtn = document.getElementById('confirmA');
  confirmBtn.addEventListener('mouseup', confirmBtnUp);
  confirmBtn.addEventListener('mouseout', confirmBtnOut);
  confirmBtn.addEventListener('mousedown', confirmBtnDown);

  function getVersion(callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', 'manifest.json');
        xmlhttp.onload = function (e) {
            var manifest = JSON.parse(xmlhttp.responseText);
            callback(manifest.version);
        }
        xmlhttp.send(null);
}

// to use

getVersion(function (ver) { version = ver; console.log(version);});
/*
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
*/
});

