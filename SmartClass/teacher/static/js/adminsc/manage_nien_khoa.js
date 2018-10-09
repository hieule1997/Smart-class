$(document).ready(function(){
    var table_nien_khoa = $('#list_nien_khoa').DataTable({
        "ajax": {
            "type": "GET",
            "url": "/adminsc/manage_nien_khoa_data",
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

    $("#list_nien_khoa").on('click', '.btn-danger', function(){
        var id = $(this).attr('id').split('_')[1];
        var token = $("input[name=csrfmiddlewaretoken]").val();
        if (confirm('Bạn có chắc ?')){
            $.ajax({
                type:'POST',
                url:location.href,
                data: {'delete':id, 'csrfmiddlewaretoken':token},
                success: function(){
                    table_nien_khoa.ajax.reload(null,false);
                }
           });
        }
    });

    $("#new_nien_khoa").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var title = button.data('title');
        $("#new_nien_khoa  input[name=kieu]").val(title);
        if (title === 'edit'){
            var id = button.attr('id').split('_')[1];
            $("#new_nien_khoa input[name=id]").val(id);
            var ten = $("#ten_"+id).text();
            $("#new_nien_khoa input[name=khoa]").val(ten);
            var nam = $("#nam_"+id).text();
            $("#new_nien_khoa input[name=nam]").val(nam);
            $('#change_nien_khoa_title').html("Chỉnh sửa niên khóa")
            $("#save_new_nien_khoa").html("Chỉnh sửa");
        }else{
            $("#new_nien_khoa input[name=id]").val(0);
            $('#change_nien_khoa_title').html("Tạo mới niên khóa")
            $("#new_nien_khoa input[name=khoa]").val("");
            $("#new_nien_khoa input[name=nam]").val((new Date()).getFullYear());
            $("#save_new_nien_khoa").html("Tạo mới");
        }
    });

    $('#save_new_nien_khoa').click( function(){
        var kieu = $("#new_nien_khoa  input[name=kieu]").val();
        var token = $("#new_nien_khoa input[name=csrfmiddlewaretoken]").val();
        var khoa = $("#new_nien_khoa input[name=khoa]").val();
        var nam = $("#new_nien_khoa input[name=nam]").val();
        var id = $("#new_nien_khoa input[name=id]").val();
        $.ajax({
            type:'POST',
            url:location.href,
            data: {'csrfmiddlewaretoken':token, 'kieu':kieu, 'khoa': khoa, 'id':id, 'nam':nam},
            success: function(){
                $("#new_nien_khoa").modal("hide");
                table_nien_khoa.ajax.reload(null,false);
            }
        });
    });


});
