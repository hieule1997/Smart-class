$(document).ready(function(){
    var table_khoa = $('#list_khoa').DataTable({
        "ajax": {
            "type": "GET",
            "url": "/adminsc/manage_khoa_data",
            "contentType": "application/json; charset=utf-8",
            "data": function(result){
                return JSON.stringify(result);
            },
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 50,
    });

//    var table_teacher = $('#list_teacher').DataTable({
//        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
//        "displayLength": 10,
//    });
//
//    $("#detail_teacher").on('show.bs.modal', function(event){
//        var button = $(event.relatedTarget);
//        var title = button.data('title');
//        $("#detail_teacher_title").text("Chi tiết lớp "+title);
//        table_teacher.ajax.url("/adminsc/manage_teacher/data_" + title).load();
//    });
//
//    var table_student = $('#list_student').DataTable({
//        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
//        "displayLength": 10,
//    });
//
//    $("#detail_student").on('show.bs.modal', function(event){
//        var button = $(event.relatedTarget);
//        var title = button.data('title');
//        $("#detail_student_title").text("Chi tiết lớp "+title);
//        table_student.ajax.url("/adminsc/manage_student/data_" + title).load();
//    });

    $("#list_khoa").on('click', '.btn-danger', function(){
        var id = $(this).attr('id').split('_')[1];
        var token = $("input[name=csrfmiddlewaretoken]").val();
        if (confirm('Bạn có chắc ?')){
            $.ajax({
                type:'POST',
                url:location.href,
                data: {'delete':id, 'csrfmiddlewaretoken':token},
                success: function(){
                    table_khoa.ajax.reload(null,false);
                }
           });
        }
    });

    $("#new_khoa").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var title = button.data('title');
        $("#new_khoa  input[name=kieu]").val(title);
        if (title === 'edit'){
            var id = button.attr('id').split('_')[1];
            $("#new_khoa input[name=id]").val(id);
            var ten = $("#ten_"+id).text();
            $("#new_khoa input[name=khoa]").val(ten);
            var mota = $("#mota_"+id).text();
            $("#new_khoa textarea[name=mo_ta]").val(mota);
            $('#change_khoa_title').html("Chỉnh sửa khóa")
            $("#save_new_khoa").html("Chỉnh sửa");
        }else{
            $("#new_khoa input[name=id]").val(0);
            $('#change_khoa_title').html("Tạo mới khóa")
            $("#new_khoa input[name=khoa]").val("");
            $("#new_khoa textarea[name=mo_ta]").val("");
            $("#save_new_khoa").html("Tạo mới");
        }
    });

    $('#save_new_khoa').click( function(){
        var kieu = $("#new_khoa  input[name=kieu]").val();
        var token = $("#new_khoa input[name=csrfmiddlewaretoken]").val();
        var khoa = $("#new_khoa input[name=khoa]").val();
        var mo_ta = $("#new_khoa textarea[name=mo_ta]").val();
        var id = $("#new_khoa input[name=id]").val();
        console.log(kieu,token,id,khoa,mo_ta)
        $.ajax({
            type:'POST',
            url:location.href,
            data: {'csrfmiddlewaretoken':token, 'kieu':kieu, 'khoa': khoa, 'id':id, 'mo_ta':mo_ta},
            success: function(){
                $("#new_khoa").modal("hide");
                table_khoa.ajax.reload(null,false);
            }
        });
    });

});
