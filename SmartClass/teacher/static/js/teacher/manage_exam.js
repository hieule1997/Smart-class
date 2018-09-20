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
                        list_ques.push($(this).find('p').first().attr('id').split('_')[1]);
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

    $("#gv_mon").on('change', function(){
        table_question.ajax.url("/question_data_" + $("#gv_mon option:selected").val() +"_1").load();
        table_ques_selected.clear().draw();
    });

    $('#list_question tbody').on( 'click', 'tr', function () {
        var id = $(this).find('p').first().attr('id').split("_")[2];
        $('#question_title').html('Câu hỏi #'+id);
        var tom_tat = $("#tom_tat_"+id).text();
        var dang_cau_hoi = $("#dang_cau_hoi_"+id).text();
        var noi_dung = $("#noi_dung_"+id).text();
        var dap_an = []
        var dung = []
        var nd ='';
        $(".dap_an_"+id).each(function(){
            dap_an.push($(this).text());
            if ($(this).data("dung")=== "True"){
                dung.push("(Đúng)");
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
            <pre style="white-space: pre-wrap;" name="noi_dung">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
            </pre>
            `;
        }
        else if (dang_cau_hoi.includes("3 đáp án")){
            nd += `
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="tom_tat" value="${tom_tat}">
            <label>Nội dung:</label>
            <pre style="white-space: pre-wrap;" name="noi_dung">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
C:${dap_an[2]} ${dung[2]}
            </pre>
            `;
        }
        else{
            nd +=`
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="tom_tat" value="${tom_tat}">
            <label>Nội dung:</label>
            <pre style="white-space: pre-wrap;" name="noi_dung">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
C:${dap_an[2]} ${dung[2]}
D:${dap_an[3]} ${dung[3]}
            </pre>
            `;
        }
        $("#khung_modal").html(nd);
        $("#question").modal("show");
        $("#select_question").show();
        $("#remove_question").hide();
    });

    $('#list_ques_selected tbody').on( 'click', 'tr', function () {
        var id = $(this).find('p').first().attr('id').split("_")[1];
        $('#question_title').html('Câu hỏi #'+id);
        var tom_tat = $("#tom_tat_"+id).text();
        var dang_cau_hoi = $("#dang_cau_hoi_"+id).text();
        var noi_dung = $("#noi_dung_"+id).text();
        var dap_an = []
        var dung = []
        var nd ='';
        $(".dap_an_"+id).each(function(){
            dap_an.push($(this).text());
            if ($(this).data("dung")=== "True"){
                dung.push("(Đúng)");
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
            <pre style="white-space: pre-wrap;" name="noi_dung">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
            </pre>
            `;
        }
        else if (dang_cau_hoi.includes("3 đáp án")){
            nd += `
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="tom_tat" value="${tom_tat}">
            <label>Nội dung:</label>
            <pre style="white-space: pre-wrap;" name="noi_dung">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
C:${dap_an[2]} ${dung[2]}
            </pre>
            `;
        }
        else{
            nd +=`
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="tom_tat" value="${tom_tat}">
            <label>Nội dung:</label>
            <pre style="white-space: pre-wrap;" name="noi_dung">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
C:${dap_an[2]} ${dung[2]}
D:${dap_an[3]} ${dung[3]}
            </pre>
            `;
        }
        $("#khung_modal").html(nd);
        $("#question").modal("show");
        $("#select_question").hide();
        $("#remove_question").show();
    });

    $('#select_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();
        var tom_tat = modal.find('input[name=tom_tat]').first().val();
        var content = `
            <p id="ch_${id}">(${id})  ${tom_tat}</p>
        `
        table_ques_selected.row.add([content]).draw();
        $("#so_luong").html(table_ques_selected.data().count());
    })

    $('#remove_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();
        var row = $("#ch_"+id).parent().parent();
        table_ques_selected.row(row).remove().draw();
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
            success: function(data){
                $("#khung_exam").html(data);
                $("#exam").modal("show");
            },
        });
    });

    function update_review(){
        var content = '';
        $('#list_ques_selected tbody tr').each(function(index){
            var id = $(this).find('p').first().attr('id').split('_')[1];
            var dang_cau_hoi = $("#dang_cau_hoi_"+id).text();
            var noi_dung = $("#noi_dung_"+id).text();
            var dap_an = []
            var dung = []
            var nd ='';
            $(".dap_an_"+id).each(function(){
                dap_an.push($(this).text());
                if ($(this).data("dung")=== "True"){
                    dung.push("(Đúng)");
                }
                else{
                    dung.push("");
                }
            });
            var i = index+1;
            if ( dang_cau_hoi.includes("Trắc nhiệm 2 đáp án")){
                content += `
                <label>Câu hỏi ${i}:</label>
                <pre style="white-space: pre-wrap;">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
                </pre>
                `
            }
            else if (dang_cau_hoi.includes("Trắc nhiệm 3 đáp án")){
                content += `
                <label>Câu hỏi ${i}:</label>
                <pre style="white-space: pre-wrap;">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
C:${dap_an[2]} ${dung[2]}
                </pre>
                `
            }else{
            content += `
                <label>Câu hỏi ${i}:</label>
                <pre style="white-space: pre-wrap;">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
C:${dap_an[2]} ${dung[2]}
C:${dap_an[3]} ${dung[3]}
                </pre>
                `
            }

        });

        $('#step-3').html(content);
    }

});



