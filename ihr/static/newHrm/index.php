<?php
error_reporting(0);
header("Content-type:text/html;charset=utf-8");

$code = $_GET['code'];

$token = file_get_contents("https://s-xue.hfjy.com/study/token/GetToken/getToken");
$token = json_decode($token, true);
$token['data']['uploadToken'] = $token['data']['token'];

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>海风教育招聘管理</title>
   	<meta http-equiv="X-UA-Compatible" content="IE=8,IE=9,IE=10,IE=11">
	<link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="./css/iconfont.css">
	<link rel="stylesheet" type="text/css" href="./css/common.css">
	<link rel="stylesheet" type="text/css" href="./css/ui-dialog.css">
	<link rel="stylesheet" type="text/css" href="./css/pop.css">
	<link rel="stylesheet" type="text/css" href="./css/candidate_v1.css">
	<link rel="stylesheet" type="text/css" href="./css/base.css">
	<link rel="stylesheet" type="text/css" href="./css/common_v1.css">
	<link rel="stylesheet" type="text/css" href="./css/XJzpb.css">
	<style>
		.wt-step{width: 300px;}
		.w30{width: 160px;text-align: right;}
		.mt20{ padding-left: 20px; line-height: 40px;margin-top: 16px;}
		.text_red{color:red;}
		.no_border{border: none;}
		#_DialogBGDiv{display: none;}
		.content{background-image: url(/newHrm/image/bg.jpg); width: 1200px;height: 700px;margin:auto;}
		.wrap { width: 100%;  }
		.wt-contentWrap { background: none; }
		.vert select{ color: #333;}
		.wt-leftWrap{margin-left: 0px;}
		.wt-position-item { width: 328px; min-height: 38px;border: 1px solid #dedede;border-radius: 3px;}
		.wt-position-item .wt-item-input {
		    border: none;
		    outline: none;
		    width: 100%;
		    height: 38px;
		    color: #999;
		    text-indent: 10px;
		    font-size: 14px;
		}
		.form-control{height: 42px;}
		.wt-next-step{
			color: #fff;
		    display: inline-block;
		    width: 328px;
		    height: 40px;
		    line-height: 40px;
		    border-radius: 3px;
		    font-size: 14px;
		    text-align: center;
		    background: #378eed;
		}
		.wt-leftWrap{background: none;}
		.wt-main-bottom{width: 400px;margin-left: 400px;background: #fff;}
		.file-input{
		  line-height:30px;
		  position:relative;
		  margin-top:10px;
		}
		.file-input .input-container{
		  width:100px;
		  height:30px;
		  text-align:center;
		  background:#3879d9;
		  color:#fff;
		  border-radius:3px;
		}
		.file-input input{
		  position:absolute;
		  left:0;
		  top:0;
		  opacity:0;
		}
		.file-input #name{
			position: absolute;
		    left: 100px;
		    top: 0;
		    font-size: 12px;
		    color: #666;
		    width: 200px;
		    overflow: hidden;
		    height: 40px;
		    margin-left: 10px;
		}
		.school_list{
	        z-index: 9999;
	        background: #f9f9f9;
	        width: 328px;
	        position: relative;
	        margin-top: 0px;
	        height: 240px;
	        overflow-y: auto;
	        display: none;
	        margin-left: 20px;
	    }
	    .school_list li {
	        line-height: 26px;
	        cursor: pointer;
	    }
	</style>
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
							<div id="candiateNewPageBar"></div>
							<div class="wt-main-bottom" style="">
								<div class="mt20 pr">
									<img src="./image/logo.png" style="padding-left: 100px; padding-top: 20px;">
								</div>
								<form enctype="multipart/form-data" id="form" action="" method="post" >
									<div class="mt20 pr">
										<div class="wt-position-item inlblock" style="border: none;margin-left: 20px;">
											<input type="text" class="name form-control" placeholder="您的姓名"  required='required'>
										</div>
									</div>
									<div class="mt20 pr">
										<div class="wt-position-item inlblock" style="border: none;margin-left: 20px;">
											<input type="text" name="resumePhone" class="phone form-control" placeholder="手机号码"  required='required'>
										</div>
									</div>
									<div class="mt20 pr">
										<div class="wt-position-item inlblock" style="border: none;margin-left: 20px;">
											<input type="text" name="code" class="code form-control" placeholder="短信验证码" style="display:inline-block;width:68%;">
											<span class="wt-searchBar-button wt-searchBar-btn1 send_code" style="height: 42px;width: 28%;line-height: 42px;margin-left: 8px;">发送验证码</span>
										</div>
									</div>
									<div id="container" class="mt20 pr" style="padding-left: 40px;">
										<div class="file-input chooseFile">
											<a id="pickfiles">
												<p class="input-container">
											    选择文件
											    <input type="file" id="fileUpload" name="uploadFile" style="width: 100px;" />
												</p>
											</a>
										  <span id="fileName"></span>
										</div>
										<div class="file-input" id="fsUploadProgress">
											  	<!-- <div class="progress">
											        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
											            <span class="sr-only"></span>
											        </div>
										        </div> -->
										</div>
									</div>
									<div class="mt20 pr"  style="margin-left: 8px;padding-bottom: 20px;">
										<div class="btn">
								        	<div class="wt-searchBar-btn1 wt-next-step" style="background: #378eed;">提交</div>
								        </div>
							        </div>
							        <input type="hidden" class="spread_code" value="<?php echo $code;?>" >
							        <input type="hidden" class="video_link" name="resumeInfoAppendix" >
							        <input type="hidden" class="token" value="<?php echo $token['data']['uploadToken'];?>">
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
	<script type="text/javascript" src="./js/moxie.js"></script>
	<script type="text/javascript" src="./js/plupload.dev.js"></script>
	<script type="text/javascript" src="./js/zh_CN.js"></script>
	<script type="text/javascript" src="./js/ui.js"></script>
	<script type="text/javascript" src="./js/qiniu.js"></script>
	<script type="text/javascript" src="./js/highlight.js"></script>
	<script type="text/javascript" src="./js/main.js"></script>
	<script type="text/javascript">hljs.initHighlightingOnLoad();</script>
</body>
</html>
