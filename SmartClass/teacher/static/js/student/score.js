$(document).ready(function(){
//    var lop_ht = $('#lop_ht').val();
    var table_score = $('#list_score').DataTable({
        "ajax": {
            "type": "GET",
            "url": "/student/score_data",
            "contentType": "application/json; charset=utf-8",
            "data": function(result){
                return JSON.stringify(result);
            },
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 25,
        dom: 'Bfrtip',
        buttons: ['csv', 'excel', 'print', 'pdf'],
    });

    $("#point").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var id_diem = button.data('id');
        $.ajax({
            type: "GET",
            url: "/student/score_data_detail_"+ id_diem,
            success: function(data){
                $("#point_data").html(data);
            },
        });
    });
});



