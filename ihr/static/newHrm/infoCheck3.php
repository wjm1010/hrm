<?php
header("Content-type:text/html;charset=utf-8");
//error_reporting(0);
include "./CurlNew.php";
include "./config.php";

$signature = $_GET['signature']?$_GET['signature']:$_GET['amp;signature'];
$code = $_GET['code'];

$resume_id = base64_decode(htmlspecialchars($code));
if( !is_numeric($resume_id) || (md5(HRM_TOKEN_SALT.$resume_id) != $signature) ) exit('无效的code');

$info = Curl::post(HRM_API.'/resume/public/getTrainInfoName.html', ['code'=>$code, 'signature'=>$signature]);
$info = json_decode($info, true);

if ($info['code'] == '0x000000' && $info['data']) $resumeInfo =  $info['data'][0];
else exit('信息不存在');

$next_link = "./hfjyProxy2.php?code=".$code."&signature=".$signature;

if($resumeInfo['resumeProperty'] == '兼职'){
  header("Location:./infoCheck.php?signature=".$signature."&code=".$code);
  exit;
}

if($resumeInfo['resumeProperty'] == '全职'){
  header("Location:./infoCheck2.php?signature=".$signature."&code=".$code);
  exit;
}

$grade= $resumeInfo['resumeGrade'];
$gradeText= $resumeInfo['resumeGrade'];
$name = $resumeInfo['resumeName'];
$email= $resumeInfo['resumeInfoEmail'];
$subject= $resumeInfo['resumeSubject'];

$time = date('Y年m月d日');
$isHighSchool = ($resumeInfo['resumeSchool']=='清华大学' || $resumeInfo['resumeSchool']=='北京大学') ? 1 : 0;

$grade = ($grade == '小学' || $grade == '少儿')? 1 : (($grade == '初中')? 2 : 3);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta name="msapplication-tap-highlight" content="no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
    <title>入培信息确认</title>
   	<meta http-equiv="X-UA-Compatible" content="IE=8,IE=9,IE=10,IE=11">
	<link rel="stylesheet" type="text/css" href="./proxy.css">
	<link rel="stylesheet" type="text/css" href="//cdn-vip.hfjy.top/newtpl/static/hrm/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="//cdn-vip.hfjy.top/newtpl/static/hrm/css/common.css">
	<script type="text/javascript" src="//cdn-vip.hfjy.top/newtpl/static/hrm/js/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="//cdn-vip.hfjy.top/newtpl/static/hrm/js/bootstrap.min.js"></script>

</head>
  <body class="container container-fluid">

	<!--内容开始-->
    <div class="content">
	    <div class="wrap">
  			<div class="wt-candidate-main mt15 pr mb20">
  				<div class="wt-contentWrap">
  					<div class="wt-leftWrap">
  						<div id="wt-content">
							<div class="wt-main-bottom" style="">
								<div class="pr">
									<img src="../upload/image/01.png" class="img-responsive center-block">
								</div>
								<form id="form">
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;">&nbsp;您好！恭喜您通过海风教育视频面试，在进行培训之前，还需要您填写并确认以下信息：</div>
									</div>
									<div class="mt20 pr" style="line-height: 30px;">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red"></span>&nbsp;基本信息:</div>
									</div>
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;姓名:</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<input type="text" name="trainName" class="train_name form-control" placeholder="真实姓名" required='required' value="<?php echo $name;?>">
										</div>
										<div class="error_info">请输入姓名</div>
									</div>
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;邮箱:</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<input type="text" name="trainEmail" class="train_email form-control" placeholder="请确认邮箱有效性与正确性" required='required' value="<?php echo $email;?>">
										</div>
										<div class="error_info">请确认邮箱有效性</div>
									</div>
                                    <div class="mt20 pr">
                                        <div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;年级:<?php echo $gradeText;?></div>
                                    </div>
                                    <div class="mt20 pr">
                                        <div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;学科:<?php echo $subject;?></div>
                                    </div>
                                    <div class="mt20 pr">
                                        <div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;课时费:</div>
                                        <select name="teacherPrice" class="form-control teacher_price" required='required' onchange="getPrice(this.value)">
                                            <?php if ($gradeText=='少儿') { ?>
                                                <option value="6" selected>少儿课酬为55元/h</option>
                                            <?php } ?>
                                            <?php if ($gradeText=='小学') { ?>
                                                <option value="7" selected>小学课酬为55元/h；小学竞赛类课酬为80元/h.</option>
                                            <?php } ?>
                                            <?php if ($gradeText=='初中') { ?>
                                                <option value="8" selected>初一初二课酬为55元/h，初三课酬为60元/h；初中竞赛类课酬为80元/h。</option>
                                            <?php } ?>
                                            <?php if ($gradeText=='高中') { ?>
                                                <option value="9" selected>高中课酬为65元/h（高三补贴10元/h）；高中竞赛类课酬为120元/h。</option>
                                            <?php } ?>
                                        </select>
                                    </div>
									<br>
									<div class="mt20 pr computer_check">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;电脑设备确认:</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;请确认以下设备完好，若设备有问题则无法入职。</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<input type="checkbox" class="com_env_status" name="computerCheck1[]" value="1">网络稳定 （为保证课堂质量，海风建议使用流畅的有线网络；若使用无线网络，需要网络稳定且带宽2M以上）<br>
											<input type="checkbox" class="com_env_status" name="computerCheck1[]" value="2">授课环境保证安静<br>
											<input type="checkbox" class="com_env_status" name="computerCheck1[]" value="3">视频、摄像头设备完好（接受视频授课）<br>
											<input type="checkbox" class="com_env_status" name="computerCheck1[]" value="4">Win7及以上系统（苹果系统需要安装双系统）
										</div>
										<div class="error_info computer_check_error">请确认电脑设备</div>
									</div>
									<br>
									<div style="border-top: 1px solid #D3D3D3;width: 90%;margin-left: 5%;color: #333;"></div>
									<div class="mt20 pr" style="line-height: 30px;">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red"></span>&nbsp;培训协议书:</div>
									</div>
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;以下为海风学科部授课规则相关提示，教师阅读后确认无异议，请在下方确认提交：</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #000;margin-top: 0px;text-align: center;font-size: 16px;">&nbsp;<strong>海风教育授课规章确认细则（实习）</strong></div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;1.  实习期间每周固定授课时间：</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;周一到周五晚+周六日：至少5小时固定授课时间</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;2.  成为全职教师之后每周固定授课时间：</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;<span style="color: #000;">非寒暑假</span>：周六、日8:00-21:00; 周一至周四任选两个工作日晚上19:00-22:00；周五17:00-22:00 授课，午餐和晚餐各有一个小时的吃饭时间，特殊课程另行协调。一个月平均授课124课时（小时）。</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;<span style="color: #000;">寒暑假</span>： 周一至周日工作六天，休一天。每日8:00-21:00；午餐和晚餐各有一个小时的吃饭时间，特殊课程另行协调8月份平均授课240课时（小时）。</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;3. 授课分试听课、正课，教师每节课后需完成：正课课后反馈表、试听课诊断报告、一对一教学计划表。试听课课后需与家长沟通反馈教学情况同时跟进报班</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;4. 入职前需要确认：</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;  培训期：1-2周</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;一、通用培训：培训1次，具体培训时间以人事通知为准。涉及公司企业文化、试听课程、教师岗位制度，培训重要，必须参加，通用培训后需完成考核试卷。</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;二、学科培训：涉及各学科知识点、考情考纲等讲解，单科培训1次，具体以主管通知为准。</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;三、试讲考核：教师与主管进行培训后的试讲考核，能力优秀者试讲1-2次，能力较弱者试讲2-3次，具体以主管通知为准。</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;教师需考虑：培训期是否能配合在周中完成通用培训、学科培训、试讲考核三个环节。培训期不允许请假、拖延时间、无故缺席。</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #000;margin-top: 0px;">&nbsp;特别提示（出现以下情况需考虑会否影响培训期或后续授课环节）：</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;1.<span style="color: red;">应届毕业生</span>：论文准备、毕业班毕业旅行、是否有考公务员打算、是否有入公校意愿、是否已申请国外大学、是否已有别单位发出offer.</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;2.<span style="color: red;">各年级阶段教师</span>：要求授课使用视频功能，请确定带宽和视频设备完好，确保安静的授课环境。</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;3.不能同时在2家及以上教育机构任兼职，或实习岗位</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;以上规则及特别提示请候选教师认真阅读，如无问题，确保自己的实际情况可以配合以上条例</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;<input id="u93_input train_sign" type="radio" name="train_sign"><?php echo '本人以上已确认'.$name.' '.$time;?><span class="text_red">*</span></div>
										<div style="display: none;">
										<input type="text" class="form-control sign" name="sign" value="<?php echo '本人以上已确认'.$name.' '.$time;?>">
										</div>
										<!-- <div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;入职OFFER稍后会发送到您的邮箱，请注意查收并仔细查看。</div> -->
										<div class="error_info sign_error">请勾选协议书</div>
									</div>

									<div class="mt20 pr"  style="padding-bottom: 20px;">
										<div class="btn">
								        	<div class="wt-searchBar-btn1 wt-next-step" style="background: #378eed;">已确认, 下一步</div>
								        </div>
							        </div>
							        <input type="hidden" class="code" name="computerCheck" value="1,2,3,4" >
							        <input type="hidden" class="code" name="code" value="<?php echo $code;?>" >
							        <input type="hidden" class="sign_code" name="signature" value="<?php echo $signature;?>" >
								</form>
							</div>
  						</div>
  					</div>
  				</div>
  			</div>
	    </div>

	    <div id="wt-addPosition-step2" class="wt-step overhidden none">
			<div class="">
				<div id="postStepScroll" style="overflow-y: auto;height: 100px;text-align: center;line-height: 100px;">
						正在提交...
				</div>
			</div>
		</div>
	</div>
	<div id="_DialogBGDiv" style="background-color: rgb(51, 51, 51); position: fixed; left: 0px; top: 0px; opacity: 0.4; width: 100%; height: 974px; z-index: 100;">
	</div>
	<script type="text/javascript">
		$(function(){
			var _host  = "<?php echo HRM_API;?>";
			var _grade = "<?php echo $grade;?>";
			var _next_link = "<?php echo $next_link;?>";

			$('.wt-next-step').click(function(){
				var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
				var ref = $('#form').find("[required='required']");
				var ref2 = $('#form').find("[name='computerCheck1[]']");
				var _is_check = $('input:radio[name="train_sign"]:checked').val();
				var _complete = true;
				var _complete2 = true;

		        $(ref).each(function(e){
		            if ( $(this).val() == '' )
		            {
		            	_complete = false;
		                $(this).stop()
						   .animate({ left: "-10px" }, 100).animate({ left: "10px" }, 100)
						   .animate({ left: "-10px" }, 100).animate({ left: "10px" }, 100)
						   .animate({ left: "0px" }, 100)
						   .addClass("required");
						$(this).focus();
						$(this).parent().parent().find('.error_info').show();
		                return false;
		            }else{
		            	$(this).parent().parent().find('.error_info').hide();
		            	if( $(this).hasClass('train_email') && !reg.test($(this).val())){
		            		_complete = false;
		            		$(this).parent().parent().find('.error_info').show();
		            		$(this).focus();
		            		return false;
		            	}
		            	$(this).removeClass('red');
		            }
		        })

		        if( _complete ){

		            $('.error_info').hide();

		            if( !_is_check ){
		            	$('.sign_error').show();
		            	return false;
		            }else $('.sign_error').hide();

			    	$(ref2).each(function(e){
			            if ( !$(this).is(':checked') ) _complete2 = false;
			        });

			        if( !_complete2 ){
			        	var body = $('html,body');
	                    var scroll_1 = $('.computer_check');
		            	$('.computer_check_error').show();
		            	body.animate({scrollTop:scroll_1.offset().top - 100 }, 2000);
		            	return false;
		            }


			        $.ajax({
		                type: 'post',
		                data: $('#form').serialize(),
		                url: _host + '/resume/public/trainInfoFirst.html',
		                success: function(data) {
		                	var data  = eval('('+data+')')
		                	if(!data.code != '0x000000')
		                	{
		                		alert(data.message);
		                		return;
		                	}
		                	alert('操作成功');
		                    location.href = _next_link;
		                	return;
		                }
		            });
		        }
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
