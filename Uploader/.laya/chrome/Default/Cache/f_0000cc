window.onerror=function(){return true;}
$(function(){	
	//顶部菜单导航鼠标滑过效果
    $('.navList li').hover(function()
    {
        var listTwo =  $(this).children().hasClass('two');
        if( listTwo == true)
        {
            $(this).toggleClass('hover');
        };
    });
//结束
/*
if($(document).find('h1.YaHei').length){
if($('h1.YaHei').html().length > 26) $('h1.YaHei').css({'font-size':'14px'});
}
*/
});

function dw(s) { document.write(s); }
function getid(objectId) { 
     if(document.getElementById && document.getElementById(objectId)) { 
       return document.getElementById(objectId); 
     }  
     else if (document.all && document.all(objectId)) { 
      return document.all(objectId); 
     }  
     else if (document.layers && document.layers[objectId]) { 
       return document.layers[objectId]; 
     }  
     else { 
       return false; 
    } 
}
function doClick_down(o){
	 o.className="current";
	 var j;
	 var id;
	 var e;
	 for(var i=1;i<=4;i++){
	   id ="tool"+i;
	   j = getid(id);
	   e = getid("d_con"+i);
	   if(id != o.id){
	   	 j.className="";
	   	 e.style.display = "none";
	   }else{
		e.style.display = "block";
	   }
	 }
	 }
//让Mozilla支持innerText
try{
	HTMLElement.prototype.__defineGetter__
	(
	"innerText",
	function ()
	{
		var anyString = "";

		var childS = this.childNodes;
			for(var i=0; i<childS.length; i++)
			{
				if(childS[i].nodeType==1)
				anyString += childS[i].tagName=="BR" ? '\n' : childS[i].innerText;
				else if(childS[i].nodeType==3)
				anyString += childS[i].nodeValue;
			}
			return anyString;
	}
	); 
}
catch(e){}
//更改字体大小
var status0='';
var curfontsize=10;
var curlineheight=18;
function turnsmall(){
  if(curfontsize>10){
    getid('content').style.fontSize=(--curfontsize)+'pt';
	getid('content').style.lineHeight=(--curlineheight)+'pt';
  }
}
function turnbig(){
  if(curfontsize<28){
    getid('content').style.fontSize=(++curfontsize)+'pt';
	getid('content').style.lineHeight=(++curlineheight)+'pt';
  }
}
function runCode()  //定义一个运行代码的函数，
{
	if(1 == arguments.length)
		try{event = arguments[0];}catch(e){}
  var code=(event.target || event.srcElement).parentNode.childNodes[0].value;//即要运行的代码。
  var newwin=window.open('','','');  //打开一个窗口并赋给变量newwin。
  newwin.opener = null // 防止代码对论谈页面修改
  newwin.document.write(code);  //向这个打开的窗口中写入代码code，这样就实现了运行代码功能。
  newwin.document.close();
}
//运行代码
function runEx(cod1)  {
	 cod=getid(cod1)
	  var code=cod.value;
	  if (code!=""){
		  var newwin=window.open('','','');  
		  newwin.opener = null 
		  newwin.document.write(code);  
		  newwin.document.close();
	}
}
//复制代码
function doCopy2(ID) { 
	if (isIE){
		 textRange = getid(ID).createTextRange(); 
		 textRange.execCommand("Copy");
alert('复制成功');
	}
	else{
		 alert("此功能只能在IE上有效");
	}
}
function isIE() {
            if (!!window.ActiveXObject || "ActiveXObject" in window)
                return true;
            else
                return false;
} 

//复制代码
function doCopy(id){
	var testCode=getid(id).innerText;
	if(copy2Clipboard(testCode)!=false){
	if (isIE){
	var rng = document.body.createTextRange();
	rng.moveToElementText(getid(id));
	rng.scrollIntoView();
	rng.select();
	rng.collapse(false);
	alert("代码已经复制到粘贴板! ");
	}	
	}else{
 alert("请选中文本，使用 Ctrl+C 复制!");
 }
}
function copycode(obj){
	var testCode=obj.innerText;
	if(copy2Clipboard(testCode)!=false){
	if (isIE){
	var rng = document.body.createTextRange();
	rng.moveToElementText(obj);
	rng.scrollIntoView();
	rng.select();
	rng.collapse(false);
	alert("代码已经复制到粘贴板! ");
	}	
	}else{
 alert("请选中文本，使用 Ctrl+C 复制!");
 }
}
copy2Clipboard=function(txt){
	if(window.clipboardData){
window.clipboardData.clearData();
		window.clipboardData.setData("Text",txt);
	}
	else if(navigator.userAgent.indexOf("Opera")!=-1){
		window.location=txt;
	}
	else if(window.chrome){
	alert("请选中文本，使用 Ctrl+C 复制!");
	}
	else if(window.netscape){
		try{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		}
		catch(e){			//alert("您的firefox安全限制限制您进行剪贴板操作，请打开’about:config’将signed.applets.codebase_principal_support’设置为true’之后重试，相对路径为firefox根目录/greprefs/all.js");
			return false;
		}
		var clip=Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if(!clip)return;
		var trans=Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if(!trans)return;
		trans.addDataFlavor('text/unicode');
		var str=new Object();
		var len=new Object();
		var str=Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var copytext=txt;str.data=copytext;
		trans.setTransferData("text/unicode",str,copytext.length*2);
		var clipid=Components.interfaces.nsIClipboard;
		if(!clip)return false;
		clip.setData(trans,null,clipid.kGlobalClipboard);
	}
}
function getClipboard(){if(window.clipboardData){return(window.clipboardData.getData('text'));}else
{if(window.netscape){try
{netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");var clip=Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);if(!clip){return;}var trans=Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);if(!trans){return;}trans.addDataFlavor("text/unicode");clip.getData(trans,clip.kGlobalClipboard);var str=new Object();var len=new Object();trans.getTransferData("text/unicode",str,len);}catch(e){alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js");return null;}if(str){if(Components.interfaces.nsISupportsWString){str=str.value.QueryInterface(Components.interfaces.nsISupportsWString);}else
{if(Components.interfaces.nsISupportsString){str=str.value.QueryInterface(Components.interfaces.nsISupportsString);}else
{str=null;}}}if(str){return(str.data.substring(0,len.value/2));}}}return null;}
//另存代码
function doSave(obj) {
if (isIE){
	var winname = window.open('', '_blank', 'top=10000');
	winname.document.open('text/html', 'replace');
	winname.document.writeln(obj.value);
	winname.document.execCommand('saveas','','code.htm');
	winname.close();}
	else{
	alert("此功能只能在IE上有效");
	}
}
//复制文本
function copyIdText(id)
{
  copy( getid(id).innerText,getid(id) );
}
function copyIdHtml(id)
{
  copy( getid(id).innerHTML,getid(id) );
}

function copy(txt,obj)
{       
   if(window.clipboardData) 
   {        
        window.clipboardData.clearData();        
        window.clipboardData.setData("Text", txt);
        alert("复制成功！")
        if(obj.style.display != 'none'){
	  var rng = document.body.createTextRange();
	  rng.moveToElementText(obj);
	  rng.scrollIntoView();
	  rng.select();
	  rng.collapse(false);  
       }
   }
   else
    alert("请选中文本，使用 Ctrl+C 复制!");
}
function editarea(oTA,iMinRow,iStep)
{
	oTA.rows=iMinRow=="" || isNaN(iMinRow) || parseInt(iMinRow)==0 ? oTA.rows+iStep : Math.max(parseInt(iMinRow),oTA.rows-iStep);
}
var jsbd2="cnomi";
var MediaTemp=new Array()
function MediaShow(strType,strID,strURL,intWidth,intHeight)
{
	var tmpstr
	if (MediaTemp[strID]==undefined) MediaTemp[strID]=false; else MediaTemp[strID]=!MediaTemp[strID];
	if(MediaTemp[strID]){
			if ( isIE )	{
	         	getid(strID).outerHTML = '<div id="'+strID+'"></div>'
			}
			else
			{
	         	getid(strID).innerHTML = ''
			}

		document.images[strID+"_img"].src="/skin/blue/images/mm_snd.gif" 		
		getid(strID+"_text").innerHTML="在线播放"	
	}else{
		document.images[strID+"_img"].src="/skin/blue/images/mm_snd_stop.gif" 		
		getid(strID+"_text").innerHTML="关闭在线播放"
		switch(strType){
			case "swf":
				tmpstr='<div style="height:6px;overflow:hidden"></div><object codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+intWidth+'" height="'+intHeight+'"><param name="movie" value="'+strURL+'" /><param name="quality" value="high" /><param name="AllowScriptAccess" value="never" /><embed src="'+strURL+'" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'+intWidth+'" height="'+intHeight+'" /></object>';
				break;
			case "wma":
				tmpstr='<div style="height:6px;overflow:hidden"></div><object classid="CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95"  id="MediaPlayer" width="450" height="70"><param name=""howStatusBar" value="-1"><param name="AutoStart" value="False"><param name="Filename" value="'+strURL+'"></object>';
				break;
			case "wmv":
				tmpstr='<div style="height:6px;overflow:hidden"></div><object classid="clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,0,02,902" type="application/x-oleobject" standby="Loading..." width="'+intWidth+'" height="'+intHeight+'"><param name="FileName" VALUE="'+strURL+'" /><param name="ShowStatusBar" value="-1" /><param name="AutoStart" value="true" /><embed type="application/x-mplayer2" pluginspage="http://www.microsoft.com/Windows/MediaPlayer/" src="'+strURL+'" autostart="true" width="'+intWidth+'" height="'+intHeight+'" /></object>';
				break;
			case "rm":
				tmpstr='<div style="height:6px;overflow:hidden"></div><object classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="'+intWidth+'" height="'+intHeight+'"><param name="SRC" value="'+strURL+'" /><param name="CONTROLS" VALUE="ImageWindow" /><param name="CONSOLE" value="one" /><param name="AUTOSTART" value="true" /><embed src="'+strURL+'" nojava="true" controls="ImageWindow" console="one" width="'+intWidth+'" height="'+intHeight+'"></object>'+
                '<br/><object classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="'+intWidth+'" height="32" /><param name="CONTROLS" value="StatusBar" /><param name="AUTOSTART" value="true" /><param name="CONSOLE" value="one" /><embed src="'+strURL+'" nojava="true" controls="StatusBar" console="one" width="'+intWidth+'" height="24" /></object>'+'<br /><object classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="'+intWidth+'" height="32" /><param name="CONTROLS" value="ControlPanel" /><param name="AUTOSTART" value="true" /><param name="CONSOLE" value="one" /><embed src="'+strURL+'" nojava="true" controls="ControlPanel" console="one" width="'+intWidth+'" height="24" autostart="true" loop="false" /></object>';
				break;
			case "ra":
				tmpstr='<div style="height:6px;overflow:hidden"></div><object classid="clsid:CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA" id="RAOCX" width="450" height="60"><param name="_ExtentX" value="6694"><param name="_ExtentY" value="1588"><param name="AUTOSTART" value="true"><param name="SHUFFLE" value="0"><param name="PREFETCH" value="0"><param name="NOLABELS" value="0"><param name="SRC" value="'+strURL+'"><param name="CONTROLS" value="StatusBar,ControlPanel"><param name="LOOP" value="0"><param name="NUMLOOP" value="0"><param name="CENTER" value="0"><param name="MAINTAINASPECT" value="0"><param name="BACKGROUNDCOLOR" value="#000000"><embed src="'+strURL+'" width="450" autostart="true" height="60"></embed></object>';
				break;
			case "qt":
				tmpstr='<div style="height:6px;overflow:hidden"></div><embed src="'+strURL+'" autoplay="true" loop="false" controller="true" playeveryframe="false" cache="false" scale="TOFIT" bgcolor="#000000" kioskmode="false" targetcache="false" pluginspage="http://www.apple.com/quicktime/" />';
		}
		getid(strID).innerHTML = tmpstr;
	}
		getid(strID+"_href").blur()
}

function setCookie(name, value)		//cookies设置JS
{
	var argv = setCookie.arguments;
	var argc = setCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	if(expires!=null)
	{
		var LargeExpDate = new Date ();
		LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));
	}
	document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString()))+"; path=/;";
}

function getCookie(Name)			//cookies读取JS
{
	var search = Name + "="
	if(document.cookie.length > 0) 
	{
		offset = document.cookie.indexOf(search)
		if(offset != -1) 
		{
			offset += search.length
			end = document.cookie.indexOf(";", offset)
			if(end == -1) end = document.cookie.length
			return unescape(document.cookie.substring(offset, end))
		 }
	else return ""
	  }
}
function addBookmark(title,url) {
if (window.sidebar) { 
window.sidebar.addPanel(title, url,""); 
} else if( isIE ) {
window.external.AddFavorite( url, title);
} else if( window.opera && window.print ) {
return true;
}
}
function setHome(url) 
{ 
if (isIE){ 
document.body.style.behavior='url(#default#homepage)'; 
document.body.setHomePage(url); 
}else if (window.sidebar){ 
if(window.netscape){ 
try{ 
netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); 
}catch (e){ 
alert( "该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true" ); 
} 
} 
if(window.confirm("你确定要设置"+url+"为首页吗？")==1){ 
var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch); 
prefs.setCharPref('browser.startup.homepage',url); 
} 
} 
}
function big(o)
{
var zoom=parseInt(o.style.zoom, 10)||100;zoom+=window.event.wheelDelta/12;
if (zoom>0) o.style.zoom=zoom+'%';
return false; 
}

function flash(ur,w,h){  
document.write('<object classid="clsid:D27CDB6E-AE6D-11CF-96B8-444553540000" id="obj1" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" border="0" width="'+w+'" height="'+h+'">');  
document.write('<param name="movie" value="'+ur+'">');  
document.write('<param name="quality" value="high"> ');  
document.write('<param name="wmode" value="transparent"> ');  
document.write('<param name="menu" value="false"> ');  
document.write('<embed src="'+ur+'" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" name="obj1" width="'+w+'" height="'+h+'" quality="High" wmode="transparent">');  
document.write('</embed>');  
document.write('</object>');  
} 

function addLoadEvent(func) {
    var oldonload = window.onload;
    if(typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}
function closeWindow() { 
window.open('','_parent',''); 
window.close(); 
}
function copyUserHomeToClipBoard(){
var clipBoardContent = document.URL;
if(copy2Clipboard(clipBoardContent)!=false){
	alert("复制成功，请粘贴到你的QQ/MSN上推荐给你的好友！\r\n\r\n内容如下：\r\n" + clipBoardContent);
	}
}
function noad2010(){
	if (getCookie("jb51ad2010")=="noad"){
		alert('广告已经关闭，请刷新下页面即可看到效果。');
		}else{	
	setCookie("jb51ad2010","noad",180);
alert("恭喜,已成功屏蔽广告,只要不清空Cookie,您都不会再受广告困扰！");
}}
function yesad2010(){
setCookie("jb51ad2010","yesad",180);
alert("您已经恢复到脚本之家广告版，谢谢您对我们的支持！");
}
function switchad(adname,adtpname){
if (getid(adname) && getid(adtpname)){
getid(adname).innerHTML=getid(adtpname).innerHTML;
getid(adtpname).innerHTML='';
}
}

function getArrayItems(arr, num) {
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    var return_array = new Array();
    for (var i = 0; i<num; i++) {
        if (temp_array.length>0) {
            var arrIndex = Math.floor(Math.random()*temp_array.length);
            return_array[i] = temp_array[arrIndex];
            temp_array.splice(arrIndex, 1);
        } else {
            break;
        }
    }
    return return_array;
}


function base64decode(str){
	var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c1 == -1);
        if (c1 == -1) 
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c2 == -1);
        if (c2 == -1) 
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) 
                return out;
            c3 = base64DecodeChars[c3];
        }
        while (i < len && c3 == -1);
        if (c3 == -1) 
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) 
                return out;
            c4 = base64DecodeChars[c4];
        }
        while (i < len && c4 == -1);
        if (c4 == -1) 
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);

$(function(){
    var hide=$('#wxHide');
    var show=$('#wxShow');
    var ic=$('#icon');
    hide.hover(function() {
        show.show();
    },function() {
        show.hide();
    });

    var btn=$('#navHide');
    var box=$('#navBox');
    btn.hover(function() {
        box.show();
    },function(){
        box.hide();
    });

    var odiv=$('#hide');

    if(odiv.length > 0){
        var btna=odiv.find('li');
        var showa=odiv.find('div');
        
        btna.each(function(i,ele_b){
            $(ele_b).mouseover(function(){
                if(!$(ele_b).hasClass('active')){
                    for(j = 0; j < btna.length; j++){
                        if(i == j){
                            $(showa[j]).show();
                            $(btna[j]).addClass('active');
                        }else{
                            $(showa[j]).hide();
                            $(btna[j]).removeClass('active');
                        }
                    }
                }
            });
        });
    }
});