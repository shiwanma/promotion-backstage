//上传七牛云存储

layui.define('layer', function(exports){
    var $ = layui.$
        ,layer = layui.layer

        //外部接口
        ,obj = {
            //……
        }

        //构造器
        ,Class = function(options){
            //……
        };

    //默认配置
    Class.prototype.config = {
        //……
    };

    //核心入口
    obj.upload = function(browse_button){
        //引入Plupload 、qiniu.js后
        Qiniu.uploader({
            runtimes: 'html5,flash,html4',    //上传模式,依次退化
            browse_button: browse_button,       //上传选择的点选按钮，**必需**
            uptoken_url: '/admin/qiniu/getUpToken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            // uptoken : '', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
            unique_names: false, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
            save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
            domain: '//',   //bucket 域名，下载资源时用到，**必需**
            get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
//        container: 'contentId',           //上传区域DOM ID，默认是browser_button的父元素，
            max_file_size: '10mb',           //最大文件体积限制
            flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
            max_retries: 2,                   //上传失败最大重试次数
            dragdrop: true,                   //开启可拖曳上传
//        drop_element: 'contentId',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                //分块上传时，每片的体积
            filters: {
                mime_types: [{
                    title: "Image files",
                    extensions: "jpg,gif,png,jpeg"
                }]
            },
            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            init: {
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件添加进队列后,处理相关的事情
                    });
                },
                'BeforeUpload': function(up, file) {
                    // 每个文件上传前,处理相关的事情
                },
                'UploadProgress': function(up, file) {
                    // 每个文件上传时,处理相关的事情
                    layer.load();
                },
                'FileUploaded': function(up, file, info) {
                    // 每个文件上传成功后, 获取文件的Url，并赋值
                    var res = $.parseJSON(info.response);
                    $('#' + browse_button).setImgVal(res.url);
                },
                'Error': function(up, err, errTip) {
                    //上传出错时,处理相关的事情
                    layer.msg('上传失败', {
                        icon: 5
                    })
                },
                'UploadComplete': function() {
                    //队列文件处理完毕后,处理相关的事情
                    layer.closeAll('loading'); //关闭loading
                    layer.msg('上传成功');
                },
                'Key': function(up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效

//                                        var key = "";
//                                        return key
                }
            }
        });
    };

    exports('qiNiu', obj);
});
