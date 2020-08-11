var dialog1 = dialogSwitcher("dialog1");
var dialog2 = dialogSwitcher("dialog2");


var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',
    browse_button: 'pickfiles',
    container: 'container',
    drop_element: 'container',
    flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
    dragdrop: true,
    unique_names: false,
    save_key: false,
    chunk_size: '4mb',
    uptoken: $('#uptoken_url').val(),
    multi_selection: !(mOxie.Env.OS.toLowerCase() === "ios"),
    domain: $('#domain').val(),
    get_new_uptoken: false,
    auto_start: false,
    log_level: 5,
    prevent_duplicates: true,
    init: {
        'FilesAdded': function (up, files) {
            // 文件添加进队列后,处理相关的事情
            var videoContent = $("#domain").val(files[0].name)
            // 查看视频大小(mb) 
            $(".Upload-resume-status").text("文件已添加")
            var videoContentsize = files[0].size
            var relSize = parseInt(videoContentsize / 1024 / 1024);
            if (relSize > 500) {
                // showErrorMsg('视频文件过大,请重新上传！');
                $("#domain").val('s')
                return false;
            }
        },
        'BeforeUpload': function (up, file) {
            // 每个文件上传前,处理相关的事情  
            console.log(file)
        },
        'UploadProgress': function (up, file) {
            // 每个文件上传时,处理相关的事情
        },
        'UploadComplete': function () {
            //队列文件处理完毕后,处理相关的事情 
        },
        'FileUploaded': function (up, file, info) {
            // 每个文件上传成功后,处理相关的事情
            var info = JSON.parse(info)
            var videoAddress = "http://qn-hyphen.hfjy.com/" + info.key;
            console.log(videoAddress)
            $("#domain").val(videoAddress);
            console.log($("#domain").val())
        },
        'Error': function (up, err, errTip) {
            if (err.response == '{"error":"file exists"}') {
                var videoAddrerr = "http://qn-hyphen.hfjy.com/" + err.file.name;
                $("#domain").val(videoAddrerr);
            }
        },
        'Key': function (up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数  
            // 该配置必须要在 unique_names: false , save_key: false 时才生效  
            //key就是上传的文件路径  
            var key = "";
            //获取年月日时分秒  
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            key += '/liu/' + year + '/' + month + '/' + day + '/' + hour + minute + second + '/';
            key += file.name;
            return key;
        }
    }
});

$('.subjectTeacher-btn').click(function () {
    var ref = $('#formTeacher').find($(".form-control"));
    var _complete = true;
    $(ref).each(function (e) {
        if ($(this).val() == '') {
            _complete = false;
            $(this).focus();
            $(this).parent().parent().find('.error_info').show();
            return false;
        } else {
            $(this).parent().parent().find('.error_info').hide();
            var reg_phone = /^[1][0-9]{10}$/;
            var reg_mail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if ($(this).hasClass('phone') && !reg_phone.test($(this).val())) {
                $(this).parent().parent().find('.error_info').text("请输入正确手机号").show()
                $(this).focus();
                _complete = false;
                return false;
            }
            if ($(this).hasClass('email') && !reg_mail.test($(this).val())) {
                $(this).parent().parent().find('.error_info').text("请输入正确邮箱").show()
                $(this).focus();
                _complete = false;
                return false;
            }
        }
    });
   
    if (_complete) {
        if (uploader.files.length >0){   
            uploader.start();
            var timer = setInterval(function () {
                if ($("#domain").val() != "s" && $("#domain").val().indexOf("qn-hyphen") > 0) {
                    $(".Upload-resume-status").text("文件上传成功");
                    $('.subjectTeacher-btn').attr("disabled",true);
                    $(this).attr("src","/gongkai/Public/static/campus/imgs/campus21.png")
                    saveUserInfo();
                    $("body").css("overflow-y", "auto")
                    clearInterval(timer)
                }
            }, 500)    
        }else{
            $(".Upload-resume-status").text("未上传简历");
            $('.subjectTeacher-btn').attr("disabled",true);
            $(this).attr("src","/gongkai/Public/static/campus/imgs/campus21.png")
            saveUserInfo();
        }
    }
})

function saveUserInfo() {
    // var result =sendData("http://test-hrmsale.hfjy.com/api/AddResume.php");
    var result = sendData("?s=/addon/Campus/Index/save_info");
    if (result.error == 0) {
        $("#dialog1 .submit-text").addClass("popover");
        $("#dialog1 .successful-submit-text").removeClass("popover");
        dialog1.show();
        $('.subjectTeacher-btn').attr("disabled",false);
        return false;
    } else if (result.error == "1") {
        $("#dialog2 .err-submit-text").text(result.msg); 
        dialog2.show();
        $('.subjectTeacher-btn').attr("disabled",false);
        return false;
    } else if (result.error == "2") {
        $("#dialog1 .submit-text").addClass("popover");
        $("#dialog1 .repetition-submit-text").removeClass("popover");
        dialog1.show();
        $('.subjectTeacher-btn').attr("disabled",false);
        return false;
    } else {
        console.log(result)
    }
}
$(".successful-btn").click(function () {
    $(this).attr("src","/gongkai/Public/static/campus/imgs/campus1402.png")
    window.location.href = "?s=/addon/Campus/Index/index";
})
$(".error-btn").click(function () {
    $(this).attr("src","/gongkai/Public/static/campus/imgs/campus1402.png")
    $("#dialog2 .err-submit-text").text('');
    dialog2.hide();
})

function sendData(url) {
    var _result = ''
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        data: $(".form-control").serializeArray(),
        dataType: "json",
        error: function error() {
            console.log(111)
            return false;
        },
        success: function success(json) {
            //_result = $.parseJSON(json);
            _result = json;
        }
    });
    return _result;
}

// 居中
function popup(popupName) {
    var _scrollHeight = $(document).scrollTop(), //获取当前窗口距离页面顶部高度 
        _windowHeight = $(window).height(), //获取当前窗口高度 
        _windowWidth = $(window).width(), //获取当前窗口宽度 
        _popupHeight = popupName.height(), //获取弹出层高度 
        _popupWeight = popupName.width(); //获取弹出层宽度 
    _posiTop = (_windowHeight - _popupHeight) / 2 - 50;
    _posiLeft = (_windowWidth - _popupWeight) / 2;
    popupName.css({
        "left": _posiLeft + "px",
        "top": _posiTop + "px",
        "display": "block"
    }); //设置position 
}