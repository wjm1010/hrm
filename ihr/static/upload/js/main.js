/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */


$(function() {
    var _extensions = ['flv','mpg','mpeg','avi','wmv','mov','asf','rm','rmvb','mkv','m4v','mp4'];
    var is_submit = 0;
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '500mb',
        flash_swf_url: 'js/Moxie.swf',
        unique_names:true,
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(mOxie.Env.OS.toLowerCase()==="ios"),
        uptoken : $('.token').val(),
        domain: 'http://o061kmjss.qnssl.com/',
        get_new_uptoken: false,
        auto_start: false,
        log_level: 5,
        init: {
            'FilesAdded': function(up, files) {
                
                $('table').show();
                $('#success').hide();
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
                $('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);

                var info = JSON.parse(info);
                var sourceLink = info.key;
                $('.video_link').val(sourceLink);
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
        }
    });

    uploader.bind('FileUploaded', function() {
        console.log('hello man,a file is uploaded');
    });
    $('#container').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragleave', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragover', function(e) {
        e.preventDefault();
        $('#container').addClass('draging');
        e.stopPropagation();
    });


    $('#show_code').on('click', function() {
        $('#myModal-code').modal();
        $('pre code').each(function(i, e) {
            hljs.highlightBlock(e);
        });
    });


    $('body').on('click', 'table button.btn', function() {
        $(this).parents('tr').next().toggle();
    });

    $('.school_list').on('click', 'li', function(){
        $('.school').val($(this).text());
        $('.school_list').hide();
        _is_select_school = true;
    })

    $('.send_code').click(function(){     
        var time = 60;
        var that = this;
        var _phone = $('.phone').val();

        if($(that).hasClass('disabled')) return;
        $(that).addClass('disabled'); 
        
        if(!checkPhone(_phone)){ 
            $(that).removeClass('disabled');
            alert("请输入正确的手机"); 
            return false; 
        }
        var _sendInfo = sendCode(_phone)
        if (_sendInfo && _sendInfo.code == "0x000000"){            
            var interval = setInterval(function(){
                time--;
                if(time == 0 ) {
                    clearInterval(interval);
                    $(that).css('background','#378eed').text('重新发送').removeClass('disabled');
                    return;
                }
                $(that).css('background','#bcbfc1').text(time+'(s)后重新发送');
            },1000);
        }else {
            $(that).removeClass('disabled');
            var _errorMsg = _sendInfo.message ? _sendInfo.message : "验证码发送失败，请重新发送"
            alert(_errorMsg); 
            return false;   
        }
    })

    $('.wt-next-step').click(function(){
        var that = this;
        var _name = $('.name').val();
        var _code = $('.code').val();
        var _phone = $('.phone').val();
        var _subject = $('.subject').val();
        var _school = $('.school').val();
        var _video_link = $('.video_link').val();
        var file_name = $('#fileName').text();

        if(!_name){
            alert("请输入姓名"); 
            return false;
        }

        if(!checkPhone(_phone)){ 
            alert("请输入正确的手机"); 
            return false; 
        }

        if(!_code){ 
            alert("请输入短信验证码"); 
            return false; 
        }

        if( !file_name ){
            alert("请选择文件"); 
            return false;            
        }

        var fileInfo = file_name.split('.');
        var _fileType = fileInfo[fileInfo.length - 1]
        
        if (_extensions.indexOf(_fileType) < 0){
            alert('文件格式有误');
            return false;
        }
        var _codeInfo = checkCode(_phone,_code);
        if(_codeInfo && _codeInfo.code == "0x000000" ){
            if($(that).hasClass('disabled')) return;
            $(that).addClass('disabled'); 
            $(that).css('background','#bcbfc1').text('正在上传');
            var interval = setInterval(function(){
                $('.chooseFile').hide();
                uploader.start();

                _video_link = $('.video_link').val();
                if(_video_link){
                    clearInterval(interval);
                    $.ajax({
            　　　　　　url: '/newHrm/handleData.php',
            　　　　　　type: 'post',
            　　　　　　data: {'resumePhone':_phone,'resumeVideoLink':_video_link,'type':'upload'},
            　　        success: function(ret){
                            $(that).css('background','#378eed').text('提交').removeClass('disabled');;
                            $('#wt-addPosition-step2,#_DialogBGDiv').hide();
                            is_submit = 0;
                            ret = eval('('+ret+')');
                            if( ret.code != '0x000000' ) {
                                alert("上传失败,请刷新后重新上传");
                                location.reload();
                            }
                            else {
                                alert("上传成功");
                                location.reload();
                            }
            　　　　　  }
                　　},'json');
                }
            },500);
        }else {
            var _errorMsg = _codeInfo.message ? _codeInfo.message : "短信验证码错误"
            alert(_errorMsg); 
            return false;   
        }


    })
    var getRotate = function(url) {
        if (!url) {
            return 0;
        }
        var arr = url.split('/');
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === 'rotate') {
                return parseInt(arr[i + 1], 10);
            }
        }
        return 0;
    };

    $('#myModal-img .modal-body-footer').find('a').on('click', function() {
        var img = $('#myModal-img').find('.modal-body img');
        var key = img.data('key');
        var oldUrl = img.attr('src');
        var originHeight = parseInt(img.data('h'), 10);
        var fopArr = [];
        var rotate = getRotate(oldUrl);
        if (!$(this).hasClass('no-disable-click')) {
            $(this).addClass('disabled').siblings().removeClass('disabled');
            if ($(this).data('imagemogr') !== 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': rotate,
                    'format': 'png'
                });
            }
        } else {
            $(this).siblings().removeClass('disabled');
            var imageMogr = $(this).data('imagemogr');
            if (imageMogr === 'left') {
                rotate = rotate - 90 < 0 ? rotate + 270 : rotate - 90;
            } else if (imageMogr === 'right') {
                rotate = rotate + 90 > 360 ? rotate - 270 : rotate + 90;
            }
            fopArr.push({
                'fop': 'imageMogr2',
                'auto-orient': true,
                'strip': true,
                'rotate': rotate,
                'format': 'png'
            });
        }

        $('#myModal-img .modal-body-footer').find('a.disabled').each(function() {

            var watermark = $(this).data('watermark');
            var imageView = $(this).data('imageview');
            var imageMogr = $(this).data('imagemogr');

            if (watermark) {
                fopArr.push({
                    fop: 'watermark',
                    mode: 1,
                    image: 'http://www.b1.qiniudn.com/images/logo-2.png',
                    dissolve: 100,
                    gravity: watermark,
                    dx: 100,
                    dy: 100
                });
            }

            if (imageView) {
                var height;
                switch (imageView) {
                    case 'large':
                        height = originHeight;
                        break;
                    case 'middle':
                        height = originHeight * 0.5;
                        break;
                    case 'small':
                        height = originHeight * 0.1;
                        break;
                    default:
                        height = originHeight;
                        break;
                }
                fopArr.push({
                    fop: 'imageView2',
                    mode: 3,
                    h: parseInt(height, 10),
                    q: 100,
                    format: 'png'
                });
            }

            if (imageMogr === 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': 0,
                    'format': 'png'
                });
            }
        });

        var newUrl = Qiniu.pipeline(fopArr, key);

        newImg.src = newUrl;
        return false;
    });

    function checkPhone( phone ){
        if(!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(phone))) return false;
        return true;
    }
    function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}
    function sendCode(phone){
        var result = '';
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
        var result = '';
        $.ajax({
　　　　　　url: '/newHrm/handleData.php',
　　　　　　type: 'post',
　　　　　　data: {'phone':phone, 'code': code, 'type':'checkCode'},
            async: false,
        　　success: function(ret){
               result = eval('('+ret+')');
        　　}
        }, 'json');
        return result;
    }
});