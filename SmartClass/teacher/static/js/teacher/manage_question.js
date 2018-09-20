$(document).ready(function(){
    $("#dang_cau_hoi").on("change", function(event){
        var dang_cau_hoi = $("#dang_cau_hoi option:selected").text();
        var nd ='';
        if ( dang_cau_hoi.includes("Trắc nhiệm 2 đáp án")){
            nd = `
            <label>Nội dung:</label>
            <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10"></textarea>
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                    <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:"></textarea>
                </div>
            </div>
            `;
        }
        else if (dang_cau_hoi.includes("3 đáp án")){
            nd += `
            <label>Nội dung:</label>
            <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10"></textarea>
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="C:"></textarea>
                </div>
            </div>
            `;
        }
        else{
            nd +=`
            <label>Nội dung:</label>
            <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10"></textarea>
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="C:"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="D:"></textarea>
                </div>
            </div>
            `;
        }
        $("#khung").html(nd);
    });

    $("#luu_cau_hoi").on("click", function(event){
        var token = $("input[name=csrfmiddlewaretoken]").val();
        var mon = $("#mon option:selected").text();
        var chu_de = $("#chu_de").val();
        var dang_cau_hoi = $("#dang_cau_hoi option:selected").text();
        var do_kho = $("#do_kho option:selected").text();
        var noi_dung = $("#khung textarea[name=noi_dung]").val();
        var dap_an = [];
        $("#khung .dap_an").each(function(){
            if ($(this).is(':checked')){
                dap_an.push(1);
            }else{
                dap_an.push(0);
            }
        });
        var nd_dap_an = [];
        $("#khung .nd_dap_an").each(function(){
            nd_dap_an.push($(this).val());
        });
        $.ajax({
            type : "POST",
            url : location.href,
            data : {'csrfmiddlewaretoken':token, 'mon':mon, 'chu_de':chu_de, 'dang_cau_hoi':dang_cau_hoi,
            'do_kho':do_kho, 'noi_dung':noi_dung, 'dap_an':JSON.stringify(dap_an), 'nd_dap_an':JSON.stringify(nd_dap_an)},
            success : function(){
                $("#khung textarea[name=noi_dung]").val("");
                $("#khung .dap_an").each(function(){
                    $(this).prop('checked', false);
                });
                $("#khung .nd_dap_an").each(function(){
                    $(this).val("");
                });
                table_question.ajax.reload(null, false);
            },
        });
    });

    var table_question = $("#list_question").DataTable({
        "ajax": {
            "type": "GET",
            "url": "/question_data_" + $("#gv_mon option:selected").val() +"_0",
            "contentType": "application/json; charset=utf-8",
            "data": function(result){
                return JSON.stringify(result);
            },
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 25,
        "order": [[ 3, 'desc' ]],
    });

    $("#gv_mon").on('change', function(){
        table_question.ajax.url("/question_data_" + $("#gv_mon option:selected").val()+"_0").load();
    });

    $('#list_question tbody').on( 'click', 'tr', function () {
        var id = $(this).find('p').first().attr('id').split("_")[2];
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
            <label>Nội dung:</label>
            <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10" >${noi_dung}</textarea>
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                    <input type="radio" class="form-control dap_an" name="dap_an" ${dung[0]} >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:" >${dap_an[0]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[1]} >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:" >${dap_an[1]}</textarea>
                </div>
            </div>
            `;
        }
        else if (dang_cau_hoi.includes("3 đáp án")){
            nd += `
            <input type="hidden" name="id" value="${id}">
            <label>Nội dung:</label>
            <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10" >${noi_dung}</textarea>
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[0]} >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:" >${dap_an[0]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[1]} >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:" >${dap_an[1]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[2]} >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="C:" >${dap_an[2]}</textarea>
                </div>
            </div>
            `;
        }
        else{
            nd +=`
            <input type="hidden" name="id" value="${id}">
            <label>Nội dung:</label>
            <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10" >${noi_dung}</textarea>
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[0]} >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:" >${dap_an[0]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[1]} >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:" >${dap_an[1]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[2]} >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="C:" >${dap_an[2]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" name="dap_an" ${dung[3]} >
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="D:" >${dap_an[3]}</textarea>
                </div>
            </div>
            `;
        }
        $("#khung_modal").html(nd);
        $("#question").modal("show");
    });

    $("#edit_question").on('click', function(event){
        var token = $("input[name=csrfmiddlewaretoken]").val();
        var id = $("#khung_modal input[name=id]").val();
        var noi_dung = $("#khung_modal textarea[name=noi_dung]").val();
        var dap_an = [];
        $("#khung_modal .dap_an").each(function(){
            if ($(this).is(':checked')){
                dap_an.push(1);
            }else{
                dap_an.push(0);
            }
        });
        var nd_dap_an = [];
        $("#khung_modal .nd_dap_an").each(function(){
            nd_dap_an.push($(this).val());
        });
        $.ajax({
            type : "POST",
            url : location.href,
            data : {'csrfmiddlewaretoken':token, 'id': id, 'noi_dung':noi_dung, 'dap_an':JSON.stringify(dap_an),
             'nd_dap_an':JSON.stringify(nd_dap_an), 'edit':''},
            success : function(){
                $("#question").modal('hide');
                table_question.ajax.reload(null, false);
            },
        });
    });
});



