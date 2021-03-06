<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta name="msapplication-tap-highlight" content="no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
    <title>招聘管理报名</title>
   	<meta http-equiv="X-UA-Compatible" content="IE=8,IE=9,IE=10,IE=11">
	<link rel="stylesheet" type="text/css" href="//cdn-vip.hfjy.top/newtpl/static/hrm/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="//cdn-vip.hfjy.top/newtpl/static/hrm/css/common.css">
	<style>
		.wt-step{width: 300px;}
		/*.w30{width: 160px;}*/
		.mt20{ padding-left: 8px; line-height: 40px;margin-top: 16px;}
		/*.text_red{color:red;}*/
		/*.no_border{border: none;}*/
		#_DialogBGDiv{display: none;}
    .content{height: 1360px;width: 100%; background:#164e94 url(./image/bg2.png);background-size: 100%;background-repeat:no-repeat;}
    .wrap { width: 90%; margin: 162px 5% 0 5%;}
    .form-content {
      background-color: #E7E8EA;
      border-radius:10px;
      padding: 30px 10px;
    }
		.wt-contentWrap { background: none; }
		.vert select{ color: #333;}
		.wt-leftWrap{margin-left: 0px;}
		.wt-position-item { width: 100%; min-height: 38px;border: 1px solid #dedede;border-radius: 3px;position: relative}
		.wt-position-item .wt-item-input {
		    border: none;
		    outline: none;
		    width: 100%;
		    height: 38px;
		    color: #999;
		    text-indent: 10px;
		    font-size: 14px;
		}
    .form-control{height: 42px; width: 96%;border-radius:21px;border: 0 solid #fff;-webkit-appearance:none}

    .wt-next-step {
      color: #fff;
      width: 96%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      border-radius: 30px;
      text-align: center;
      margin-top: 30px;
      background: linear-gradient(270deg, rgba(95, 189, 252, 1) 0%, rgba(0, 153, 255, 1) 100%);
    }
		.wt-leftWrap{background: none;}
		.wt-main-bottom{width: 100%;  margin-left: auto; margin-right: auto;}
		.btn{padding: 0px;width: 100%;}
		.school_list, .years_list {
	        z-index: 9999;
	        background: #f9f9f9;
	        width: 90%;
	        position: relative;
	        margin-top: 5px;
	        height: 240px;
	        overflow-y: auto;
	        display: none;
	        border-radius: 6px;
	        padding: 0;
	    }
	    .school_list li, .years_list li {
	        line-height: 35px;
	        cursor: pointer;
	    }
    .top-form, .center-form, .bottom-form {
      margin-bottom: 18px;
      text-align: center;
    }
    .group-image {
      width: 105px;
      height: 30px;
    }
    select.form-control { cursor: pointer }
    .triangle {
      position: absolute;
      right: 23px;
      top: 20px;
    }
    .form-select-down {
      border-width: 6px 7px 0;
      border-style: solid;
      border-color: rgba(212,213,217,1) transparent transparent;
    }
		@media screen and (min-width: 450px) {
      .wrap {
        margin-top: 30px
      }
		    .wt-main-bottom {
		        width: 450px;
		    }
		    .form-control,.wt-next-step{
		    	width: 100%;
          border-radius: 4px;
		    }
      .form-select-down {
      border-color: transparent transparent transparent;
      }
      select.form-control{-webkit-appearance: menulist-button, cursor: pointer}
		    .logo-container {background: url("./image/logo.png") center no-repeat;height: 30px;width: 100%;}
		    .content{background-image: url(./image/bg.jpg);height: 100%;}
		    .wt-position-item { width: 375px;}
		    .mt20{padding-left: 26px;}
		    .btn{width: 375px;}
		}
		.container{ margin-right: 0px; }
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
		.form-control:focus{
			border-color: none;
		}
		 .form-control[readonly] {
          background-color: #fff;
        }
		.red{ border-color: red;}
	</style>
	<link rel="shortcut icon" href="//www.hfjy.com/favicon.ico" type="image/x-icon" />
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
                  <form id="form">
                    <div class="form-content">
                    <div class="logo-container"></div>
                      <div class="top-form">
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;姓名:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <input type="text" name="resumeName" class="name form-control" placeholder="您的姓名(与身份证一致)"
                                   required='required'>
                          </div>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;手机号:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <input type="text" name="resumePhone" class="phone form-control" placeholder="您的手机号"
                                   required='required'>
                          </div>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;QQ:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <input type="text" name="resumeInfoQQ" class="qq form-control" placeholder="您的QQ号"
                                   required='required'>
                          </div>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;邮箱:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <input type="text" name="resumeInfoEmail" class="email form-control"
                                   placeholder="您的邮箱(请确认邮箱有效性与正确性)" required='required'>
                          </div>
                        </div>
                      </div>

                      <div class="center-form">
                        <img class="group-image" src="./image/Group.png"/>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;应聘年级:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <span class="triangle form-select-down"></span>
                            <select name="resumeGrade" class="form-control grade" required='required'
                                    onchange="getSubjectList(this.value)">
                              <option value="">请选择应聘年级</option>
                              <option value="少儿">少儿</option>
                              <option value="小学">小学</option>
                              <option value="初中">初中</option>
                              <option value="高中">高中</option>
                            </select>
                          </div>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;应聘学科:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <span class="triangle form-select-down"></span>
                            <select name="resumeSubject" class="form-control subject" required='required'>
                              <option value="">请选择应聘学科</option>
                              <option value="数学">数学</option>
                              <option value="语文">语文</option>
                              <option value="英语">英语</option>
                              <option value="数学竞赛">数学竞赛</option>
                              <option value="科学">科学</option>
                            </select>
                          </div>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;应聘职位:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <span class="triangle form-select-down"></span>
                            <select name="resumeProperty" class="form-control property resumeProperty"
                                    required='required'>
                              <option value="">请选择应聘职位</option>
                              <option value="兼职">兼职</option>
                              <option value="全职">全职(社招)</option>
                              <option value="实习">全职(校招)</option>
                            </select>
                          </div>
                        </div>
                        <div class="mt20 pr workPlace none">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;工作地点:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <span class="triangle form-select-down"></span>
                            <select name="resumeInfoWorkPlace" class="form-control resumeInfoWorkPlace"></select>
                          </div>
                        </div>
                        <div class="mt20 pr notice none">
                          <div class="wt-position-item inlblock" style="border: none;color: #616161;">
                            <p>提交报名之后，会收到我们的面试邮件，请注意查看您的邮箱哦～</p>
                          </div>
                        </div>
                      </div>

                      <div class="bottom-form">
                        <img class="group-image" src="./image/Group21.png"/>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;目前身份:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <span class="triangle form-select-down"></span>
                            <select name="resumeTeacherIdent" class="form-control teacher_ident" required='required'>
                              <option value="">请选择身份</option>
                              <option value="在校学生">在校学生</option>
                              <option value="学校老师">学校老师</option>
                              <option value="其他">其他</option>
                            </select>
                          </div>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;学历:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <span class="triangle form-select-down"></span>
                            <select name="resumeInfoEducation" class="form-control education" required='required'>
                              <option value="">请选择学历</option>
                              <option value="2">本科</option>
                              <option value="3">硕士</option>
                              <option value="4">博士及以上</option>
                            </select>
                          </div>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;学校类型:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <span class="triangle form-select-down"></span>
                            <select name="resumeInfoSchoolType" class="form-control school_type" required='required'>
                              <option value="">请选择学校类型</option>
                              <option value="1">国内院校</option>
                              <option value="2">港澳台院校</option>
                              <option value="3">国外院校</option>
                            </select>
                          </div>
                        </div>
                        <div class="mt20 pr none school-name">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;就读/毕业学校:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <input type="text" name="resumeSchool" class="school form-control" placeholder="毕业学校"
                                   required='required' oninput="getHightSchool(this.value)"/>
                          </div>
                          <ul class="school_list"></ul>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;毕业年份:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <span class="triangle form-select-down"></span>
                            <input name="resumeInfoFromGrade" readonly required='required' placeholder="请选择毕业年份" class="from_grade form-control" />
                            <ul class="years_list"></ul>
                          </div>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;所学专业:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <input type="text" name="resumeInfoSpecialty" class="specialty form-control"
                                   placeholder="所学专业" required='required'/>
                          </div>
                        </div>
                        <div class="mt20 pr">
                          <!--<div class="h40 w30 inlblock tc f14 pa left0 lh40"><span class="text_red">*</span>&nbsp;是否有教师资格证:-->
                          <!--</div>-->
                          <div class="wt-position-item inlblock" style="border: none;">
                            <span class="triangle form-select-down"></span>
                            <select name="resumeInfoTeacherCert" class="form-control teacher_ident" required='required'>
                              <option value="">请选择是否有教师资格证</option>
                              <option value="1">是</option>
                              <option value="2">否</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mt20 pr"  style="padding-bottom: 20px;">
										<div class="btn">
								        	<div class="wt-searchBar-btn1 wt-next-step" style="background: #378eed;">提交</div>
								        </div>
							        </div>
							        <input type="hidden" class="spread_code" name="spreadCode" value="" >
							        <input type="hidden" class="type" name="type" value="register" >
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
	<script type="text/javascript" src="./js/public.js"></script>
	<script type="text/javascript">
		var _school_type = '';
		var localYear = "<?php echo date('Y');?>";
		var _is_select_school = false;
		var _json_subject = {"少儿":["数理思维","文学思维","素质应用能力"],"小学":["数学","语文","英语","数学竞赛","科学"],"初中":["语文","数学","英语","物理","化学","数学竞赛","地理","历史","生物","政治","信息科技","科学","物理竞赛","化学竞赛"],"高中":["语文","数学","英语","物理","化学","生物","历史","地理","政治","信息科技","数学竞赛","物理竞赛","化学竞赛","生物竞赛"]};
		$(function(){
			var _is_submit = false;
			var _params = GetRequest();

			if (_params && _params.code)  $('.spread_code').val(_params.code)

			$('.wt-next-step').click(function(){

				var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
				var ref = $('#form').find("[required='required']");
				var _complete = true;

		        $(ref).each(function(e){
		            if ($(this).val() == '')
		            {
		            	_complete = false;
		                $(this).stop()
						   .animate({ left: "-10px" }, 100).animate({ left: "10px" }, 100)
						   .animate({ left: "-10px" }, 100).animate({ left: "10px" }, 100)
						   .animate({ left: "0px" }, 100)
						   .addClass("required");
						    $(document).scrollTop($(this).offset().top - 50)
						$(this).focus();
		                return false;
		            }else{
		            	if( $(this).hasClass('email') && !reg.test($(this).val())){
		            		_complete = false;
		            		alert('请输入正确的邮箱');
		            		return;
		            	}
		            	$(this).removeClass('red');
		            }
		        });
		        if ($('.resumeProperty').val() == '全职' && !$('.resumeInfoWorkPlace').val()) {
		        	alert('请选择工作地点');
		            return;
		        }
		        if (_school_type == 1 && !_is_select_school){
		        	alert('您输入的学校不符合要求');
		            return;
		        }
		        if( _complete && !_is_submit ){
		        	_is_submit = true
			        $.ajax({
		                type: 'post',
		                data: $('#form').serialize(),
		                url: "/newHrm/handleData.php",
		                success: function(data) {
		                	var data  = eval('('+data+')')
		                	if(data.code != '0x000000')
		                	{
		                		_is_submit = false;
		                		alert(data.message);
		                		return;
		                	}
		                	alert('提交成功');
                      if($('.property').val() == '兼职') {
                                              location.href = '/newHrm/success3.html'
                                              return
                                            }
                                            location.href = '/newHrm/success2.html'
		                	return;
		                }
		            });
		        }
			})
		})

		 $('.years_list').on('click', 'li', function() {
          $('.from_grade').val($(this).text())
          $('.years_list').hide()
        })

        $('.school_list').on('click', 'li', function(){
            $('.school').val($(this).text());
            $('.school_list').hide();
            // $('.is_select_school').val(1)
            // $('.is_primary_school').val($(this).data('value'))
            _is_select_school = true;
        })

       $('.form-control').on('focus', function () {
            $(this).parents('.wt-position-item').children('.triangle').css('transform', 'rotate(180deg)');
                  })
          $(".form-control").on('blur', function() {
            $(this).parents('.wt-position-item').children('.triangle').css('transform', 'rotate(0deg)');
          })
          $(".form-control").on('change', function() {
            $(this).parents('.wt-position-item').children('.triangle').css('transform', 'rotate(0deg)');
            })

   function addGradeOptions () {
		  var startYear = parseInt(localYear) + 8;
      var yearsArea = 29;
      for (var i = 0; i < yearsArea; i++)
      $('.years_list').append("<li value=" + (startYear - i) +">"+(startYear - i)+"</li>")
    }
    addGradeOptions()

$('.from_grade').on('click', function() {
        $('.years_list').css('display', 'block');
   		  if ($('.from_grade').val()) {
                for(var i = 0; i < $('.years_list').find('li').length; i++) {
                  if ($('.years_list').find('li')[i].value == $('.from_grade').val()) {
                    $('.years_list').scrollTop($('.years_list').find('li')[i].offsetTop - 60);
                    $('.years_list').find('li').css('backgroundColor', '#f9f9f9');
                    $('.years_list').find('li')[i].style.backgroundColor = '#ccc';
                    break
                  }
                }
                return
              }
        for(var i = 0; i < $('.years_list').find('li').length; i++) {
          if ($('.years_list').find('li')[i].value == localYear) {
           $('.years_list').scrollTop($('.years_list').find('li')[i].offsetTop - 60);
            $('.years_list').find('li')[i].style.backgroundColor = '#ccc';
            break
          }
        }
        })

 $('.school_type').on('change', function() {
     _school_type = $(this).val();
 			$('.school_list').hide();
 			if ($(this).val()) $('.school-name').show()
 			else  $('.school-name').hide();
 })

    $('.resumeProperty').on('change', function() {
      var v = $(this).val();
      switch (v) {
         case '兼职':
           $('.notice').show();
           $('.workPlace').hide();
           break;
         case '全职':
           $('.notice').hide();
           fullTimeOptions();
           $('.workPlace').show();
           break;
         case '实习':
           $('.notice').hide();
           partTimeOptions();
           $('.workPlace').show();
           break;
         default:
           $('.notice').hide();
           $('.workPlace').hide();
           break;
      }
    })

     function fullTimeOptions() {
    	 $(".resumeInfoWorkPlace option").remove()
       $(".resumeInfoWorkPlace").append("<option value=''>请选择工作地点</option><option value='北京'>北京</option><option value='上海'>上海</option><option value='武汉'>武汉</option><option value='西安'>西安</option><option value='哈尔滨'>哈尔滨</option><option value='其他'>全国其他城市</option>");
     }

     function partTimeOptions() {
        $(".resumeInfoWorkPlace option").remove()
        $(".resumeInfoWorkPlace").append("<option value=''>请选择工作地点</option><option value='武汉'>武汉</option><option value='西安'>西安</option><option value='哈尔滨'>哈尔滨</option><option value='远程办公'>远程办公</option>");
     }

		function getSubjectList(grade) {
	        var _html = "<option value=''>选择学科</option>";
	        for(var k in _json_subject[grade]){
	            var _is_selected = (_json_subject[grade][k] == '')?'selected':'';
	            _html += "<option value='"+_json_subject[grade][k]+"' "+_is_selected+">"+_json_subject[grade][k]+"</option>"
	        }
	        $('.subject').html(_html);
	    }

	    function getHightSchool( v ){
	        if (!v || _school_type !=1) return;
	        _is_select_school = false;
	        $('.is_select_school').val(0)
	        if (!DataLength(v)) return;
	        $.ajax({
	            url: "/newHrm/handleData.php",
	            dataType:"json",
	            type:"post",
	            async: false,
	            data: {'schoolName':v, 'type':'school'},
	            success : function(result) {
	                if( result && result.code == '0x000000' ){
	                    var _school_list = '';
	                    var _data = result.data
	                    var _school_name = $('.school').val();
	                    _data.forEach(function(value){
	                    	_is_select_school = (_school_name == value['schoolName']) ? true : false;
	                        _school_list += '<li data-value="'+value['schoolTags']+'">'+value['schoolName']+'</li>';
	                    })
	                    $('.school_list').html(_school_list).show();
	                }
	            }
	        });
	    }

	    function DataLength(fData) {
	    	console.log(fData.length)
	        var re = /[\u4E00-\u9FA5]/g;
	        if (re.test(fData) && fData.match(re).length == fData.length) return true;
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
