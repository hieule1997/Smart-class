$(document).ready(function(){
    $('#thi').click(function(){
        $.ajax({
            type: 'GET',
            url: '/student/exam_data_13',
            success: function(data){
                $("#de_thi").html(data);
                $('input[type=radio]').change(function(){
                    var id = $(this).data('id');
                    $("#stt_"+id).find('span').first().removeClass("label-danger").addClass("label-success");
                    $("#stt_"+id).find('i').first().removeClass('fa-close').addClass('fa-check');
                });
            },
        });
    })

    $("#submit").click(function(){
        if(confirm("Bạn có chắc chắn nộp bài không ?")){
            var de_id = $("input[name=de_id]").val();
            var dap_an_id = [];
            $("input[type=radio]:checked").each(function(){
                dap_an_id.push($(this).data('da_id'));
            })
            var token = $("input[name=csrfmiddlewaretoken]").val();
            $("#processing").modal({backdrop: 'static', keyboard: false});
            $.ajax({
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(event){
                        var percent = Math.round((event.loaded / event.total) * 100) + '%';
                        $("#progressBar").attr("style","width:"+percent);
                        $("#progressBar").text(percent);
    //                    $("#loaded_n_total").html("Tải lên " + event.loaded + " bytes của " + event.total);
                    }, false);
                    $("#cancel_upload").click(function(){
                        xhr.abort();
                    });
                    return xhr;
                  },
                type: 'POST',
                url: location.href,
                data:{'csrfmiddlewaretoken':token, 'de_id':de_id,'dap_an_id':JSON.stringify(dap_an_id)},
                success:function(){
                    $("#processing").modal('hide');
                    location.reload();
                },
            });
        }
    });

});



