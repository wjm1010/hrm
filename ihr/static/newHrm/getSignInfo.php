<?php
header("Content-type:text/html;charset=utf-8");
error_reporting(0);
include "./config.php";

$code = $_GET['code'];
$rand = $_GET['rand'];

$start_time = $_GET['s'];
$end_time   = $_GET['e'];

if ((md5($start_time.$end_time) != $code) || ($end_time<time()) || ($start_time>time())) $link_fail = 1;

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta name="msapplication-tap-highlight" content="no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
    <title>海风教育通用培训签到</title>
   	<meta http-equiv="X-UA-Compatible" content="IE=8,IE=9,IE=10,IE=11">
	<link rel="stylesheet" type="text/css" href="//cdn-vip.hfjy.top/newtpl/static/hrm/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="//cdn-vip.hfjy.top/newtpl/static/hrm/css/common.css">
	<link rel="stylesheet" type="text/css" href="//cdn-vip.hfjy.top/newtpl/static/hrm/css/proxy.css">
	<link rel="shortcut icon" href="//www.hfjy.com/favicon.ico" type="image/x-icon" />
	<script type="text/javascript" src="//cdn-vip.hfjy.top/newtpl/static/hrm/js/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="//cdn-vip.hfjy.top/newtpl/static/hrm/js/bootstrap.min.js"></script>
	<style type="text/css">
		html,body,.wrap,.wt-candidate-main,.wt-contentWrap,.wt-leftWrap,#wt-content,.wt-main-bottom { height: 100%; }
		body{
      		background-color: rgb(234, 233, 233);
			background: rgb(234, 233, 233);
		}
		.wt-main-bottom{
			width: 500px;
		    height: 600px;
		    background: #fff;
		    margin: auto;
		    position: absolute;
		    top: 0;
		    left: 0;
		    right: 0;
		    bottom: 0;
		}
		.mt20 {
		    padding-left: 62px;
		    line-height: 40px;
		}
		.title {
		    font-size: 20px;
		    text-align: center;
		    font-weight: 600;
		    line-height: 50px;
		    padding: 20px 0px;
		}
		@media only screen and (min-width: 751px){
			.mt20 {
			    width: 460px;
			}
		}
		@media screen and (max-width: 500px) {
		    .mt20{
		    	padding-left: 2px;
		    }
		    .wt-main-bottom,.note{width: 97%;}
		}
		.sign_result{
			padding-top: 80px;
			text-align: center;
			background: #eeeff4;
			font-size: 18px;
			height: 100%;
		}
	</style>
</head>
  <body class="container container-fluid">

	<!--内容开始-->
    <div class="content <?php echo $link_fail?'none':''; ?>">
		<div class="wt-main-bottom" style="padding-top: 30px;">
			<div class="mt20 pr">
				<img src="./image/logo.png" style="padding-left: 10px; padding-top: 20px;">
			</div>
			<div class="title">
				<strong>培训签到</strong>
			</div>
			<form id="form">
				<div class="mt20 pr">
					<div class="h40 w30 inlblock tc f14 pa left0 lh40">1.您的姓名（请填写真实姓名）<span class="text_red">*</span></div>
					<div class="wt-position-item inlblock" style="border: none;">
						<input type="text" name="trainSignName" class="train_name form-control" placeholder="真实姓名" required='required'>
					</div>
					<div class="error_info">请输入姓名</div>
				</div>
				<div class="mt20 pr">
					<div class="h40 w30 inlblock tc f14 pa left0 lh40">2.您的手机号码（请填写报名时候的手机号码，否则可能会签到失败）<span class="text_red">*</span></div>
					<div class="wt-position-item inlblock" style="border: none;">
						<input type="text" name="trainSignPhone" class="train_phone form-control" placeholder="请输入手机号码" required='required' value="">
					</div>
					<div class="error_info">请输入正确的手机号码</div>
				</div>
				<br>
				<input type="hidden" name="s" value="<?php echo $start_time;?>" />
				<input type="hidden" name="e" value="<?php echo $end_time;?>" />
				<input type="hidden" name="rand" value="<?php echo $rand;?>" />
				<input type="hidden" name="code" value="<?php echo $code;?>" />
				<div class="mt20 pr"  style="padding-bottom: 20px;margin-top: 30px;">
					<div class="btn">
			        	<div class="wt-searchBar-btn1 wt-next-step" style="background: #378eed;">提交</div>
			        </div>
		        </div>
			</form>
	    </div>

	    <div id="wt-addPosition-step2" class="wt-step overhidden none">
			<div class="">
				<div id="postStepScroll" style="overflow-y: auto;height: 100px;text-align: center;line-height: 100px;">
						正在提交...
				</div>
			</div>
		</div>
	</div>

	<!--签到成功-->
	<div class="sign_success sign_result none">
		<p><img src="./image/right.png" width="53"></p>
		<p style="margin-top: 20px;">签到成功，感谢您的配合~</p>
	</div>

	<!--签到失败-->
	<div class="sign_fail sign_result none">
		<p><img src="./image/wrong.png" width="53"></p>
		<p style="margin-top: 20px;">签到失败，</p>
		<p>系统内可能没有录入您的信息，</p>
		<p>请联系您的HR~</p>
	</div>

	<!--重复签到-->
	<div class="sign_repeat sign_result none">
		<p><img src="./image/right.png" width="53"></p>
		<p style="margin-top: 20px;">您已经提交过该表单，</p>
		<p>请勿重复提交哦~</p>
	</div>

	<!--链接失效-->
	<div class="link_faild sign_result <?php echo $link_fail?'':'none'; ?>">
		<p><img src="./image/wrong.png" width="53"></p>
		<p style="margin-top: 20px;">很抱歉，</p>
		<p>该链接已失效~</p>
	</div>

	<div id="_DialogBGDiv" style="background-color: rgb(51, 51, 51); position: fixed; left: 0px; top: 0px; opacity: 0.4; width: 100%; height: 974px; z-index: 100;">
	</div>
	<script type="text/javascript">
		$(function(){
			var _host  = "<?php echo HRM_API;?>";
			var _is_sign = false;
			$('.wt-next-step').click(function(){
				if (!$('.train_name').val()) {
					alert('请输入姓名');
					return;
				}
				if (!$('.train_phone').val()) {
					alert('请输入手机号');
					return;
				}

				if( _is_sign ) return;
				_is_sign = true;

		        $.ajax({
	                type: 'post',
	                data: $('#form').serialize(),
	                url: _host + '/resume/public/signIn.html',
	                success: function(data) {
	                	var data  = eval('('+data+')')
	                	if(data.code != '0x000000')
	                	{
	                		alert(data.message);
	                		// $('.sign_result,.content').hide();
	                		// $('.sign_fail').show();
	                	}
	                	// else if (data.isok == 2){
	                	// 	$('.sign_result,.content').hide();
	                	// 	$('.sign_repeat').show();
	                	// }
	                	else{
	                		$('.sign_result,.content').hide();
	                		$('.sign_success').show();
	                	}
	                    _is_sign = false;
	                }
	            });
			})
		})

		//判断签名
	    function checkSign(sign) {
	        var re = /^(\u672c\u4eba\u4ee5\u4e0a\u5df2\u786e\u8ba4)\s+[\u4E00-\u9FA5\w]+\s+\d{4}(\s+)?\u5e74(\s+)?\d{1,2}(\s+)?\u6708(\s+)?\d{1,2}(\s+)?\u65e5$/g;
	        if (re.test(sign)) return true;
	        return false;
	    }

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
	</script>
</body>
</html>
