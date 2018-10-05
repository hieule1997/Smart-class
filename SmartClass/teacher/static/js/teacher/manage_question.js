$(document).ready(function(){
    create_editor("noi_dung dap_an");

    $("#dang_cau_hoi").on("change", function(event){
        var dang_cau_hoi = $("#dang_cau_hoi option:selected").text();
        if ( dang_cau_hoi.includes("Trắc nhiệm")){
            $("#so_dap_an").prop("readonly", true);
            var sl = $("#so_dap_an").val();
            var da =`<br>`
            for (var i = 0; i < sl; i++){
                da +=`
                <div class="row">
                    <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                      <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                    </div>
                    <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                      <div id="dap_an_${i}" class="answer-container nd_dap_an"></div>
                    </div>
                </div>
                `
            }
            $("#khung_dap_an").html(da);
            create_editor("dap_an");
        }
        else if ( dang_cau_hoi.includes("Điền từ")){
            $("#so_dap_an").prop("readonly", false);
            var sl = $("#so_dap_an").val();
            var da = '<button class="btn btn-info" data-toggle="modal" data-target="#hd_dien_tu">Hướng dẫn</button><br>'
            for (var i = 0; i < sl; i++){
                da +=`
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12 form-group">
                      <div id="dap_an_${i}" class="answer-container nd_dap_an"></div>
                    </div>
                </div>
                `
            }
            $("#khung_dap_an").html(da);
            create_editor("dap_an");
        }
        else{
            $("#so_dap_an").prop("readonly", true);
            $("#khung_dap_an").html("");
        }
    });

    $("#dang_media").on("change", function(event){
        var dang_media = $("#dang_media option:selected").text();
        var ch ='<label>Nội dung:</label>';
        if ( dang_media.includes("Văn bản")){
            ch += `
            <div id="noi_dung" class="ques-container"></div>
            <br>
            `;
            $("#khung_cau_hoi").html(ch);
        }
        else if ( dang_media.includes("Hình ảnh")){
            ch += `
            <div class="row">
                <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                    <img id="hinh_anh" style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src="/static/image/placeholder.png" alt="chọn hình ảnh" />
                    <input type='file' style="display: block; margin-left: auto;margin-right: auto;" accept="image/*" />
                </div>
                <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                  <div id="noi_dung" class="ques-container"></div>
                </div>
            </div>
            <br>
            `;
            $("#khung_cau_hoi").html(ch);
            $("input[type=file]").first().change(function() {
                readURL(this, "hinh_anh");
            });
        }
        else if ( dang_media.includes("Âm thanh")){
            ch += `
            <div class="row">
                <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                  <audio id="media" controls width="100%"></audio>
                  <input type="file" style="display: block; margin-left: auto;margin-right: auto;"  accept="audio/*">
                </div>
                <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                  <div id="noi_dung" class="ques-container"></div>
                </div>
            </div>
            <br>
            `;
            $("#khung_cau_hoi").html(ch);
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
        else{
            ch += `
            <div class="row">
                <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                  <video id="media" controls width="100%"></video>
                  <input type="file" style="display: block; margin-left: auto;margin-right: auto;" accept="video/*">
                </div>
                <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                  <div id="noi_dung" class="ques-container"></div>
                </div>
            </div>
            <br>
            `;
            $("#khung_cau_hoi").html(ch);
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
        create_editor("noi_dung");
    });

    $("#so_dap_an").on("change", function(event){
        var sl = $("#so_dap_an").val();
        var da = '<button class="btn btn-info" data-toggle="modal" data-target="#hd_dien_tu">Hướng dẫn</button><br>'
        for (var i = 0; i < sl; i++){
            da +=`
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12 form-group">
                  <div id="dap_an_${i}" class="answer-container nd_dap_an"></div>
                </div>
            </div>
            `
        }
        $("#khung_dap_an").html(da);
        create_editor("dap_an");
    });

    $("#luu_cau_hoi").on("click", function(event){
        var formData = new FormData();
        formData.append('csrfmiddlewaretoken',$("input[name=csrfmiddlewaretoken]").val());
        formData.append('mon',$("#mon option:selected").text());
        var chu_de = $("#chu_de").val();
        if(chu_de == ''){
            alert("Chưa có chủ đề");
            return false;
        }
        formData.append('chu_de',chu_de);
        var noi_dung = $("#noi_dung .ql-editor").html();
        if(noi_dung == '<p><br></p>'){
            alert("Chưa nhập nội dung");
            return false;
        }
        formData.append('noi_dung',noi_dung);
        var dang_cau_hoi = $("#dang_cau_hoi option:selected").text();
        var dang_media = $('#dang_media option:selected').text();
        if (dang_cau_hoi.includes("Trắc nhiệm")){
            var dap_an = [];
            $(".dap_an").each(function(){
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
            formData.append('dap_an',JSON.stringify(dap_an));

            var nd_dap_an = [];
            $(".nd_dap_an .ql-editor").each(function(){
                nd_dap_an.push($(this).html());
            });
            if (jQuery.inArray("<p><br></p>", nd_dap_an) != -1){
                alert("Chưa nhập nội dung đáp án");
                return false;
            }
            formData.append('nd_dap_an',JSON.stringify(nd_dap_an));
            formData.append('dang_cau_hoi',dang_media + " + " + dang_cau_hoi);

        }
        else if(dang_cau_hoi.includes("Điền từ")){
            var nd_dap_an = [];
            $(".nd_dap_an .ql-editor").each(function(){
                nd_dap_an.push($(this).html());
            });
            if (jQuery.inArray("<p><br></p>", nd_dap_an) != -1){
                alert("Chưa nhập nội dung đáp án");
                return false;
            }
            formData.append('nd_dap_an',JSON.stringify(nd_dap_an));
            formData.append('dang_cau_hoi',dang_media + " + " + dang_cau_hoi + " + " + $("#so_dap_an").val()+ " từ");
        }else{
            formData.append('dang_cau_hoi',dang_media + " + " + dang_cau_hoi);
        }

        formData.append('do_kho',$("#do_kho option:selected").text());

        if(!dang_media.includes("Văn bản")){
            if (typeof($("input[type=file]")[0].files[0]) == "undefined"){
                alert("Chưa chọn file");
                return false;
            }else{
                formData.append('dinh_kem',$("input[type=file]")[0].files[0]);
            }
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
                $("#noi_dung .ql-editor").empty();
                $(".dap_an").each(function(){
                    $(this).prop('checked', false);
                });
                $(".nd_dap_an .ql-editor").each(function(){
                    $(this).empty();
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
        $.ajax({
            type: "GET",
            url: "question_data_detail_"+id+"_edit" ,
            success: function(data){
                $("#khung_modal").html(data);
                create_editor_modal("noi_dung dap_an");
                var dang_cau_hoi = $("#khung_modal input[name=dang_cau_hoi]").val();
                if(dang_cau_hoi.includes("Hình ảnh")){
                    $("#khung_modal input[type=file]").first().change(function() {
                        readURL(this, 'hinh_anh_modal');
                    });
                }else if (dang_cau_hoi.includes("Âm thanh")){
                    var URL = window.URL || window.webkitURL;
                    var playSelectedFile = function (event) {
                        var file = this.files[0];
                        var type = file.type;
                        var videoNode = document.querySelector('#khung_modal audio');
                        var canPlay = videoNode.canPlayType(type);
                        if (canPlay === '') {
                            alert("can't play");
                        };
                        var fileURL = URL.createObjectURL(file);
                        videoNode.src = fileURL;
                    }
                    var inputNode = document.querySelector('#khung_modal input[type=file]');
                    inputNode.addEventListener('change', playSelectedFile, false);
                }else if (dang_cau_hoi.includes("Video")){
                    var URL = window.URL || window.webkitURL;
                    var playSelectedFile = function (event) {
                        var file = this.files[0];
                        var type = file.type;
                        var videoNode = document.querySelector('#khung_modal video');
                        var canPlay = videoNode.canPlayType(type);
                        if (canPlay === '') {
                            alert("can't play");
                        };
                        var fileURL = URL.createObjectURL(file);
                        videoNode.src = fileURL;
                    }
                    var inputNode = document.querySelector('#khung_modal input[type=file]');
                    inputNode.addEventListener('change', playSelectedFile, false);
                }
                $("#question").modal("show");
            },
        });


    });

    $("#edit_question").on('click', function(event){
        var formData = new FormData();
        formData.append('csrfmiddlewaretoken',$("input[name=csrfmiddlewaretoken]").val());
        formData.append('edit',"");
        formData.append('id',$("#khung_modal input[name=id]").val());
        var noi_dung = $("#noi_dung_modal .ql-editor").html();
        formData.append('noi_dung',noi_dung);
        if(noi_dung == ''){
            alert("Chưa nhập nội dung");
            return false;
        }
        var dang_cau_hoi = $("#khung_modal input[name=dang_cau_hoi]").val();
        if (dang_cau_hoi.includes("Trắc nhiệm")){
            var dap_an = [];
            $("#khung_modal .dap_an").each(function(){
                if ($(this).is(':checked')){
                    dap_an.push(1);
                }else{
                    dap_an.push(0);
                }
            });
            formData.append('dap_an',JSON.stringify(dap_an));
            var nd_dap_an = [];
            $("#khung_modal .nd_dap_an .ql-editor").each(function(){
                nd_dap_an.push($(this).html());
            });
            formData.append('nd_dap_an',JSON.stringify(nd_dap_an));
        }

        else if (dang_cau_hoi.includes("Điền từ")){
            var nd_dap_an = [];
            $("#khung_modal .nd_dap_an .ql-editor").each(function(){
                nd_dap_an.push($(this).html());
            });
            formData.append('nd_dap_an',JSON.stringify(nd_dap_an));
        }

        if(!dang_cau_hoi.includes("Văn bản")&&(typeof($("input[type=file]")[0].files[0]) != "undefined")){
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
                $("#processing").modal('hide');
                $("#question").modal('hide');
                table_question.ajax.reload(null, false);
            },
        });
    });
});

function readURL(input,image) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $('#'+image).attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

var options = {
  modules: {
    'syntax': true,
    'toolbar': [
      [ { 'size': [] }],
      [ 'bold', 'italic', 'underline', 'strike' ],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'super' }, { 'script': 'sub' }],
      [{ 'header': '1' }, { 'header': '2' } ],
      [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
      [ { 'align': [] }],
      [ 'formula' ],
    ],
  },
    placeholder: 'Nhập nội dung',
    theme: 'snow'
};

function create_editor(kind){
    if(kind.includes('noi_dung')){
       var quill = new Quill('#noi_dung', options);
    }

    if (kind.includes('dap_an')){
        $(".nd_dap_an").each(function(index){
            var quill = new Quill('#dap_an_'+index, options);
        });
    }
}

function create_editor_modal(kind){
    if(kind.includes('noi_dung')){
       var quill_modal = new Quill('#noi_dung_modal', options);
    }

    if (kind.includes('dap_an')){
        $("#khung_modal .nd_dap_an").each(function(index){
            var quill1_modal = new Quill('#dap_an_'+index+'_modal', options);
        });
    }
}


function select(){
    $("#noi_dung .ql-editor p").each(function(){
        var selectedText = getSelectionText();
        if (!selectedText.replace(/\s/g, '').length) {
            return false;
        }
        if(($("#noi_dung .ql-editor").text().match(/[(][.]{6}[)]/g) || []).length >= $("#so_dap_an").val()){
            alert("Đã đủ số từ");
            return false;
        }
        var selectedTextRegExp = new RegExp(selectedText,"g");
        var text = $(this).text().replace(selectedTextRegExp, " (......) ");
        $(this).html(text);
        fill(selectedText);

    })
}

function fill(text){
    $("#khung_dap_an .ql-editor").each(function(){
        if($(this).html()=="<p><br></p>"){
            $(this).html(text);
            return false;
        }
    });
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}


