<?php

/**
 * @Author: xuxu
 * @Date:   2018-11-04 16:30:22
 * @Last Modified by:   海风教育
 * @Last Modified time: 2018-12-21 11:18:53
 */
include "./CurlNew.php";
include "./config.php";


if ($_POST) {
	$type = $_POST['type'];
	ksort($_POST);
	$_POST['sign'] = md5(http_build_query($_POST) . HRM_TOKEN_SALT);

	if ($type == 'school') {  //学校搜索
		$schoolData = [
			'schoolName' => $_POST['schoolName'],
			'sign'	=> md5("schoolName=".$_POST['schoolName'].HRM_TOKEN_SALT)
		];
		$info = Curl::post(HRM_API.'/resume/public/schoolSearch.html', $schoolData);

	}else if($type == 'register') { //报名注册
		$info = Curl::post(HRM_API.'/resume/public/registerFirst.html', $_POST);

	}else if($type == 'upload') { //报名注册
		$info = Curl::post(HRM_API.'/resume/public/registerSecond.html', $_POST);

	}else if($type == 'sendCode') { //发送短信验证码
		$sendCodeData = [
			'phone' => $_POST['phone'],
			'sign'	=> md5($_POST['phone'].HRM_TOKEN_SALT)
		];
		$info = Curl::post(HRM_API.'/resume/public/sendCode.html', $sendCodeData);

	}else if($type == 'checkCode') { //发送短信验证码
		if(is_numeric($_POST['phone']) && mb_strlen($_POST['phone']) == 11 && is_numeric($_POST['code'])) {
			$info = Curl::post(HRM_API.'/resume/public/checkCode.html', $_POST);
		}else{
			$info = json_encode(['code'=>'0x000001']);
		}

	}else{
		$info = Curl::post(HRM_API.'/resume/public/interviewAffirm.html', $_POST);
	}
}
if (strstr(HRM_API, 'test')) file_put_contents('./result.txt', $info,  FILE_APPEND);
print_r($info);
