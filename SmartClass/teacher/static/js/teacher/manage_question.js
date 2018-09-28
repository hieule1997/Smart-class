$(document).ready(function(){
    create_editor("noi_dung dap_an");

    $("#dang_cau_hoi").on("change", function(event){
        var dang_cau_hoi = $("#dang_cau_hoi option:selected").text();
        $("#khung").html("");
        var ch ='<label>Nội dung:</label>';
        var da ='';
        if ( dang_cau_hoi.includes("Văn bản")){
            ch += `
            <div id="noi_dung" class="ques-container"></div>
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
                  <div id="noi_dung" class="ques-container"></div>
                </div>
            </div>
            <br>
            `;
            $("#khung").append(ch);
            $("input[type=file]").first().change(function() {
                readURL(this, "hinh_anh");
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
                  <div id="noi_dung" class="ques-container"></div>
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
                  <div id="noi_dung" class="ques-container"></div>
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
                  <div id="dap_an_A" class="answer-container nd_dap_an"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <div id="dap_an_B" class="answer-container nd_dap_an"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <div id="dap_an_C" class="answer-container nd_dap_an"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                  <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an">
                </div>
                <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                  <div id="dap_an_D" class="answer-container nd_dap_an"></div>
                </div>
            </div>
            `;
            $("#khung").append(da);
        }
        create_editor("noi_dung dap_an");

    });

    $("#luu_cau_hoi").on("click", function(event){
        var chu_de = $("#chu_de").val();
        if(chu_de == ''){
            alert("Chưa có chủ đề");
            return false;
        }
        var noi_dung = $("#noi_dung .ql-editor").html();
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
        $("#khung .nd_dap_an .ql-editor").each(function(){
            nd_dap_an.push($(this).html());
        });

        if (jQuery.inArray( "", nd_dap_an) != -1){
            alert("Chưa nhập nội dung đáp án");
            return false;
        }

        var formData = new FormData();
        formData.append('csrfmiddlewaretoken',$("input[name=csrfmiddlewaretoken]").val());
        formData.append('mon',$("#mon option:selected").text());
        formData.append('chu_de',chu_de);
        formData.append('dang_cau_hoi',$("#dang_cau_hoi option:selected").text());
        formData.append('do_kho',$("#do_kho option:selected").text());
        formData.append('noi_dung',noi_dung);
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
                $("#noi_dung .ql-editor").empty();
                $("#khung .dap_an").each(function(){
                    $(this).prop('checked', false);
                });
                $("#khung .nd_dap_an .ql-editor").each(function(){
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
        var noi_dung = $("#noi_dung_modal .ql-editor").html();
        if(noi_dung == ''){
            alert("Chưa nhập nội dung");
            return false;
        }

        var dap_an = [];
        $("#khung_modal .dap_an").each(function(){
            if ($(this).is(':checked')){
                dap_an.push(1);
            }else{
                dap_an.push(0);
            }
        });
        var nd_dap_an = [];
        $("#khung_modal .nd_dap_an .ql-editor").each(function(){
            nd_dap_an.push($(this).html());
        });
        var formData = new FormData();
        formData.append('csrfmiddlewaretoken',$("input[name=csrfmiddlewaretoken]").val());
        formData.append('edit',"");
        formData.append('id',$("#khung_modal input[name=id]").val());
        formData.append('noi_dung',noi_dung);
        formData.append('dap_an',JSON.stringify(dap_an));
        formData.append('nd_dap_an',JSON.stringify(nd_dap_an));
        if (typeof($("input[type=file]")[0]) == "undefined"){
        }else if (typeof($("input[type=file]")[0].files[0]) == "undefined"){
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
        var quill1 = new Quill('#dap_an_A', options);
        var quill2 = new Quill('#dap_an_B', options);
        var quill3 = new Quill('#dap_an_C', options);
        var quill4 = new Quill('#dap_an_D', options);
    }
}

function create_editor_modal(kind){
    if(kind.includes('noi_dung')){
       var quill_modal = new Quill('#noi_dung_modal', options);
    }

    if (kind.includes('dap_an')){
        var quill1_modal = new Quill('#dap_an_A_modal', options);
        var quill2_modal = new Quill('#dap_an_B_modal', options);
        var quill3_modal = new Quill('#dap_an_C_modal', options);
        var quill4_modal = new Quill('#dap_an_D_modal', options);
    }
}

thisRespondHightlightText(".select--highlight--active");


function thisRespondHightlightText(thisDiv){
    $(thisDiv).on("mouseup", function () {
        var selectedText = getSelectionText();
        console.log(selectedText);
        var selectedTextRegExp = new RegExp(selectedText,"g");
        var text = $(this).text().replace(selectedTextRegExp, " (...) ");
        $(this).html(text);
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


