<?php
header("Content-type:text/html;charset=utf-8");
error_reporting(0);
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

if($resumeInfo['resumeProperty'] == '全职'){
  header("Location:./hfjyProxy2.php?signature=".$signature."&code=".$code);
  exit;
}

if($resumeInfo['resumeProperty'] == '实习'){
  header("Location:./hfjyProxy3.php?signature=".$signature."&code=".$code);
  exit;
}

$grade= $resumeInfo['resumeGrade'];
$name = $resumeInfo['resumeName'];
$phone= $resumeInfo['resumePhone'];

?>
<html>
	<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  <meta name="msapplication-tap-highlight" content="no" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
		<meta charset="utf-8">
		<title>兼职教师入培协议及附件</title>
		<meta name="renderer" content="webkit">
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<style type="text/css">
      body {background-color: #b8b8b8;max-width: 800px;margin: 0px auto;}
			.btn {
			    color: #fff;
			    display: inline-block;
			    width: 120px;
			    height: 40px;
			    line-height: 40px;
			    border-radius: 3px;
			    font-size: 14px;
			    text-align: center;
			    background: #378eed;
			}
			.primary_button{
				padding-left: 20%;
			}
      .success{display: none;}
      .img-responsive{
        display: block;
        margin-right: auto;
        margin-left: auto;
        max-width: 100%;
        height: auto;
      }
      .proxy{ padding: 0px 8%;}
		</style>
	</head>

	<body>
	<div id="base" style="background-color: #fff;">

      <div class="proxy">
        <div class="pr">
          <img src="/upload/image/02.png" class="img-responsive center-block">
        </div>
        <form id="form">
        <div id="u86" class="ax_default" data-width="694" data-height="2226">
          <div id="u87" class="ax_default shape">
            <div id="u87_div" class=""></div>

            <div id="u88" class="text" style="display:none; visibility: hidden">
              <p><span></span></p>
            </div>
          </div>
        </div>

        <div id="u89" class="ax_default _一级标题" style="padding-left: 10%;">
          <div id="u89_div" class=""></div>
          <div id="u90" class="text">
            <h1><span>兼职教师入培协议及附件</span></h1>
          </div>
        </div>

        <div id="u91" class="ax_default _文本段落">
          <div id="u91_div" class=""></div>
          <div id="u92" class="text">
            <p>
  	          <span><input id="u93_input train_proxy" type="radio" name="trainProxy" value="1"></span>
  	          <span>本人已查阅《兼职教师入培协议及附件》，并同意该培训协议中所有条款，确认无异议</span>
            </p>
          </div>
        </div>
        <input type="hidden" name="code" value="<?php echo $code;?>">
        <input type="hidden" name="signature" value="<?php echo $signature;?>">
        </form>
        <div id="u95" class="ax_default primary_button">
          <div id="u95_div" class=""></div>
          <div id="u96" class="text" style="top: 8px; transform-origin: 48.5px 9px 0px;">
            <p class="btn sure">已确认, 下一步</p>
          </div>
        </div>

        <div id="u97" class="ax_default _文本段落">
          <div id="u97_div" class=""></div>
          <div id="u98" class="text">
            <p><span>以下位协议具体内容：</span></p>
          </div>
        </div>

        <div id="u99" class="ax_default _文本段落">
          <div id="u99_div" class=""></div>
          <div id="u100" class="text">
            <p><span>甲方（培训单位）：上海风创信息咨询有限公司</span></p><p><span>乙方（培训人员）：</span><span style="color:#FF0000;"><?php echo $name;?></span><span></span></p><p><span>姓名： <?php echo $name;?> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机号：<?php echo $phone;?></span></p><p><span>部门：学科产品中心 &nbsp;岗位：兼职教师 &nbsp;&nbsp;入职时间：已和HR确认</span></p><p><span>根据《中华人民共和国劳动法》，甲、乙双方在平等互利、协商一致的基础上，签订以下培训协议；本协议是对甲、乙双方签订的《劳动合同书》（以下简称“劳动合同”）的补充和修正，与劳动合同具有同等法律效力。</span></p><p><span>第一条：培训服务事项</span></p><p><span>1. 甲方根据公司发展的需要，可以为乙方安排岗位培训，乙方应积极参加培训，努力学习并通过所设考试。</span></p><p><span>第二条：培训时间与方式</span></p><p><span>1. 培训时间：自培训开始至培训结束，最长不超过10日，（培训仅安排在工作日，具体以实际培训实施时间为准）。</span></p><p><span>2. 培训方式：远程培训。</span></p><p><span>第三条：培训项目、培训内容及培训考核标准</span></p><p><span>详见本协议附件（由培训实施部门针对培训岗位具体情况拟定）。</span></p><p><span>第四条：甲方责任与义务</span></p><p><span>1. 负责培训内容及目标的设定，负责培训实施与指导。</span></p><p><span>2. 负责为乙方提供必要的培训资源及培训条件。</span></p><p><span>3. 如乙方在培训期结束后考核合格，甲方负责与乙方签订兼职协议。</span></p><p><span>第五条：乙方责任与义务</span></p><p><span>1. 根据培训目标积极配合培训学习，完成通用培训、单科培训及配合培训后试讲验收。</span></p><p><span>2. 培训期服从甲方管理，不违反培训纪律及甲方公司管理政策、不得在培训期内随意请假、拖延培训周期、无故缺席试讲环节、作业完成敷衍等。</span></p><p><span>3. 无论是否通过培训考核，乙方对甲方的培训内容、培训教材、培训流程以及培训期间接触到的甲方商业机密，负有保密责任，乙方如违反保密条款，造成的损失由乙方承担，并追究乙方相应的法律责任。</span></p><p><span>4. 乙方保证在培训考核通过后，服从甲方对其工作内容及工作岗位的安排。</span></p><p><span>第六条：培训协议的变更、解除</span></p><p><span>1. 甲、乙双方协商一致可以采取书面形式变更本协议。</span></p><p><span>2. 本协议依法签订后，合同双方必须全面履行协议规定的义务，任何一方不得擅自变更协议。如若乙方要求中止协议，需提前1周以邮件形式通知甲方，经甲、乙双方经协商后可解除协议，培训期已开始带课的教师应配合交接工作。如乙方在本协议期限内无故退出，或课程交接不清等由此造成甲方损失的，甲方有权要求乙方赔偿。</span></p><p><span>3. 经甲乙双方协商一致，可以解除本协议。</span></p><p><span>4. 乙方有以下情形之一的，甲方可以随时与乙方解除协议并无须支付经济补偿：</span></p><p><span>1) 在培训期内被证明不符合录用条件的；</span></p><p><span>2) 在培训期内严重违反甲方管理规定的；</span></p><p><span>3) 培训期满未通过甲方的培训考核的；</span></p><p><span>4) 培训中期自行提出中止培训协议的；</span></p><p><span>5) 法律、法规规定的其它情形。</span></p><p><span>5. 甲方有下列情形之一，乙方可以随时通知甲方解除本合同：</span></p><p><span>1) 甲方未按照协议约定提供劳动保护或者劳动条件的； </span></p><p><span>2) 甲方规章制度违反法律、法规规定，并损害乙方合法权益的； </span></p><p><span>3) 法律、法规规定的其它情形。</span></p><p><span>第七条：法律效力 本协议作为甲、乙双方所签定劳动用工合同的附件，经双方签字，有法律效力，并由甲方在乙方人事档案卷宗中保存。</span></p><p><span>第八条：附则</span></p><p><span>1. 本协议未尽事宜双方可另作协商约定。</span></p><p><span>2. 当双方发生争议不能协商处理时，由当地劳动仲裁部门或法院处理。</span></p><p><span>3. 本协议一式二份，甲、乙双方各执一份，具同等法律效力。</span></p><p><span>第九条：附件</span></p><p><span>甲方（盖章）： 乙方（签字）：</span></p><p><span>日期： 年 月 日 日期： 年 月 日</span></p><p><span>附件</span></p><p><span>1. 培训内容：</span></p><p><span>1） 通用培训：涉及公司规章制度、基本授课及服务流程、企业文化介绍、课酬方案等内容。</span></p><p><span>2） 单科培训：涉及学科讲义介绍、全国各地区考纲和学情、知识点（包括自主招生和竞赛）、教学技巧等内容。</span></p><p><span>3） 试讲培训：涉及在海风授课系统上进行真实课堂的模拟试讲，及相关授课话术的指导等内容。</span></p><p><span>4） 入系统审核：以试讲的方式，对教师培训情况进行最终评定。</span></p><p><span>2. 考核标准：培训期出勤：培训期内不得请假，突发状况请出具相关证明（如：急诊等）</span></p><p><span>Ø 培训期审核：</span></p><p><span>v 第一轮试讲：按《试讲评分标准》中考核项，若教学能力得分低于60分，直接淘汰；第一轮试讲总分低于70分直接淘汰。</span></p><p><span>v 第二轮试讲：按《试讲评分标准》中考核项，试讲总分低于75分直接淘汰。</span></p><p><span>v 入系统审核：按《最终审核表》中考核项，试听总分低于90分淘汰，高于等于90分者视为通过培训期考核。</span></p><p><span>(注：试讲环节请提前调试好网络环境，因网络问题影响试讲效果将取消试讲资格，整改完毕后方可再次进行。培训期内若因网络环境等整改无效或教师本人拒绝整改，该教师将不予通过培训期，直接淘汰。)</span></p><p><span>Ø 教师培训配合度：教师培训过程中，配合度较差者，也属于不符合录用的条件，即解除培训协议。出现但不仅限于以下情况均属于配合度较差：失联、不按时提交相关培训要求材料或试卷、培训态度敷衍等。</span></p><p><span>3. 通过后任用的岗位：兼职授课教师</span></p><p><span>以上为海风教育教师培训通用细则，具体培训规定以及要求以每批次学科部门培训组的要求为准。</span></p><p><span><br></span></p>
          </div>
        </div>
        <div id="u101" class="ax_default" data-width="704" data-height="413">
          <div id="u102" class="ax_default shape">
            <div id="u102_div" class=""></div>

            <div id="u103" class="text" style="display:none; visibility: hidden">
              <p><span></span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="success">
        <div id="u104" class="ax_default _一级标题" style="padding-left: 10%;">
          <div id="u104_div" class=""></div>
          <div id="u105" class="text">
            <h1>兼职教师入培协议及附件</h1>
          </div>
        </div>
        <div id="u106" class="ax_default _一级标题">
          <div id="u106_div" class=""></div>
          <div id="u107" class="text">
            <p><span>提交成功！</span></p>
          </div>
        </div>

        <div id="u108" class="ax_default _一级标题">
          <div id="u108_div" class=""></div>
          <div id="u109" class="text">
            <p><span>请关注您的QQ消息，HR将与您确认确认具体培训时间</span></p>
          </div>
        </div>
      </div>

    </div>
    <script type="text/javascript" src="//cdn-vip.hfjy.top/newtpl/static/hrm/js/jquery-1.11.1.min.js"></script>
    <script type="text/javascript">
      $(function(){
        $('.sure').click(function(){
            var _host  = "<?php echo HRM_API;?>";
            var _is_check = $('input:radio[name="trainProxy"]:checked').val();
            if(!_is_check){
              alert('请选择条款');
              return;
            }
            $.ajax({
                type: 'post',
                data: $('#form').serialize(),
                url: _host + '/resume/public/trainInfoSecond.html',
                success: function(data) {
                  var data  = eval('('+data+')')
                  if(data.code != '0x000000')
                  {
                    alert(data.message);
                    return;
                  }
                  alert('操作成功');
                  location.href = '/newHrm/success.html';
                  return;
                }
            });
        })
      })
    </script>
  </body>
</html>
