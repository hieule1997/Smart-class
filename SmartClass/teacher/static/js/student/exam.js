$(document).ready(function(){
    $('#thi').click(function(){
        $.ajax({
            type: 'GET',
            url: '/student/exam_data_8',
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
            $.ajax({
                type: 'POST',
                url: location.href,
                data:{'csrfmiddlewaretoken':token, 'de_id':de_id, 'cau_hoi_id':JSON.stringify(cau_hoi_id),
                'dap_an_id':JSON.stringify(dap_an_id)},
                success:function(){
                    location.reload();
                },
            });
        }
    });

});



