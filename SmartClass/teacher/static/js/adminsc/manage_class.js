$(document).ready(function(){
    var table_class = $('#list_class').DataTable({
        "ajax": {
            "type": "GET",
            "url": "/adminsc/manage_class/data",
            "contentType": "application/json; charset=utf-8",
            "data": function(result){
                return JSON.stringify(result);
            },
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 50,
    });

    var table_teacher = $('#list_teacher').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 10,
    });

    $("#detail_teacher").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var title = button.data('title');
        $("#detail_teacher_title").text("Chi tiết lớp "+title);
        table_teacher.ajax.url("/adminsc/manage_teacher/data_" + title).load();
    });

    var table_student = $('#list_student').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 10,
    });

    $("#detail_student").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var title = button.data('title');
        $("#detail_student_title").text("Chi tiết lớp "+title);
        table_student.ajax.url("/adminsc/manage_student/data_" + title).load();
    });

    $("#list_class").on('click', '.btn-danger', function(){
        var id = $(this).attr('id').split('_')[1];
        var token = $("input[name=csrfmiddlewaretoken]").val();
        if (confirm('Bạn có chắc ?')){
            $.ajax({
                type:'POST',
                url:location.href,
                data: {'delete':id, 'csrfmiddlewaretoken':token},
                success: function(){
                    table_class.ajax.reload(null,false);
                }
           });
        }
    });

    $("#new_class").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var title = button.data('title');
        $("#new_class  input[name=kieu]").val(title);
        if (title === 'edit'){
            var id = button.attr('id').split('_')[1];
            $("#new_class input[name=id]").val(id);
            var ten = $("#ten_"+id).text();
            $("#new_class input[name=ten]").val(ten);
            var khoa = $("#khoa_"+id).text();
            $("#new_class input[name=khoa]").val(khoa);
            var nien_khoa = $("#nien_khoa_"+id).text();
            $("#new_class input[name=nien_khoa]").val(nien_khoa);
            $('#change_class_title').html("Chỉnh sửa lớp")
            $("#save_new_class").html("Chỉnh sửa");
        }else{
            $("#new_class input[name=id]").val(0);
            $('#change_class_title').html("Tạo mới lớp")
            $("#new_class input[name=ten]").val("");
            $("#new_class input[name=khoa]").val("");
            $("#new_class input[name=nien_khoa]").val("");
            $("#save_new_class").html("Tạo mới");
        }
    });

    $('#save_new_class').click( function(){
        var kieu = $("#new_class  input[name=kieu]").val();
        var token = $("#new_class input[name=csrfmiddlewaretoken]").val();
        var ten = $("#new_class input[name=ten]").val();
        var id = $("#new_class input[name=id]").val();
        var khoa = $("#new_class input[name=khoa]").val();
        var nien_khoa = $("#new_class input[name=nien_khoa]").val();
        $.ajax({
            type:'POST',
            url:location.href,
            data: {'csrfmiddlewaretoken':token, 'kieu':kieu, 'ten': ten, 'id':id , 'khoa':khoa, 'nien_khoa':nien_khoa},
            success: function(){
                $("#new_class").modal("hide");
                table_class.ajax.reload(null,false);
            }
        });
    });


});
