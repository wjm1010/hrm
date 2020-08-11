/*
* @Author: xuxu
* @Date:   2018-10-29 16:34:05
* @Last Modified by:   海风教育
* @Last Modified time: 2018-11-09 16:43:12
*/
var host = "http://dev-hrm.hfjy.com";
// var host = window.location.host;
host = host.replace('hrm', 'hrmapi');

//获取url参数
function GetRequest() {   
   var url = location.search; //获取url中"?"符后的字串   
   var theRequest = new Object();   
   if (url.indexOf("?") != -1) {   
      var str = url.substr(1);   
      strs = str.split("&");   
      for(var i = 0; i < strs.length; i ++) {   
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
      }   
   }   
   return theRequest;   
}

//弹出层居中
function popup(popupName){ 
	var _scrollHeight = $(document).scrollTop(),//获取当前窗口距离页面顶部高度 
	_windowHeight = $(window).height(),//获取当前窗口高度 
	_windowWidth = $(window).width(),//获取当前窗口宽度 
	_popupHeight = popupName.height(),//获取弹出层高度 
	_popupWeight = popupName.width();//获取弹出层宽度 
	_posiTop = (_windowHeight - _popupHeight)/2-50; 
	_posiLeft = (_windowWidth - _popupWeight)/2; 
	popupName.css({"left": _posiLeft + "px","top":_posiTop + "px","display":"block"});//设置position 
}

 function checkPhone( phone ){
     if(!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(phone))) return false;
     return true;
 }
 function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}
 function sendCode(phone){
     var result = 1;
     $.ajax({
　　　　　　url: '/newHrm/handleData.php',
　　　　　　type: 'post',
　　　　　　data: {'phone':phone, 'type':'sendCode'},
            async: false,
　　        success: function(ret){
               result = eval('('+ret+')');
　　　　　  }
 　　}, 'json');
     return result;
 }

 function checkCode(phone,code){
     var result = 1;
     $.ajax({
　　　　　　url: '/upload/checkCode.php',
　　　　　　type: 'post',
         async: false,
　　　　　　data: {'phone':phone,'code':code},
　　        success: function(ret){
             result = trimStr(ret);
　　　　　  }
 　　});
     return result;
 }