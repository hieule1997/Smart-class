$(document).ready(function(){
    $("#dang_cau_hoi").on("change", function(event){
        var dang_cau_hoi = $("#dang_cau_hoi option:selected").text();
        $("#khung").html("");
        var ch ='<label>Nội dung:</label>';
        var da ='';
        if ( dang_cau_hoi.includes("Văn bản")){
            ch += `
            <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10"></textarea>
            <br>
            `;
            $("#khung").append(ch);
        }

        if ( dang_cau_hoi.includes("Hình ảnh")){
            ch += `
            <div class="row">
                <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                    <img id="hinh_anh" style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src="/static/image/placeholder.png" alt="chọn hình ảnh" />
                    <input type='file' style="display: block; margin-left: auto;margin-right: auto;" accept="image/*" />
                </div>
                <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10"></textarea>
                </div>
            </div>
            <br>
            `;
            $("#khung").append(ch);
            $("input[type=file]").first().change(function() {
                readURL(this);
            });
        }

        if ( dang_cau_hoi.includes("Âm thanh")){
            ch += `
            <div class="row">
                <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                  <audio id="media" controls width="100%"></audio>
                  <input type="file" style="display: block; margin-left: auto;margin-right: auto;"  accept="audio/*">
                </div>
                <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="6"></textarea>
                </div>
            </div>
            <br>
            `;
            $("#khung").append(ch);
            var URL = window.URL || window.webkitURL;
            var playSelectedFile = function (event) {
                var file = this.files[0];
                var type = file.type;
                var videoNode = document.querySelector('audio');
                var canPlay = videoNode.canPlayType(type);
                if (canPlay === '') {
                    alert("can't play");
                };
                var fileURL = URL.createObjectURL(file);
                videoNode.src = fileURL;
            }
            var inputNode = document.querySelector('input[type=file]');
            inputNode.addEventListener('change', playSelectedFile, false);
        }

        if ( dang_cau_hoi.includes("Video")){
            ch += `
            <div class="row">
                <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                  <video id="media" controls width="100%"></video>
                  <input type="file" style="display: block; margin-left: auto;margin-right: auto;" accept="video/*">
                </div>
                <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="16"></textarea>
                </div>
            </div>
            <br>
            `;
            $("#khung").append(ch);
            var URL = window.URL || window.webkitURL;
            var playSelectedFile = function (event) {
                var file = this.files[0];
                var type = file.type;
                var videoNode = document.querySelector('video');
                var canPlay = videoNode.canPlayType(type);
                if (canPlay === '') {
                    alert("can't play");
                };
                var fileURL = URL.createObjectURL(file);
                videoNode.src = fileURL;
            }
            var inputNode = document.querySelector('input[type=file]');
            inputNode.addEventListener('change', playSelectedFile, false);
        }

        if (dang_cau_hoi.includes("Trắc nhiệm")){
            da +=`
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
            $("#khung").append(da);
        }

    });

    $("#luu_cau_hoi").on("click", function(event){
        var token = $("input[name=csrfmiddlewaretoken]").val();
        var mon = $("#mon option:selected").text();
        var chu_de = $("#chu_de").val();
        if(chu_de == ''){
            alert("Chưa có chủ đề");
            return false;
        }
        var dang_cau_hoi = $("#dang_cau_hoi option:selected").text();
        var do_kho = $("#do_kho option:selected").text();
        var noi_dung = $("#khung textarea[name=noi_dung]").val();
        if(noi_dung == ''){
            alert("Chưa nhập nội dung");
            return false;
        }
        var dap_an = [];
        $("#khung .dap_an").each(function(){
            if ($(this).is(':checked')){
                dap_an.push(1);
            }else{
                dap_an.push(0);
            }
        });
        if (jQuery.inArray( 1, dap_an) == -1){
            alert("Chưa chọn đáp án đúng");
            return false;
        }
        var nd_dap_an = [];
        $("#khung .nd_dap_an").each(function(){
            nd_dap_an.push($(this).val());
        });
        if (jQuery.inArray( "", nd_dap_an) != -1){
            alert("Chưa nhập nội dung đáp án");
            return false;
        }

        var formData = new FormData();
        formData.append('csrfmiddlewaretoken',$("input[name=csrfmiddlewaretoken]").val());
        formData.append('mon',$("#mon option:selected").text());
        formData.append('chu_de',$("#chu_de").val());
        formData.append('dang_cau_hoi',$("#dang_cau_hoi option:selected").text());
        formData.append('do_kho',$("#do_kho option:selected").text());
        formData.append('noi_dung',$("#khung textarea[name=noi_dung]").val());
        formData.append('dap_an',JSON.stringify(dap_an));
        formData.append('nd_dap_an',JSON.stringify(nd_dap_an));
        if (typeof($("input[type=file]")[0]) == "undefined"){

        }else if (typeof($("input[type=file]")[0].files[0]) == "undefined"){
            alert("Chưa chọn file");
            return false;
        }else{
            formData.append('dinh_kem',$("input[type=file]")[0].files[0]);
        }
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
            type : "POST",
            url : location.href,
            data : formData,
            contentType: false,
            processData: false,
            success : function(){
                $("#khung textarea[name=noi_dung]").val("");
                $("#khung .dap_an").each(function(){
                    $(this).prop('checked', false);
                });
                $("#khung .nd_dap_an").each(function(){
                    $(this).val("");
                });
                table_question.ajax.reload(null, false);
                $("#hinh_anh").attr("src","/static/image/placeholder.png");
                $("#media").attr("src","");
                $("input[type=file]").val('');
                $("#processing").modal('hide');
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
        if(table_question.data().count() == 0){
            return false;
        }
        var id = $(this).find('p').first().attr('id').split("_")[2];
        var dang_cau_hoi = $("#dang_cau_hoi_"+id).text();
        var noi_dung = $("#noi_dung_"+id).text();
        var dap_an = []
        var dung = []
        var dinh_kem = "/media/" + $("#dinh_kem_"+id).text();
        var ch =`
        <input type="hidden" name="id" value=${id}>
        <label>Nội dung:</label>
        `;
        var da ='';
        $(".dap_an_"+id).each(function(){
            dap_an.push($(this).text());
            if ($(this).data("dung")=== "True"){
                dung.push("checked");
            }
            else{
                dung.push("");
            }
        });
        $("#khung_modal").html("");

        if ( dang_cau_hoi.includes("Văn bản")){
            ch += `
            <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10">${noi_dung}</textarea>
            <br>
            `;
            $("#khung_modal").append(ch);
        }

        if ( dang_cau_hoi.includes("Hình ảnh")){
            ch += `
            <div class="row">
                <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                    <img id="hinh_anh" style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src=${dinh_kem} alt="chọn hình ảnh" />
                    <input type='file' style="display: block; margin-left: auto;margin-right: auto;" accept="image/*" />
                </div>
                <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="10">${noi_dung}</textarea>
                </div>
            </div>
            <br>
            `;
            $("#khung_modal").append(ch);
            $("input[type=file]").first().change(function() {
                readURL(this);
            });
        }

        if ( dang_cau_hoi.includes("Âm thanh")){
            ch += `
            <div class="row">
                <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                  <audio id="media" controls width="100%" src=${dinh_kem}></audio>
                  <input type="file" style="display: block; margin-left: auto;margin-right: auto;"  accept="audio/*">
                </div>
                <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="6">${noi_dung}</textarea>
                </div>
            </div>
            <br>
            `;
            $("#khung_modal").append(ch);
            var URL = window.URL || window.webkitURL;
            var playSelectedFile = function (event) {
                var file = this.files[0];
                var type = file.type;
                var videoNode = document.querySelector('audio');
                var canPlay = videoNode.canPlayType(type);
                if (canPlay === '') {
                    alert("can't play");
                };
                var fileURL = URL.createObjectURL(file);
                videoNode.src = fileURL;
            }
            var inputNode = document.querySelector('input[type=file]');
            inputNode.addEventListener('change', playSelectedFile, false);
        }

        if ( dang_cau_hoi.includes("Video")){
            ch += `
            <div class="row">
                <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                  <video id="media" controls width="100%" src=${dinh_kem}></video>
                  <input type="file" style="display: block; margin-left: auto;margin-right: auto;" accept="video/*">
                </div>
                <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control" name="noi_dung" placeholder="Nhập nội dung" rows="16">${noi_dung}</textarea>
                </div>
            </div>
            <br>
            `;
            $("#khung_modal").append(ch);
            var URL = window.URL || window.webkitURL;
            var playSelectedFile = function (event) {
                var file = this.files[0];
                var type = file.type;
                var videoNode = document.querySelector('video');
                var canPlay = videoNode.canPlayType(type);
                if (canPlay === '') {
                    alert("can't play");
                };
                var fileURL = URL.createObjectURL(file);
                videoNode.src = fileURL;
            }
            var inputNode = document.querySelector('input[type=file]');
            inputNode.addEventListener('change', playSelectedFile, false);
        }

        if (dang_cau_hoi.includes("Trắc nhiệm")){
            da +=`
            <br>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an" ${dung[0]}>
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="A:">${dap_an[0]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an" ${dung[1]}>
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="B:">${dap_an[1]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an" ${dung[2]}>
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="C:">${dap_an[2]}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an" ${dung[3]}>
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <textarea class="form-control nd_dap_an" name="nd_dap_an" placeholder="D:">${dap_an[3]}</textarea>
                </div>
            </div>
            `;
            $("#khung_modal").append(da);
        }

        $("#question").modal("show");
    });

    $("#edit_question").on('click', function(event){
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
        var formData = new FormData();
        formData.append('csrfmiddlewaretoken',$("input[name=csrfmiddlewaretoken]").val());
        formData.append('edit',"");
        formData.append('id',$("#khung_modal input[name=id]").val());
        formData.append('noi_dung',$("#khung_modal textarea[name=noi_dung]").val());
        formData.append('dap_an',JSON.stringify(dap_an));
        formData.append('nd_dap_an',JSON.stringify(nd_dap_an));
        formData.append('dinh_kem',$("#khung_modal input[type=file]")[0].files[0]);
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
            type : "POST",
            url : location.href,
            data : formData,
            contentType: false,
            processData: false,
            success : function(){
                $("#processing").modal('hide');
                $("#question").modal('hide');
                table_question.ajax.reload(null, false);
            },
        });
    });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $('#hinh_anh').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}






