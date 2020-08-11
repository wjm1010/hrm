var dialog1 = dialogSwitcher("dialog1");
var dialog2 = dialogSwitcher("dialog2");
var isover  = 0;

$('.recruitments-btn').click(function () {
    var ref = $('#formMarket').find($(".form-control1"));
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
        if ( $("#input-file").val() != '') {
            savefile();
            console.log($("#domain").val())
            if (isover == 1) {
                return;
            }
            if ($("#domain").val() == '') {
                alert('简历上传失败')
            } else {
                saveUserInfo();
            }
            $("body").css("overflow-y", "auto")
        } else {
            $(".Upload-resume-status").text("未上传简历");
            $('.recruitment-btn').attr("disabled",true);
            $(this).attr("src","/newHrm/campus/imgs/campus18.png")
            saveUserInfo();
        }
    }
})

function saveUserInfo() {
    var url = '/newHrm/campus.php';
    // var result =sendData("http://test-hrmsale.hfjy.com/api/AddResume.php");
    var result = sendData(url);
    if (result.error == "0") {
        $("#dialog1 .submit-text").addClass("popover");
        $("#dialog1 .successful-submit-text").removeClass("popover");
        dialog1.show();
        $('.recruitment-btn').attr("disabled",false);
        return false;
    } else if (result.error == "1") {
        $("#dialog2 .err-submit-text").text(result.msg);
        dialog2.show();
        $('.recruitment-btn').attr("disabled",false);
        return false;
    } else if (result.error == "2") {
        $("#dialog1 .submit-text").addClass("popover");
        $("#dialog1 .repetition-submit-text").removeClass("popover");
        dialog1.show();
        $('.recruitment-btn').attr("disabled",false);
        return false;
    } else {
        console.log(result)
    }
}

function savefile(){
    var host    = document.domain;
    isover  = 0;
    if (host.indexOf("zhaopin") > 0) {
        var urladdress = "https://lms-upload.hfjy.com/file"
    } else {
        var urladdress = "https://test-lms-upload.hfjy.com/file"
    }

    $.ajax({
        url:  urladdress,
        type: 'POST',
        cache: false,
        data: new FormData($('#formMarket')[0]),
        processData: false,
        contentType: false,
        dataType:"json",
        async: false,
        success : function(data) {
            var url = data.data;
            console.log(data)
            if (data.code == '0x000000') {
                $('.recruitment-btn').attr("disabled",true);
                $(this).attr("src","/newHrm/campus/imgs/campus18.png")
                $("#domain").val(url['url']);
            } else if(data.code == '0x010002'){
                isover = 1;
                alert('文件格式不支持！');
            }
        }
    });
}

$(".successful-btn").click(function () {
    $(this).attr("src","../imgs/campus1402.png")
    window.location.href = '/newHrm/campus.html';
})
$(".error-btn").click(function () {
    $(this).attr("src","../imgs/campus1402.png")
    $("#dialog2 .err-submit-text").text('');
    dialog2.hide();
})

function sendData(url) {
    var _result = ''
    console.log($(".form-control").serializeArray())
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
            console.log(json)
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
