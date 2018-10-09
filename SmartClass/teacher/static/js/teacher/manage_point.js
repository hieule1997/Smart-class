$(document).ready(function(){
    var lop_ht = $('#lop_ht').val();
    var table_student = $('#list_student').DataTable({
        "ajax": {
            "type": "GET",
            "url": "/manage_point_data_"+lop_ht,
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
        $("#point_data").load("/manage_point_detail_"+ id_diem);
//        $.ajax({
//            type: "GET",
//            url: "/manage_point_detail_"+ id_diem,
//            success: function(data){
//                $("#point_data").html(data);
//            },
//        });
    });

});

function PrintElem(){
    $("body").first().html($("#point_data").html());
    window.print();
    location.reload();
    return true;
}
