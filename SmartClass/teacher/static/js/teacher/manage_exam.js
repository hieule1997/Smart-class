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
            $("input[name=sl_tn]").bind('keyup mouseup', function () {
                $("#sl_max").html($(this).val());
            });
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
        "ordering": false,
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
                    if (table_ques_selected.data().count() < $("#sl_max").text()){
                        alert("Chưa đủ số lượng câu hỏi");
                        return false;
                    }else if (table_ques_selected.data().count() > $("#sl_max").text()){
                        alert("Quá số lượng câu hỏi");
                        return false;
                    }
                    var token = $("input[name=csrfmiddlewaretoken]").val();
                    var ten_de = $('input[name=ten_de]').val();
                    if(ten_de == ''){
                        alert("Chưa đặt tên");
                        return false;
                    }
                    var mon = $('#gv_mon option:selected').val();
                    var loai_de = $('#loai_de option:selected').val();
                    var list_ques = []
                    $('#list_ques_selected tbody tr').each(function(){
                        list_ques.push($(this).find('p').first().attr('id').split('_')[1]);
                    });
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
                         type:'POST',
                         url:location.href,
                         data:{'csrfmiddlewaretoken': token, 'ten_de':ten_de, 'mon':mon, 'loai_de':loai_de,
                         'list_ques':JSON.stringify(list_ques)},
                         success: function(){
                            $("#processing").modal('hide');
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
        if (table_question.data().count() == 0){
            return false;
        }
        var id = $(this).find('p').first().attr('id').split("_")[2];
        $('#question_title').html('Câu hỏi #'+id);
        var tom_tat = $("#tom_tat_"+id).text();
        var dang_cau_hoi = $("#dang_cau_hoi_"+id).text();
        var dinh_kem = "/media/" + $("#dinh_kem_"+id).text();
        var noi_dung = $("#noi_dung_"+id).text();
        var dap_an = [];
        var dung = [];
        var ch =`
        <input type="hidden" name="id" value=${id}>
        <input type="hidden" name="tom_tat" value="${tom_tat}">
        <input type="hidden" name="dang_cau_hoi" value="${dang_cau_hoi}">
        <label>Nội dung:</label>
        `;
        var da ='';
        $(".dap_an_"+id).each(function(){
            dap_an.push($(this).text());
            if ($(this).data("dung")=== "True"){
                dung.push("(Đúng)");
            }
            else{
                dung.push("");
            }
        });
        $("#khung_modal").html("");
        if (dang_cau_hoi.includes("Hình ảnh")){
            ch += `<img id="hinh_anh" style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src=${dinh_kem} alt="không tồn tại" />`;
        }

        if ( dang_cau_hoi.includes("Âm thanh")){
            ch += `<br><audio id="media" controls width="100%" src=${dinh_kem}></audio>`;
        }

        if ( dang_cau_hoi.includes("Video")){
            ch += `<video id="media" controls width="100%" src=${dinh_kem}></video>`;
        }

        if (dang_cau_hoi.includes("Trắc nhiệm")){
            da +=`
            <br>
            <pre style="white-space: pre-wrap;" name="noi_dung">
${noi_dung}
A:${dap_an[0]} ${dung[0]}
B:${dap_an[1]} ${dung[1]}
C:${dap_an[2]} ${dung[2]}
D:${dap_an[3]} ${dung[3]}
            </pre>
            `;
        }
        $("#khung_modal").html(ch+da);
        $("#question").modal("show");
        $("#select_question").show();
        $("#remove_question").hide();
    });

    $('#list_ques_selected tbody').on( 'click', 'tr', function () {
        if (table_ques_selected.data().count() == 0){
            return false;
        }
        var id = $(this).find('p').first().attr('id').split("_")[1];
        $('#question_title').html('Câu hỏi #'+id);
        var dang_cau_hoi = $(this).find("input[name=dang_cau_hoi]").first().val();
        var noi_dung = $(this).find("pre[name=noi_dung]").first().text();
        var src = $(this).find("input[name=src]").first().val();
        var media =`
        <input type="hidden" name="id" value=${id}>
        <label>Nội dung:</label>
        `;
        var text = ''
        var da ='';
        $("#khung_modal").html("");
        if (dang_cau_hoi.includes("Hình ảnh")){
            media += `<img style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src=${src} alt="không tồn tại" />`;
        }

        if ( dang_cau_hoi.includes("Âm thanh")){
            media += `<br><audio controls width="100%" src=${src}></audio>`;
        }

        if ( dang_cau_hoi.includes("Video")){
            media += `<video controls width="100%" src=${src}></video>`;
        }

        if (dang_cau_hoi.includes("Trắc nhiệm")){
            text +=`
            <br>
            <pre style="white-space: pre-wrap;" name="noi_dung">
${noi_dung}
            </pre>
            `;
        }
        $("#khung_modal").html(media+text);
        $("#question").modal("show");
        $("#select_question").hide();
        $("#remove_question").show();
    });

    $('#select_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();

        if (table_ques_selected.data().count() == $("#sl_max").text()){
            alert("Đã đủ số lượng câu hỏi");
            return false;
        }

        if($("#ch_"+id).text() != ""){
            alert("Câu hỏi đã được chọn");
            return false;
        }

        var tom_tat = modal.find('input[name=tom_tat]').first().val();
        var noi_dung = modal.find('pre[name=noi_dung]').first().text();
        var dang_cau_hoi = modal.find('input[name=dang_cau_hoi]').first().val();
        var src = '';
        if (dang_cau_hoi.includes("Hình ảnh")){
            src += modal.find('img').first().attr("src");
        }else if (dang_cau_hoi.includes("Âm thanh")){
            src += modal.find('audio').first().attr("src");
        }else if (dang_cau_hoi.includes("Video")){
            src += modal.find('video').first().attr("src");
        }
        var content = `
            <p id="ch_${id}">(${id})  ${tom_tat}</p>
            <input type="hidden" name="dang_cau_hoi" value="${dang_cau_hoi}">
            <pre hidden name="noi_dung">${noi_dung}</pre>
            <input hidden name="src" value=${src}>
        `
        table_ques_selected.row.add([content]).draw();
        $("#so_luong").html(table_ques_selected.data().count());
//        update_review();
    })

    $('#remove_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();
        var row = $("#ch_"+id).parent().parent();
        table_ques_selected.row(row).remove().draw();
        $("#so_luong").html(table_ques_selected.data().count());
//        update_review();
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
            var i = index+1;
            var dang_cau_hoi = $(this).find("input[name=dang_cau_hoi]").first().val();
            if(typeof(dang_cau_hoi) == 'undefined'){
                return false;
            }
            var noi_dung = $(this).find("pre[name=noi_dung]").first().text();
            var src = $(this).find("input[name=src]").first().val();
            content +=`
            <label>Câu hỏi ${i}:</label>
            `;
            if (dang_cau_hoi.includes("Hình ảnh")){
                content += `<img style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src=${src} alt="không tồn tại" />`;
            }

            if ( dang_cau_hoi.includes("Âm thanh")){
                content += `<br><audio controls width="100%" src=${src}></audio>`;
            }

            if ( dang_cau_hoi.includes("Video")){
                content += `<video controls width="100%" src=${src}></video>`;
            }

            if (dang_cau_hoi.includes("Trắc nhiệm")){
                content +=`
                <br>
                <pre style="white-space: pre-wrap;" name="noi_dung">
${noi_dung}
                </pre>
                `;
            }
        });
        $('#step-3').html(content);
    }

});

function load_trac_nhiem(){

};

