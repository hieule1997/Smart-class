$(document).ready(function(){
    var table_teacher = $('#list_teacher').DataTable({
        "ajax": {
            "type": "GET",
            "url": "/adminsc/manage_teacher/data_all",
            "contentType": "application/json; charset=utf-8",
            "data": function(result){
                return JSON.stringify(result);
            },
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 10,
    });

    $("#new_teacher").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var title = button.data('title');
        if (title === 'edit'){
            $('#teacher_title').html("Chỉnh sửa giáo viên")
            var gvid = button.attr('id').split('_')[1];

            var fullname = $("#full_"+gvid).text();
            $("#new_teacher input[name=fullname]").val(fullname);

            $('body #list_mon').empty();
            $('body .list_mon'+gvid).each(function(){
                var mon = $(this).text();
                var element = '<div><input type="checkbox" style="transform: scale(1.3)" class="check_mon" name="'+mon+'" value="'+mon+'" checked > '+mon+'</div>';
                $('#list_mon').append(element);
            });

            $('body #list_lop').empty();
            $('body .list_lop'+gvid).each(function(){
                var lop = $(this).text();
                var element = '<div><input type="checkbox" style="transform: scale(1.3)" class="check_lop" name="'+lop+'" value="'+lop+'" checked > '+lop+'</div>';
                $('#list_lop').append(element);
            });

            var gioi_tinh = $("#gioi_"+ gvid).text();
            if(gioi_tinh === 'Nam'){
                $('#new_teacher input[name=nam]').prop('checked', true);
                $('#new_teacher input[name=nu]').prop('checked', false);
            }else{
                $('#new_teacher input[name=nam]').prop('checked', false);
                $('#new_teacher input[name=nu]').prop('checked', true);
            }

            var username = $("#user_"+gvid).text();
            $("#new_teacher input[name=username]").val(username);
            $("#new_teacher input[name=username]").prop("readonly", true);

            var email = $("#email_"+gvid).text();
            $("#new_teacher input[name=email]").val(email);

            $(".passwd").each(function() {
                $(this).hide();
            });

            $("#new_teacher  input[name=kieu]").val("edit");

            $("#create_new_teacher").html("Chỉnh sửa");

        }else{
            $('#teacher_title').html("Thêm mới giáo viên")
            $("#new_teacher input[name=gvid]").val(0);
            $("#new_teacher input[name=fullname]").val("");
            $("#new_teacher input[name=search_mon]").val("");
            $("#new_teacher input[name=search_lop]").val("");
            $("#new_teacher input[name=gioi_tinh]").val("");
            $('#new_teacher input[name=nam]').prop('checked', true);
            $('#new_teacher input[name=nu]').prop('checked', false);
            $("#new_teacher input[name=username]").val("");
            $("#new_teacher input[name=password]").val("");
            $("#new_teacher input[name=password2]").val("");
            $("#new_teacher input[name=email]").val("");

            $('#list_mon').empty();
            $('#list_lop').empty();

            $("#new_teacher input[name=username]").prop("readonly", false);

            $(".passwd").each(function() {
                $(this).show();
            });

            $("#new_teacher  input[name=kieu]").val("new");
            $("#create_new_teacher").html("Thêm mới");
        }
    });

    $('#create_new_teacher').click( function(){
        var kieu = $("#new_teacher  input[name=kieu]").val();
        var token = $("#new_teacher input[name=csrfmiddlewaretoken]").val();
        var fullname = $("#new_teacher input[name=fullname]").val();
        if ($('#new_teacher input[name=nam]').is(':checked')){
            var gioi_tinh = 1;
        }else{
            var gioi_tinh = 0;
        }
        var username = $("#new_teacher input[name=username]").val();
        var email = $("#new_teacher input[name=email]").val();
        var password = $("#new_teacher input[name=password]").val();
        var password2 = $("#new_teacher input[name=password2]").val();
        var list_mon = [];
        $('#new_teacher .check_mon').each(function() {
            list_mon.push(this.name);
        });
        var list_lop = [];
        $('#new_teacher .check_lop').each(function() {
            list_lop.push(this.name);
        });
        if(password === password2){
            $.ajax({
                type:'POST',
                url:location.href,
                data: {'csrfmiddlewaretoken':token, 'kieu':kieu, 'fullname': fullname, 'gioi_tinh': gioi_tinh,
                'list_mon': JSON.stringify(list_mon),'list_lop': JSON.stringify(list_lop),'username': username,
                'email': email, 'password': password},
                success: function(){
                    $("#new_teacher").modal("hide");
                    $('#list_teacher').DataTable().ajax.reload(null,false);
                }
            });
        }
    });

    $(".gioi_tinh").change(function() {
        if(this.checked && this.name === 'nam'){
            $('#new_teacher input[name=nu]').prop('checked', false);
        }
        else if(this.checked && this.name === 'nu'){
            $('#new_teacher input[name=nam]').prop('checked', false);
        }
    });

    var options_mon = {
        url: "mon_data",

        getValue: function(element){
            return element.ten+" - "+element.lop;
         },

        list: {
            match: {
                enabled: true
            },
            onChooseEvent: function() {
                var ten = $("#search_mon").getSelectedItemData().ten;
                var lop = $("#search_mon").getSelectedItemData().lop;
                var element = '<div><input type="checkbox" style="transform: scale(1.3)" class="check_mon" name="'+ten+" - "+lop+'" value="'+ten+" - "+lop+'" checked > '+ten+" - "+lop+'</div>';
                var list_old = $("#list_mon").text();
                if (list_old.includes(ten+" - "+lop) == false){
                    $('#list_mon').append(element);
                }
                $("#search_mon").val("");
            }
        },
        theme: "square"
    };
    $("#search_mon").easyAutocomplete(options_mon);

    $('body #list_mon').on('change', '.check_mon', function() {
        $(this).parent().remove();
    });

    var options_lop = {
        url: "lop_data",

        getValue: function(element){
            return element.ten;
         },

        list: {
            match: {
                enabled: true
            },
            onChooseEvent: function() {
                var ten = $("#search_lop").getSelectedItemData().ten;
                var element = '<div><input type="checkbox" style="transform: scale(1.3)" class="check_lop" name="'+ten+'" value="'+ten+'" checked > '+ten+'</div>';
                var list_old = $("#list_lop").text();
                if (list_old.includes(ten) == false){
                    $('#list_lop').append(element);
                }
                $("#search_lop").val("");
            }
        },
        theme: "square"
    };
    $("#search_lop").easyAutocomplete(options_lop);

    $('body #list_lop').on('change', '.check_lop', function() {
        $(this).parent().remove();
    });

    $("#list_teacher").on('click', '.btn-danger', function(){
        var id = $(this).attr('id').split('_')[1];
        var token = $("input[name=csrfmiddlewaretoken]").val();
        if (confirm('Bạn có chắc ?')){
            $.ajax({
                type:'POST',
                url:location.href,
                data: {'delete':id, 'csrfmiddlewaretoken':token},
                success: function(){
                    $('#list_teacher').DataTable().ajax.reload(null,false);
                }
           });
        }
    });

    $("#list_teacher").on('click', '.btn-warning', function(){
        var id = $(this).attr('id').split('_')[1];
        var token = $("input[name=csrfmiddlewaretoken]").val();
        if (confirm('Bạn có chắc ?')){
            $.ajax({
                type:'POST',
                url:location.href,
                data: {'block':id, 'csrfmiddlewaretoken':token},
                success: function(){
                    $('#list_teacher').DataTable().ajax.reload(null,false);
                }
           });
        }
    });

    var input_dom_element = document.getElementById("file");
    var result;

    function handle_fr(e) {
        result = [];
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        var rABS = !!reader.readAsBinaryString;
        reader.onload = function(e) {
            var data = e.target.result;
            if(!rABS) data = new Uint8Array(data);

            var wb = XLSX.read(data, {type: rABS ? 'binary' : 'array'});
            var ws = wb.Sheets[wb.SheetNames[0]];
            result = XLSX.utils.sheet_to_json(ws, {header:1});
//            wb.SheetNames.forEach(function(sheetName) {
//                var roa = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {header:1});
//                if(roa.length) result[sheetName] = roa;
//            });

        };
        if(rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
    }
    var handler = handle_fr;
    if(input_dom_element.attachEvent) input_dom_element.attachEvent('onchange', handler);
    else input_dom_element.addEventListener('change', handler, false);

    $('#create_new_teacher_multi').click(function(){
        var token = $("input[name=csrfmiddlewaretoken]").val();
        if (typeof result != 'undefined' ){
            $.ajax({
                type:'POST',
                url:location.href,
                data: {'csrfmiddlewaretoken':token, 'list_teacher':JSON.stringify(result)},
                success: function(){
                    $("#new_teacher_multi").modal("hide");
                    $('#list_teacher').DataTable().ajax.reload(null,false);
                }
           });
        }
    });

});