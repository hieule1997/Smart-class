$(document).ready(function(){
    $('#thi').click(function(){
        $.ajax({
            type: 'GET',
            url: '/student/exam_data_14',
            success: function(data){
                $("#de_thi").html(data);
                $('input[type=radio]').change(function(){
                    var id = $(this).data('id');
                    $("#stt_"+id).find('span').first().removeClass("label-danger").addClass("label-success");
                    $("#stt_"+id).find('i').first().removeClass('fa-close').addClass('fa-check');
                });
                $('input[type=text]').change(function(){
                    check_empty($(this).data('id'),$(this).data('ch_id'));
                });

                $('textarea').change(function(){
                    console.log("hihi");
                    var text = $(this).val();
                    var id = $(this).data('id');
                    if (!text.replace(/\s/g, '').length) {
                        $("#stt_"+id).find('span').first().removeClass("label-success").addClass("label-danger");
                        $("#stt_"+id).find('i').first().removeClass('fa-check').addClass('fa-close');
                    }else{
                        $("#stt_"+id).find('span').first().removeClass("label-danger").addClass("label-success");
                        $("#stt_"+id).find('i').first().removeClass('fa-close').addClass('fa-check');
                    }

                });
            },
        });
    })

    function check_empty(id,ch_id){
        var ar = []
        $("input[name=dap_an_"+ch_id+"]").each(function(){
            ar.push($(this).val());
        })

        if (jQuery.inArray("", ar) == -1){
            $("#stt_"+id).find('span').first().removeClass("label-danger").addClass("label-success");
            $("#stt_"+id).find('i').first().removeClass('fa-close').addClass('fa-check');
        }else{
            $("#stt_"+id).find('span').first().removeClass("label-success").addClass("label-danger");
            $("#stt_"+id).find('i').first().removeClass('fa-check').addClass('fa-close');
        }
    }

    $("#submit").click(function(){
        if(confirm("Bạn có chắc chắn nộp bài không ?")){
            var de_id = $("input[name=de_id]").val();
            var dap_an_id = [];
            $("input[type=radio]:checked").each(function(){
                dap_an_id.push($(this).data('da_id'));
            })
            var dien_tu = {};
            $("input[type=text]").each(function(){
                dien_tu[$(this).data("da_id")] = $(this).val();
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
                data:{'csrfmiddlewaretoken':token, 'de_id':de_id,'dap_an_id':JSON.stringify(dap_an_id),
                'dien_tu':JSON.stringify(dien_tu)},
                success:function(){
                    $("#processing").modal('hide');
                    location.reload();
                },
            });
        }
    });

});



