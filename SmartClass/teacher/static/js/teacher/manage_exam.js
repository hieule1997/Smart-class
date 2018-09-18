$(document).ready(function(){
    $("#ck_tn").change(function() {
        if(this.checked) {
            var n = `
                <div class="form-group">
                  <label class="control-label col-md-3 col-sm-3 col-xs-12" >Số câu trắc nhiệm
                  </label>
                  <div class="col-md-3 col-sm-3 col-xs-12">
                    <input type="number" class="form-control col-md-7 col-xs-12" min=1 max=200 name="sl_tn">
                  </div>
                </div>
            `
            $("#sl_tn").html(n);
        }
        else{
            $("#sl_tn").html("");
        }
    });

    $("#ck_dt").change(function() {
        if(this.checked) {
            var n = `
                <div class="form-group">
                  <label class="control-label col-md-3 col-sm-3 col-xs-12" >Số câu điền từ
                  </label>
                  <div class="col-md-3 col-sm-3 col-xs-12">
                    <input type="number" class="form-control col-md-7 col-xs-12" min=1 max=200 name="sl_dt">
                  </div>
                </div>
            `
            $("#sl_dt").html(n);
        }
        else{
            $("#sl_dt").html("");
        }
    });

    $("#ck_tl").change(function() {
        if(this.checked) {
            var n = `
                <div class="form-group">
                  <label class="control-label col-md-3 col-sm-3 col-xs-12" >Số câu tự luận
                  </label>
                  <div class="col-md-3 col-sm-3 col-xs-12">
                    <input type="number" class="form-control col-md-7 col-xs-12" min=1 max=200 name="sl_tl">
                  </div>
                </div>
            `
            $("#sl_tl").html(n);
        }
        else{
            $("#sl_tl").html("");
        }
    });

    var table_ques_selected = $("#list_ques_selected").DataTable({
        "searching": false,
        "scrollY": '400px',
        "scrollCollapse": true,
        "paging": false,
    });

    var table_question = $("#list_question").DataTable({
        "ajax": {
            "type": "GET",
            "url": "/question_data_" + $("#gv_mon option:selected").val() +"_1",
            "contentType": "application/json; charset=utf-8",
            "data": function(result){
                return JSON.stringify(result);
            },
            "complete": function(){
                $('#wizard').find('.buttonFinish').first().click(function(){
                    var token = $("input[name=csrfmiddlewaretoken]").val();
                    var ten_de = $('input[name=ten_de]').val();
                    var mon = $('#gv_mon option:selected').val();
                    var loai_de = $('#loai_de option:selected').val();
                    var list_ques = []
                    $('#list_ques_selected tbody tr').each(function(){
                        list_ques.push($(this).find('p').first().data('id'));
                    });
                    $.ajax({
                        'type':'POST',
                        'url':location.href,
                        'data':{'csrfmiddlewaretoken': token, 'ten_de':ten_de, 'mon':mon, 'loai_de':loai_de,
                         'list_ques':JSON.stringify(list_ques)},
                         'success': function(){
                            location.reload();
                         },
                    });
                });
            }
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 10,
        "order": [[ 3, 'desc' ]],
        "scrollCollapse": false,
    });

    $('#list_question tbody').on( 'click', 'tr', function () {
        var id = $(this).find('p').first().attr('id').split("_")[2];
        var tom_tat = $("#tom_tat_"+id).text();
        var dang_cau_hoi = $("#dang_cau_hoi_"+id).text();
        var noi_dung = $("#noi_dung_"+id).text();
        var dap_an = []
        var dung = []
        var nd ='';
        $(".dap_an_"+id).each(function(){
            dap_an.push($(this).text());
            if ($(this).data("dung")=== "True"){
                dung.push("checked");
            }
            else{
                dung.push("");
            }
        });
        if ( dang_cau_hoi.includes("Trắc nhiệm 2 đáp án")){
            nd = `
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="tom_tat" value="${tom_tat}">
            <label>Nội dung:</label>
            <textarea class='form-control '  name="noi_dung" placeholder="Nhập nội dung" rows="10" disabled >${noi_dung}</textarea>
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                    <input type="radio" class="form-control dap_an" name="dap_an" ${dung[0]}  disabled >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:"  disabled >${dap_an[0]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[1]}  disabled >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:"  disabled >${dap_an[1]}</textarea>
                </div>
            </div>
            `;
        }
        else if (dang_cau_hoi.includes("3 đáp án")){
            nd += `
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="tom_tat" value="${tom_tat}">
            <label>Nội dung:</label>
            <textarea  class='form-control ' name="noi_dung" placeholder="Nhập nội dung" rows="10"  disabled >${noi_dung}</textarea>
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[0]}  disabled >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:"  disabled >${dap_an[0]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[1]}  disabled >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:"  disabled >${dap_an[1]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[2]}  disabled >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="C:"  disabled >${dap_an[2]}</textarea>
                </div>
            </div>
            `;
        }
        else{
            nd +=`
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="tom_tat" value="${tom_tat}">
            <label>Nội dung:</label>
            <textarea  class="form-control " name="noi_dung" placeholder="Nhập nội dung" rows="10"  disabled >${noi_dung}</textarea>
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[0]}  disabled >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:"  disabled >${dap_an[0]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[1]}  disabled >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:"  disabled >${dap_an[1]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[2]}  disabled >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="C:"  disabled >${dap_an[2]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[3]}  disabled >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="D:"  disabled >${dap_an[3]}</textarea>
                </div>
            </div>
            `;
        }
        $("#khung_modal").html(nd);
        $("#question").modal("show");
    });

    $('#select_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();
        var tom_tat = modal.find('input[name=tom_tat]').first().val();
        var content = `
            <p data-id="${id}">(${id})  ${tom_tat}</p>
        `
        table_ques_selected.row.add([content]).draw();
        $("#so_luong").html(table_ques_selected.data().count());
    })

    var table_exam = $("#list_exam").DataTable({
        'ajax':{
            'type': "GET",
            'url': "/de_data_0",
            'data': function(result){
                return JSON.stringify(result);
            },
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "displayLength": 10,
            "order": [[ 3, 'desc' ]],
            "scrollCollapse": false,
        },
    });


    $('#list_exam tbody').on( 'click', 'tr', function () {
        var id = $(this).find('p').first().data("id");
        $.ajax({
            type:"GET",
            url:"/chi_tiet_de_data_" + id,
            contentType: "application/json; charset=utf-8",
            success: function(data){
                $("#khung_exam").html(data);
                $("#exam").modal("show");
            },
        });
    });

});



