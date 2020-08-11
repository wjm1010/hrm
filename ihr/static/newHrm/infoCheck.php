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

$next_link = "./hfjyProxy.php?code=".$code."&signature=".$signature;

if($resumeInfo['resumeProperty'] == '全职'){
  header("Location:./infoCheck2.php?signature=".$signature."&code=".$code);
  exit;
}

if($resumeInfo['resumeProperty'] == '实习'){
  header("Location:./infoCheck3.php?signature=".$signature."&code=".$code);
  exit;
}

$grade= $resumeInfo['resumeGrade'];
$name = $resumeInfo['resumeName'];
$email= $resumeInfo['resumeInfoEmail'];

$time = date('Y年m月d日');
$isHighSchool = ($resumeInfo['resumeSchool']=='清华大学' || $resumeInfo['resumeSchool']=='北京大学') ? 1 : 0;

$grade = ($grade == '小学')? 1 : (($grade == '初中')? 2 : 3);
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
	<link rel="shortcut icon" href="//www.hfjy.com/favicon.ico" type="image/x-icon" />
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
									<br>
									<div style="border-top: 1px solid #D3D3D3;width: 90%;margin-left: 5%;color: #333;"></div>
									<div class="mt20 pr" style="line-height: 30px;">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red"></span>&nbsp;课时费:</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;">&nbsp;如：面试时提交的是小学语文的视频,并且通过面试,则选择"小学".</div>
									</div>
									<div class="mt20 pr" style="margin-top: 0px;">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;授课年级（即通过面试的年级）及课时费:</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<select name="teacherClass" class="form-control teacher_class" required='required' onchange="getPrice(this.value)">
												<option value="">请选择授课年级</option>
												<?php if (!$isHighSchool) { ?>
												<option value="1" <?php echo ($grade == '小学')?"selected":"";?>>小学</option>
												<?php } ?>
												<option value="2" <?php echo ($grade == '初中')?"selected":"";?>>初中</option>
												<option value="3" <?php echo ($grade == '高中')?"selected":"";?>>高中</option>
                                                <option value="4" <?php echo ($grade == '初中')?"selected":"";?>>少儿</option>
											</select>
										</div>
										<div class="wt-position-item inlblock" style="border: none;margin-top: 10px;">
											<select name="teacherPrice" class="form-control teacher_price" required='required'>
												<option value="">请选择课时费</option>
											</select>
										</div>
										<div class="error_info">请选择课时、课时费</div>
									</div>
									<br>
									<div style="border-top: 1px solid #D3D3D3;width: 90%;margin-left: 5%;color: #333;"></div>
									<div class="mt20 pr" style="line-height: 30px;">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red"></span>&nbsp;兼职时间:</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;">&nbsp;海风会优先给每周5小时以上的老师排课。若低于5小时，培训考核会更加严格，排课也会相应后延。</div>
									</div>
									<div class="mt20 pr" style="margin-top: 0px;">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;每周可安排固定课时:</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<select name="weekHours" class="form-control week_hour" required='required'>
												<option value="2">5-10小时（推荐）</option>
												<option value="3">10小时及以上</option>
											</select>
										</div>
										<div class="error_info">每周可安排固定课时</div>
									</div>
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;兼职时间:</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<select name="partTime" class="form-control part_time" required='required'>
												<option value="">请选择兼职时间</option>
												<option value="2">6-12个月（推荐）【注：兼职协议签订均以三年时间为准，具体人事变动操作后续可参考部门下发的教师岗位制度】</option>
												<option value="3">12个月及以上</option>
											</select>
										</div>
										<div class="error_info">兼职时间</div>
									</div>
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;寒暑期兼职:</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;寒暑假也属于半年的兼职要求之内，期间需要正常授课。</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<select name="holidayOk" class="form-control holiday_ok" required='required'>
												<option value="1">可以正常带课（推荐）</option>
												<option value="2">无法带课（无法入职）</option>
											</select>
										</div>
									</div>
									<br>
									<div style="border-top: 1px solid #D3D3D3;width: 90%;margin-left: 5%;color: #333;"></div>
									<div class="mt20 pr" style="line-height: 30px;">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red"></span>&nbsp;培训事宜:</div>
									</div>
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;是否能够安排培训期:</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;培训期最长为10个工作日，培训日总计3-4个工作日，培训时间共计5-8小时左右。</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<select name="trainingOk" class="form-control training_ok" required='required'>
												<option value="1">是</option>
												<option value="2">否（无法入职）</option>
											</select>
										</div>
									</div>
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;通用培训时间:</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;通用培训进行一次约两个小时，保证电脑在线，具体日期请和HR确认。</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<select name="normalTrainingOk" class="form-control normal_training_ok" required='required'>
												<option value="1">可以安排</option>
												<option value="2">无法安排（无法入职）</option>
											</select>
										</div>
									</div>
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;学科培训时间:</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;学科培训进行1-2次，安排在工作日工作时间，每次2-3小时，结束后有试讲考核。(<span style="color: red;">注意：学科培训要求在参加通培后的两周内参加，如果无法满足，需重新参加面试，请合理安排培训时间</span>)</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<select name="subjectTrainingOk" class="form-control subject_training_ok" required='required'>
												<option value="1">可以安排</option>
												<option value="2">无法安排（无法入职）</option>
											</select>
										</div>
									</div>
									<div class="mt20 pr computer_check">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;个人条件确认:</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;请确认以下情况符合，如有问题将影响您的后续入职。</div>
										<div class="wt-position-item inlblock" style="border: none;">
											<input type="checkbox" class="com_env_status" name="computerCheck1[]" value="1">网络稳定 （为保证课堂质量，海风建议使用流畅的有线网络；若使用无线网络，需要网络稳定且带宽2M以上）<br>
											<input type="checkbox" class="com_env_status" name="computerCheck1[]" value="2">授课环境整洁安静，家中无婴幼儿哭闹<br>
											<input type="checkbox" class="com_env_status" name="computerCheck1[]" value="3">Win7及以上系统（苹果系统需要安装双系统），视频、摄像头设备完好（接受视频授课），QQ分享屏幕功能完好<br>
											<input type="checkbox" class="com_env_status" name="computerCheck1[]" value="4">无毕业旅行、论文答辩、拍毕业照等事项需要延迟培训<br>
											<input type="checkbox" class="com_env_status" name="computerCheck1[]" value="4">近3个月内无出国、考研、考公务员、即将入公校、公校带毕业班等规划<br>
										</div>
										<div class="error_info computer_check_error">请确认电脑设备</div>
									</div>
									<br>
									<div style="border-top: 1px solid #D3D3D3;width: 90%;margin-left: 5%;color: #333;"></div>
									<div class="mt20 pr" style="line-height: 30px;">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red"></span>&nbsp;培训协议书:</div>
									</div>
									<div class="mt20 pr">
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;以下为海风学科部授课规则相关提示，教师阅读后确认无异议，请在下方签字</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;1.       每周固定授课时间：</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;平日周中晚+周末满足5个小时</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;寒暑假期间的兼职教师：</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;A：周一至周日至少满足10小时的课量（上不封顶），每天连续性可授课最好</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;B：除了寒暑假期间的课程，假期过后还可以继续周末带课</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;C：不接受寒暑期短期打工的教师</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;2.       课程结束后配合完成课后报告：试听课诊断报告、一对一教学计划表、课后反馈表等，同时协助进行与家长的沟通服务工作。</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;3.       入职前需要确认：</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;培训期：1-2周</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;一、通用培训：培训1次，2.5个小时左右，具体培训时间以人事通知为准，培训后需接受考核</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;二、学科培训：涉及各学科知识点，培训1到2次，每次30分钟至1个小时.(<span style="color: red;">注意：学科培训要求在参加通培后的两周内参加，如果无法满足，需重新参加面试，请合理安排培训时间</span>)</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;三、试讲考核：根据教师能力试讲1-3次不等，每次1个小时</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;教师需考虑：培训期是否能配合在周中完成通用培训、学科培训、试讲考核三个环节。培训期内不允许请假、拖延时间、无故缺席。</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;</div>
										<div class="h40 w30 inlblock tc f14 pa left0 lh40" style="color: #7F8C8D;margin-top: 0px;">&nbsp;<input id="u93_input train_sign" type="radio" name="train_sign"><?php echo '以上制度条款本人确认无异议，本人进入培训期以及后期工作中将会遵守学科产品中心的各项规章制度，热爱教学、关爱学生，用爱和科技普及因材施教。'.$name.' '.$time;?><span class="text_red">*</span></div>
										<div style="display: none;">
										<input type="text" class="form-control sign" name="sign" value="<?php echo '本人以上已确认'.$name.' '.$time;?>">
										</div>
										<div class="error_info sign_error">请勾选协议书</div>
									</div>

									<div class="mt20 pr"  style="padding-bottom: 20px;">
										<div class="btn">
								        	<div class="wt-searchBar-btn1 wt-next-step" style="background: #378eed;">已确认, 下一步</div>
								        </div>
							        </div>
							        <input type="hidden" class="code" name="code" value="<?php echo $code;?>" >
							        <input type="hidden" class="code" name="computerCheck" value="1,2,3,4,5" >
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
		var _is_high_school = <?php echo $isHighSchool;?>;
		$(function(){
			var _host  = "<?php echo HRM_API;?>";
			var _grade = "<?php echo $grade;?>";
			var _next_link = "<?php echo $next_link;?>";
			if( _grade ) getPrice(_grade);
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
		                	if(data.code != '0x000000')
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

		function getPrice( v ){
			if( !v ) return;
			if( v == 1 || v == 4) $('.teacher_price').html("<option value='1'>55-75元/小时（竞赛类为80元/小时）</option>");
			if( v == 2 ) {
				if (_is_high_school) $('.teacher_price').html("<option value='4'>【初三】100元/小时</option>");
				else $('.teacher_price').html("<option value='2'>55-80元/小时（竞赛类为80元/小时）</option>");
			}
			if( v == 3 ) {
				if (_is_high_school) $('.teacher_price').html("<option value='5'>100元/小时（高三110元/小时，竞赛类为120元/小时</option>");
				else $('.teacher_price').html("<option value='3'>65-85元/小时（高三为75-95元/小时；竞赛类为120元/小时）</option>");
			}
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
