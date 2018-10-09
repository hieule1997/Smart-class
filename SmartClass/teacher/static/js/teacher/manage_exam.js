$(document).ready(function(){
    var max_tn = 0;
    var max_dt = 0;
    var max_tl = 0;
    var max_ga = 0;
    var max_gh = 0;
    var chon_tn = 0;
    var chon_dt = 0;
    var chon_tl = 0;
    var chon_ga = 0;
    var chon_gh = 0;

    $(".so_luong").bind('keyup mouseup', function () {
        if($(this).attr("name") == 'sl_tn'){
            max_tn = parseInt($(this).val());
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else if($(this).attr("name") == 'sl_dt'){
            max_dt = parseInt($(this).val());
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
        }
        else if($(this).attr("name") == 'sl_tl'){
            max_tl = parseInt($(this).val());
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
        }
        else if($(this).attr("name") == 'sl_ga'){
            max_ga = parseInt($(this).val());
            $("#max_ga").html("Ghi âm: "+chon_ga+ "/" + max_ga);
        }
        else if($(this).attr("name") == 'sl_gh'){
            max_gh = parseInt($(this).val());
            $("#max_gh").html("Ghi hình: "+chon_gh+ "/" + max_gh);
        }
    });

    var table_ques_selected = $("#list_ques_selected").DataTable({
        "searching": false,
        "scrollY": '400px',
        "scrollCollapse": true,
        "paging": false,
        "ordering": false,
    });

    $("#ck_tn").change(function() {
        if(this.checked) {
            $("input[name=sl_tn]").prop("disabled",false);
            $("input[name=pt_tn]").prop("disabled",false);
            chon_tn = 0;
            max_tn = parseInt($("input[name=sl_tn]").val());
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else{
            $("input[name=sl_tn]").prop("disabled",true);
            $("input[name=pt_tn]").prop("disabled",true);
            chon_tn = 0;
            max_tn = 0;
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
            $(".dch").each(function(){
                if(($(this).val()).includes("Trắc nhiệm")){
                    var row = $(this).parent().parent();
                    table_ques_selected.row(row).remove().draw();
                }
            });
        }
    });

    $("#ck_dt").change(function() {
        if(this.checked) {
            $("input[name=sl_dt]").prop("disabled",false);
            $("input[name=pt_dt]").prop("disabled",false);
            chon_dt = 0;
            max_dt = parseInt($("input[name=sl_dt]").val());
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
        }
        else{
            $("input[name=sl_dt]").prop("disabled",true);
            $("input[name=pt_dt]").prop("disabled",true);
            chon_dt = 0;
            max_dt = 0;
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
            $(".dch").each(function(){
                if(($(this).val()).includes("Điền từ")){
                    var row = $(this).parent().parent();
                    table_ques_selected.row(row).remove().draw();
                }
            });
        }
    });

    $("#ck_tl").change(function() {
        if(this.checked) {
            $("input[name=sl_tl]").prop("disabled",false);
            $("input[name=pt_tl]").prop("disabled",false);
            chon_tl = 0;
            max_tl = parseInt($("input[name=sl_tl]").val());
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
        }
        else{
            $("input[name=sl_tl]").prop("disabled",true);
            $("input[name=pt_tl]").prop("disabled",true);
            chon_tl = 0;
            max_tl = 0;
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
            $(".dch").each(function(){
                if(($(this).val()).includes("Tự luận")){
                    var row = $(this).parent().parent();
                    table_ques_selected.row(row).remove().draw();
                }
            });
        }
    });

    $("#ck_ga").change(function() {
        if(this.checked) {
            $("input[name=sl_ga]").prop("disabled",false);
            $("input[name=pt_ga]").prop("disabled",false);
            chon_ga = 0;
            max_ga = parseInt($("input[name=sl_ga]").val());
            $("#max_ga").html("Ghi âm: "+chon_ga+ "/" + max_ga);
        }
        else{
            $("input[name=sl_ga]").prop("disabled",true);
            $("input[name=pt_ga]").prop("disabled",true);
            chon_ga = 0;
            max_ga = 0;
            $("#max_ga").html("Ghi âm: "+chon_ga+ "/" + max_ga);
            $(".dch").each(function(){
                if(($(this).val()).includes("Ghi âm")){
                    var row = $(this).parent().parent();
                    table_ques_selected.row(row).remove().draw();
                }
            });
        }
    });

    $("#ck_gh").change(function() {
        if(this.checked) {
            $("input[name=sl_gh]").prop("disabled",false);
            $("input[name=pt_gh]").prop("disabled",false);
            chon_gh = 0;
            max_gh = parseInt($("input[name=sl_gh]").val());
            $("#max_gh").html("Ghi hình: "+chon_gh+ "/" + max_gh);
        }
        else{
            $("input[name=sl_gh]").prop("disabled",true);
            $("input[name=pt_gh]").prop("disabled",true);
            chon_gh = 0;
            max_gh = 0;
            $("#max_gh").html("Ghi hình: "+chon_gh+ "/" + max_gh);
            $(".dch").each(function(){
                if(($(this).val()).includes("Ghi hình")){
                    var row = $(this).parent().parent();
                    table_ques_selected.row(row).remove().draw();
                }
            });
        }
    });

    $(".r_check").on('change',function(){
        if (this.checked){
            $("."+$(this).attr('name')).prop('disabled',false)
        }else{
            $("."+$(this).attr('name')).prop('disabled',true)
        }
    });


    $("#r_tao_de").click(function(){
        var ten_de = $('input[name=r_ten_de]').val();
        if(ten_de == ''){
            alert("Chưa đặt tên");
            return false;
        }
        var cau_truc = {};
        var pham_tram = 0;
        $(".r_phan_tram").each(function(){
            if(typeof($(this).attr("disabled")) == 'undefined'){
                cau_truc[$(this).attr('name')] = parseInt($(this).val());
                pham_tram += parseInt($(this).val());
            }
            else{
                cau_truc[$(this).attr('name')] = (-1);
            }
        });
        if(pham_tram != 100){
            alert("Tổng phần trăm điểm số phải đủ 100%");
            return false;
        }
        if(jQuery.inArray(0, cau_truc) != -1){
            alert("Chưa chọn phần trăm điểm số");
            return false;
        }
        var chi_tiet_so_luong = {};
        var so_luong = 0;
        $(".r_so_luong").each(function(){
            if(typeof($(this).attr("disabled")) == 'undefined'){
                chi_tiet_so_luong[$(this).attr('name')] = parseInt($(this).val());
                so_luong += parseInt($(this).val());
            }
            else{
                chi_tiet_so_luong[$(this).attr('name')] = (-1);
            }
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
             data:{'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val(),'ten_de': ten_de, 'random': '',
                'mon': $('#r_gv_mon option:selected').val(),'loai_de': $('#r_loai_de option:selected').val(),
                'cau_truc': JSON.stringify(cau_truc),'chi_tiet_so_luong': JSON.stringify(chi_tiet_so_luong),
                'thoi_gian': $('input[name=r_thoi_gian]').val(),'so_luong':so_luong},
             success: function(msg, status, jqXHR){
                if (msg.length < 255){
                    $("#cancel_upload").click();
                    alert(msg);
                }else{
                    $("#processing").modal('hide');
                    location.reload();
                }
             },
        });
    });

    var table_question = $("#list_question").DataTable({
        "ajax": {
            "type": "GET",
            "url": "/question_data_" + $("#gv_mon option:selected").val() +"_1_"+ $('#loai_de option:selected').val(),
            "contentType": "application/json; charset=utf-8",
            "data": function(result){
                return JSON.stringify(result);
            },
            "complete": function(){
                $('#wizard').find('.buttonFinish').first().click(function(){
                    if (chon_tn < max_tn){
                        alert("Chưa đủ số lượng câu hỏi trắc nhiệm");
                        return false;
                    }
                    else if (chon_tn > max_tn){
                        alert("Quá số lượng câu hỏi trắc nhiệm");
                        return false;
                    }

                    if (chon_dt < max_dt){
                        alert("Chưa đủ số lượng câu hỏi điền từ");
                        return false;
                    }
                    else if (chon_dt > max_dt){
                        alert("Quá số lượng câu hỏi điền từ");
                        return false;
                    }

                    if (chon_tl < max_tl){
                        alert("Chưa đủ số lượng câu hỏi tự luận");
                        return false;
                    }
                    else if (chon_tl > max_tl){
                        alert("Quá số lượng câu hỏi tự luận");
                        return false;
                    }

                    if (chon_ga < max_ga){
                        alert("Chưa đủ số lượng câu hỏi ghi hình");
                        return false;
                    }
                    else if (chon_ga > max_ga){
                        alert("Quá số lượng câu hỏi ghi hình");
                        return false;
                    }

                    if (chon_gh < max_gh){
                        alert("Chưa đủ số lượng câu hỏi ghi âm");
                        return false;
                    }
                    else if (chon_gh > max_gh){
                        alert("Quá số lượng câu hỏi ghi âm");
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
                    var cau_truc = {};
                    var pham_tram = 0;
                    $(".phan_tram").each(function(){
                        if(typeof($(this).attr("disabled")) == 'undefined'){
                            cau_truc[$(this).attr('name')] = parseInt($(this).val());
                            pham_tram += parseInt($(this).val());
                        }
                        else{
                            cau_truc[$(this).attr('name')] = (-1);
                        }
                    });

                    if(pham_tram != 100){
                        alert("Tổng phần trăm điểm số phải đủ 100%");
                        return false;
                    }
                    if(jQuery.inArray(0, cau_truc) != -1){
                        alert("Chưa chọn phần trăm điểm số");
                        return false;
                    }
                    var so_luong = 0;
                    var chi_tiet_so_luong = {}
                    $(".so_luong").each(function(){
                        if(typeof($(this).attr("disabled")) == 'undefined'){
                            chi_tiet_so_luong[$(this).attr('name')] = parseInt($(this).val());
                            so_luong += parseInt($(this).val());
                        }
                        else{
                            chi_tiet_so_luong[$(this).attr('name')] = (-1);
                        }
                    });
                    if(jQuery.inArray(0, chi_tiet_so_luong) != -1){
                        alert("Chưa chọn số lượng câu hỏi");
                        return false;
                    }
                    var dict_ques = {};
                    $('#list_ques_selected tbody tr').each(function(){
                        dict_ques[$(this).find('p').first().attr('id').split('_')[1]] = $(this).find('input[name=don]').first().val()
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
                         'dict_ques':JSON.stringify(dict_ques), 'cau_truc':JSON.stringify(cau_truc),
                         'so_luong': so_luong, 'chi_tiet_so_luong':JSON.stringify(chi_tiet_so_luong),
                         'thoi_gian': $('input[name=thoi_gian]').val()},
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

    $("#gv_mon, #loai_de").on('change', function(){
        path = "/question_data_" + $("#gv_mon option:selected").val() +"_1_"+ $('#loai_de option:selected').val();
        table_question.ajax.url(path).load();
        table_ques_selected.clear().draw();
    });


    $('#list_question tbody').on( 'click', 'tr', function () {
        if (table_question.data().count() == 0){
            return false;
        }
        var id = $(this).find('p').first().attr('id').split("_")[2];
        var don = $(this).find('p').first().data('don');
        $('#question_title').html('Câu hỏi #'+id);
        $.ajax({
            type: "GET",
            url: "question_data_detail_"+id+"_read_"+don,
            success: function(data){
                $("#khung_modal").html(data);
                $("#question").modal("show");
                $("#select_question").show();
                $("#remove_question").hide();
            }
        });
    });

    $('#list_ques_selected tbody').on( 'click', 'tr', function () {
        if (table_ques_selected.data().count() == 0){
            return false;
        }
        var id = $(this).find('p').first().attr('id').split("_")[1];
        var don = $(this).find('p').first().data('don');
        $('#question_title').html('Câu hỏi #'+id);
        $.ajax({
            type: "GET",
            url: "question_data_detail_"+id+"_read_"+don,
            success: function(data){
                $("#khung_modal").html(data);
                $("#question").modal("show");
                $("#select_question").hide();
                $("#remove_question").show();
            }
        });
    });

    $('#select_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();
        var dang_cau_hoi = modal.find("input[name=dang_cau_hoi]").first().val();
        var don = modal.find("input[name=don]").first().val();
        var so_cau_hoi = parseInt(modal.find("input[name=so_cau_hoi]").first().val());
        if($("#ch_"+id).text() != ""){
            alert("Câu hỏi đã được chọn");
            return false;
        }

        if(dang_cau_hoi.includes("Trắc nhiệm")){
            if (chon_tn + so_cau_hoi > max_tn){
                alert("Vượt quá số lượng câu hỏi trắc nhiệm");
                return false;
            }
            chon_tn += so_cau_hoi;
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else if(dang_cau_hoi.includes("Điền từ")){
            if (chon_tn + so_cau_hoi > max_dt){
                alert("Vượt quá số lượng câu hỏi điền từ");
                return false;
            }
            chon_dt += so_cau_hoi;
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
        }
        else if(dang_cau_hoi.includes("Tự luận")){
            if (chon_tn + so_cau_hoi > max_tl){
                alert("Vượt quá số lượng câu hỏi tự luận");
                return false;
            }
            chon_tl = chon_tl + so_cau_hoi;
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
        }
        else if(dang_cau_hoi.includes("Ghi âm")){
            if (chon_tn + so_cau_hoi > max_ga){
                alert("Vượt quá số lượng câu hỏi ghi âm");
                return false;
            }
            chon_ga += so_cau_hoi;
            $("#max_ga").html("Ghi âm: "+chon_ga+ "/" + max_ga);
        }
        else if(dang_cau_hoi.includes("Ghi hình")){
            if (chon_tn + so_cau_hoi > max_gh){
                alert("Vượt quá số lượng câu hỏi ghi hình");
                return false;
            }
            chon_gh += so_cau_hoi;
            $("#max_gh").html("Ghi hình: "+chon_gh+ "/" + max_gh);
        }

        var content = `
        <p id="ch_${id}">(${id})</p>
        <input type="hidden" class="dch" value="${dang_cau_hoi}">
        <input type="hidden" name="don" value="${don}">`
        table_ques_selected.row.add([content]).draw();

//        $("#so_luong").html(table_ques_selected.data().count());
//        update_review();
    })

    $('#remove_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();
        var dang_cau_hoi = modal.find("input[name=dang_cau_hoi]").first().val();
        var so_cau_hoi = parseInt(modal.find("input[name=so_cau_hoi]").first().val());
        var row = $("#ch_"+id).parent().parent();
        table_ques_selected.row(row).remove().draw();
        if(dang_cau_hoi.includes("Trắc nhiệm")){
            chon_tn -= so_cau_hoi;
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else if(dang_cau_hoi.includes("Điền từ")){
            chon_dt -= so_cau_hoi;
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
        }
        else if(dang_cau_hoi.includes("Tự luận")){
            chon_tl -= so_cau_hoi;
            $("#max_tl").html("Điền từ: "+chon_tl+ "/" + max_tl);
        }
        else if(dang_cau_hoi.includes("Ghi âm")){
            chon_ga -= so_cau_hoi;
            $("#max_ga").html("Ghi âm: "+chon_ga+ "/" + max_ga);
        }
        else if(dang_cau_hoi.includes("Ghi hình")){
            chon_gh -= so_cau_hoi;
            $("#max_gh").html("Ghi hình: "+chon_gh+ "/" + max_gh);
        }
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

