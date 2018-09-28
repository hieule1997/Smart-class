from .tokens import account_activation_token
from django.shortcuts import render, redirect, get_object_or_404
from django.template import RequestContext
from django.contrib.auth import login, logout
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.contrib.auth.hashers import check_password
from django.contrib import messages
from django.contrib.auth import logout
from django.utils import timezone
import uuid
import random
from django.utils.safestring import mark_safe
import json
from django.contrib.auth.models import User
import threading
from teacher.forms import UserForm, authenticate, UserResetForm, get_email, ResetForm
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from django.core.mail import EmailMessage
from teacher.models import *
import os
from django.conf import settings
import re


class EmailThread(threading.Thread):
    def __init__(self, email):
        threading.Thread.__init__(self)
        self._stop_event = threading.Event()
        self.email = email

    def run(self):
        self.email.send()


def home(request):
    user = request.user
    if user.is_authenticated and user.position == 1:
        content = {'username': mark_safe(json.dumps(user.username)),
                   'list_lop': ChiTietLop.objects.filter(myuser_id=user)}
        return render(request, 'teacher/base.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_class(request, lop):
    user = request.user
    if user.is_authenticated and user.position == 1:
        ls_chi_tiet = ChiTietLop.objects.filter(lop_id=Lop.objects.get(ten=lop)).values('myuser_id')
        ls_student = MyUser.objects.filter(id__in=ls_chi_tiet, position=0)
        content = {'username': mark_safe(json.dumps(user.username)),
                   'list_lop': ChiTietLop.objects.filter(myuser_id=user),
                   'lop_ht': lop,
                   'ls_student': ls_student}
        return render(request, 'teacher/manage_class.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_point(request, lop):
    user = request.user
    if user.is_authenticated and user.position == 1:
        try:
            lop_Ob = Lop.objects.get(ten=lop)
            ChiTietLop.objects.get(myuser_id=user, lop_id=lop_Ob)
        except ObjectDoesNotExist:
            return HttpResponseRedirect('/')

        content = {'username': mark_safe(json.dumps(user.username)),
                   'list_lop': ChiTietLop.objects.filter(myuser_id=user),
                   'lop_ht': lop}

        return render(request, 'teacher/manage_point.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_point_data(request, lop):
    user = request.user

    if user.is_authenticated and user.position == 1:
        data = []
        try:
            lop_Ob = Lop.objects.get(ten=lop)
            ChiTietLop.objects.get(myuser_id=user, lop_id=lop_Ob)
        except ObjectDoesNotExist:
            pass
        else:
            ls_chi_tiet = ChiTietLop.objects.filter(lop_id=lop_Ob).values('myuser_id')
            ls_student = MyUser.objects.filter(id__in=ls_chi_tiet, position=0)
            mon_id = GiaoVienMon.objects.filter(myuser_id=user).values('mon_id')
            try:
                lp = int(lop[:2])
            except:
                lp = int(lop[0])
            mon = Mon.objects.get(id__in=mon_id, lop=lp)
            for student in ls_student:
                fullname = '<h5 id="full_{}">{}</h5>'.format(student.id, student.fullname)
                kiem_tra_15p = '<h4>'
                kiem_tra_1_tiet = '<h4>'
                diem_thi = '<h4>'
                for diem in DiemSo.objects.filter(myuser_id=student, mon_id=mon):
                    if diem.diem < 5.0:
                        loai = "danger"
                    elif diem.diem >= 5.0 and diem.diem < 6.5:
                        loai = "warning"
                    elif diem.diem >= 6.5 and diem.diem < 8.0:
                        loai = "info"
                    else:
                        loai = "success"
                    temp = '''
                    <span class="label label-{2}" data-id="{0}" data-toggle="modal" data-target="#point" >{1}</span>
                    '''.format(diem.id, diem.diem, loai)
                    if diem.loai_diem == "kiểm tra 15'":
                        kiem_tra_15p += temp
                    elif diem.loai_diem == 'kiểm tra 1 tiết':
                        kiem_tra_1_tiet += temp
                    elif diem.loai_diem == 'thi':
                        diem_thi += temp
                kiem_tra_15p += '</h4>'
                kiem_tra_1_tiet += '</h4>'
                diem_thi += '</h4>'
                data.append([fullname, kiem_tra_15p, kiem_tra_1_tiet, diem_thi])
        big_data = {"data": data}
        json_data = json.loads(json.dumps(big_data))
        return JsonResponse(json_data)


def manage_point_detail(request, id):
    user = request.user
    if user.is_authenticated and user.position == 1:
        diem = DiemSo.objects.get(id=id)
        content = '''
        <div class="col-md-6 col-sm-6 col-xs-12 form-group has-feedback">
          <input type="text" class="form-control has-feedback-left" value="{0}" disabled>
          <span class="fa fa-user form-control-feedback left" aria-hidden="true"></span>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12 form-group has-feedback">
          <input type="number" class="form-control has-feedback-left" value="{1}" min=0 max=100 disabled>
          <span class="fa fa-edit form-control-feedback left" aria-hidden="true"></span>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12 form-group has-feedback">
          <input type="date" class="form-control has-feedback-left" value="{2}" disabled>
          <span class="fa fa-calendar form-control-feedback left" aria-hidden="true"></span>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12 form-group has-feedback">
          <input type="text" class="form-control has-feedback-left" value="{3}" disabled>
          <span class="fa fa-book form-control-feedback left" aria-hidden="true"></span>
        </div>
        <div class="col-md-12 col-sm-12 col-xs-12">
            {4}
        </div>
        <div class="clearfix"></div>
        '''.format(diem.myuser_id.fullname, diem.diem, str(diem.ngay_lam), diem.loai_diem, diem.bai_lam)
        return HttpResponse(content)    
    

def manage_de(request):
    user = request.user
    if user.is_authenticated and user.position == 1:
        if request.method == "POST":
            de = De.objects.create(ten=request.POST['ten_de'], loai_de=request.POST['loai_de'],
                                   mon_id=Mon.objects.get(id=request.POST['mon']), myuser_id=user)
            for q in json.loads(request.POST['list_ques']):
                ChiTietDe.objects.create(cau_hoi_id=CauHoi.objects.get(id=q), de_id=de)
                
        content = {'username': mark_safe(json.dumps(user.username)),
                   'list_lop': ChiTietLop.objects.filter(myuser_id=user),
                   'list_mon': GiaoVienMon.objects.filter(myuser_id=user),}
        return render(request, 'teacher/manage_exam.html', content)
    else:
        return HttpResponseRedirect('/')


def de_data(request, all):
    user = request.user
    if user.is_authenticated and user.position == 1:
        data = []
        if all == 0:
            list_exam = De.objects.filter(myuser_id=user)
        else:
            user_mon = GiaoVienMon.objects.filter(myuser_id=user).values('mon_id')
            list_exam = CauHoi.objects.filter(mon_id__in=user_mon)
        for exam in list_exam:
            mon = '<p data-id="{}">{} - {}</p>'.format(exam.id, exam.mon_id.ten, exam.mon_id.lop)
            if all == 0:
                data.append([mon, exam.ten, exam.loai_de, str(exam.ngay_tao)])
            else:
                data.append([mon, exam.ten, exam.loai_de, exam.myuser_id.fullname, str(exam.ngay_tao)])
        json_data = json.loads(json.dumps({"data": data}))
        return JsonResponse(json_data)


def chi_tiet_de_data(request, id):
    user = request.user
    if user.is_authenticated and user.position == 1:
        list_ques = ChiTietDe.objects.filter(de_id=id)
        content = ''
        for i, ques in enumerate(list_ques):
            media = ''
            if "Hình ảnh" in ques.cau_hoi_id.dang_cau_hoi:
                media = '<img style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src="/media/{}" alt="không tồn tại" />'.format(ques.cau_hoi_id.dinh_kem)
            elif "Âm thanh" in ques.cau_hoi_id.dang_cau_hoi:
                media = '<br><audio controls width="100%" src="/media/{}"></audio>'.format(ques.cau_hoi_id.dinh_kem)
            elif "Video" in ques.cau_hoi_id.dang_cau_hoi:
                media = '<video controls width="100%" src="/media/{}"></video>'.format(ques.cau_hoi_id.dinh_kem)
            dap_an = '\n'
            list_dap_an = DapAn.objects.filter(cau_hoi_id=ques.cau_hoi_id)
            for k, da in enumerate(list_dap_an):
                s = chr(ord(str(k)) + 17)
                if da.dap_an_dung:
                    dung = '(Đúng)'
                else:
                    dung = ''
                result = re.search('<p>(.*)</p>', da.noi_dung)
                dap_an += '''
                <p>{0}: {2} {1}</p>
                '''.format(s, dung, result.group(1))
            content += '''
            <label>Câu hỏi {0}:</label>
            {3}
            <ul class="list-unstyled msg_list">
            <li><a>{1}{2}</a></li>
            '''.format(i+1, list_ques[i].cau_hoi_id.noi_dung, dap_an, media)
        return HttpResponse(content)


def manage_question(request):
    user = request.user
    if user.is_authenticated and user.position == 1:
        content = {'username': mark_safe(json.dumps(user.username)),
                   'list_lop': ChiTietLop.objects.filter(myuser_id=user),
                   'list_mon': GiaoVienMon.objects.filter(myuser_id=user)}
        if request.method == 'POST':
            if 'edit' in request.POST:
                ch = CauHoi.objects.get(id=request.POST['id'])
                ch.noi_dung = request.POST['noi_dung']
                if request.FILES.get('dinh_kem') is not None:
                    try:
                        os.remove(os.path.join(settings.MEDIA_ROOT, str(ch.dinh_kem)))
                    except:
                        pass
                    ch.dinh_kem = request.FILES['dinh_kem']
                    ch.save()
                    handle_uploaded_file(request.FILES['dinh_kem'])
                ch.save()
                DapAn.objects.filter(cau_hoi_id=ch).delete()
            else:
                ten_mon, lop_mon = request.POST['mon'].split(" - ")
                mon = Mon.objects.get(ten=ten_mon, lop=lop_mon)
                if request.POST['do_kho'] == 'Dễ':
                    do_kho = 0
                elif request.POST['do_kho'] == 'Trung bình':
                    do_kho = 1
                else:
                    do_kho = 2
                ch = CauHoi.objects.create(myuser_id=user, mon_id=mon, noi_dung=request.POST['noi_dung'], do_kho=do_kho,
                                           chu_de=request.POST['chu_de'], dang_cau_hoi=request.POST['dang_cau_hoi'])
                if request.FILES.get('dinh_kem') is not None:
                    ch.dinh_kem = request.FILES['dinh_kem']
                    ch.save()
                    handle_uploaded_file(request.FILES['dinh_kem'])
            dap_an = json.loads(request.POST['dap_an'])
            nd_dap_an = json.loads(request.POST['nd_dap_an'])
            for i in range(len(dap_an)):
                if dap_an[i] == 0:
                    dung = False
                else:
                    dung = True
                DapAn.objects.create(cau_hoi_id=ch, mon_id=ch.mon_id, noi_dung=nd_dap_an[i], dap_an_dung=dung)
        return render(request, 'teacher/manage_question.html', content)
    else:
        return HttpResponseRedirect('/')


def question_data(request, id_mon, all):
    user = request.user
    if user.is_authenticated and user.position == 1:
        data = []
        if all == 0:
            list_ques = CauHoi.objects.filter(myuser_id=user, mon_id=Mon.objects.get(id=id_mon))
        else:
            list_ques = CauHoi.objects.filter(mon_id=Mon.objects.get(id=id_mon))
        for ques in list_ques:
            chu_de = '<p id="chu_de_{}">{}</p>'.format(ques.id, ques.chu_de)
            dang_cau_hoi = '<p id="dang_cau_hoi_{}">{}</p>'.format(ques.id, ques.dang_cau_hoi)
            do_kho = '<p id="do_kho_{}">'.format(ques.id)
            if ques.do_kho == 0:
                do_kho += 'Dễ</p>'
            elif ques.do_kho == 1:
                do_kho += 'Trung bình</p>'
            else:
                do_kho += 'Khó</p>'
            ngay_tao = '<p id="ngay_tao_{}">{}</p>'.format(ques.id, str(ques.ngay_tao))
            # result = re.search('<p>(.*)</p>', ques.noi_dung)
            # try:
            #     print(result.group(0))
            # except:
            #     pass
            noi_dung = '''
            <div id="tom_tat_{0}" class="row">{1}</div>
            '''.format(ques.id, ques.noi_dung[:40])
            if all == 0:
                data.append([chu_de, dang_cau_hoi, do_kho, ngay_tao, noi_dung])
            else:
                ten = '<p>{}</p>'.format(ques.myuser_id.fullname)
                data.append([ques.id, chu_de, dang_cau_hoi, do_kho, ten, ngay_tao, noi_dung])
        json_data = json.loads(json.dumps({"data": data}))
        return JsonResponse(json_data)


def question_data_detail(request, id, kieu):
    user = request.user
    if user.is_authenticated and user.position == 1:
        ques = CauHoi.objects.get(id=id)

        media = ''
        if kieu == 'edit':
            dat = ''
            if "Văn bản" in ques.dang_cau_hoi:
                media = '''
                <div id="noi_dung_modal" class="ques-container">{0}</div>
                <br>
                '''.format(ques.noi_dung)
            elif "Hình ảnh" in ques.dang_cau_hoi:
                media = '''
                <div class="row">
                    <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                        <img id="hinh_anh_modal" style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src="/media/{0}" alt="chọn hình ảnh" />
                        <input type='file' style="display: block; margin-left: auto;margin-right: auto;" accept="image/*" />
                    </div>
                    <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                      <div id="noi_dung_modal" class="ques-container">{1}</div>
                    </div>
                </div>
                <br>
                '''.format(ques.dinh_kem, ques.noi_dung)
            elif "Âm thanh" in ques.dang_cau_hoi:
                media = '''
                <div class="row">
                    <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                      <audio id="media" controls width="100%" src="/media/{0}"></audio>
                      <input type="file" style="display: block; margin-left: auto;margin-right: auto;"  accept="audio/*">
                    </div>
                    <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                      <div id="noi_dung_modal" class="ques-container">{1}</div>
                    </div>
                </div>
                <br>
                '''.format(ques.dinh_kem, ques.noi_dung)
            elif "Video" in ques.dang_cau_hoi:
                media = '''
                <div class="row">
                    <div class="col-md-8 col-sm-12 col-xs-12 form-group">
                      <video id="media" controls width="100%" src="/media/{0}"></video>
                      <input type="file" style="display: block; margin-left: auto;margin-right: auto;" accept="video/*">
                    </div>
                    <div class="col-md-4 col-sm-12 col-xs-12 form-group">
                      <div id="noi_dung_modal" class="ques-container">{1}</div>
                    </div>
                </div>
                <br>
                '''.format(ques.dinh_kem, ques.noi_dung)
            for i, da in enumerate(DapAn.objects.filter(cau_hoi_id=ques)):
                s = chr(ord(str(i)) + 17)
                if da.dap_an_dung:
                    dung = 'checked'
                else:
                    dung = ''
                dat += '''
                <div class="row">
                    <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                      <input type="radio" class="form-control dap_an" style="transform:scale(0.6);" name="dap_an" {0}>
                    </div>
                    <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                      <div id="dap_an_{1}_modal" class="answer-container nd_dap_an">{2}</div>
                    </div>
                </div>
                '''.format(dung, s, da.noi_dung)
            content = '''
            <input hidden name="id" value="{2}">
            <input hidden name="dang_cau_hoi" value="{3}">
            {1}{0}'''.format(dat, media, ques.id, ques.dang_cau_hoi)
        if kieu == 'read':
            dat = ''
            if "Hình ảnh" in ques.dang_cau_hoi:
                media = '''
                <img id="hinh_anh_modal" style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src="/media/{0}" alt="chọn hình ảnh" /><br>
                '''.format(ques.dinh_kem)
            elif "Âm thanh" in ques.dang_cau_hoi:
                media = '''
                <audio id="media" controls width="100%" src="/media/{0}"></audio>
                '''.format(ques.dinh_kem)
            elif "Video" in ques.dang_cau_hoi:
                media = '''
                <video id="media" controls width="100%" src="/media/{0}"></video>
                '''.format(ques.dinh_kem, ques.noi_dung)
            for i, da in enumerate(DapAn.objects.filter(cau_hoi_id=ques)):
                s = chr(ord(str(i)) + 17)
                if da.dap_an_dung:
                    dung = '(Đúng)'
                else:
                    dung = ''
                result = re.search('<p>(.*)</p>', da.noi_dung)
                dat += '''
                <p>{0}: {2} {1}</p>
                '''.format(s, dung, result.group(1))
            content = '''
            <input hidden name="id" value="{2}">{0}
            <ul class="list-unstyled msg_list">
            <li><a>{3}{1}</a></li>
            '''.format(media, dat, ques.id, ques.noi_dung)
        return HttpResponse(content)


def user_login(request):
    user = request.user
    if user.is_authenticated:
        if user.position == 0:
            return redirect("/student")
        elif user.position == 1:
            return redirect("/teacher")
        else:
            return redirect("/adminsc")
    else:
        if request.method == 'POST':
            # post form để User yêu cầu reset mật khẩu, gửi link về mail
            if 'uemail' in request.POST:
                form = UserResetForm(request.POST)
                if form.is_valid():
                    to_email = form.cleaned_data['uemail']
                    current_site = get_current_site(request)
                    user = get_email(to_email)
                    mail_subject = 'Reset password your account.'
                    message = render_to_string('teacher/resetpwd.html', {
                        'user': user,
                        'domain': current_site.domain,
                        'uid':urlsafe_base64_encode(force_bytes(user.id)).decode(),
                        'token':account_activation_token.make_token(user),
                    })
                    email = EmailMessage(
                                mail_subject, message, to=[to_email]
                    )
                    thread = EmailThread(email)
                    thread.start()
                    return render(request, 'teacher/login.html', {'mess': 'Please check email to reset your password!'})
                else:
                    error = ''
                    for field in form:
                        error += field.errors
                    return render(request, 'teacher/login.html', {'error': error})
            elif 'username' and 'password' in request.POST:
                username = request.POST['username']
                password = request.POST['password']
                user = authenticate(username=username, password=password)
                if user:
                    if user.is_active:
                        login(request, user)
                        if user.position == 0:
                            return HttpResponseRedirect('/student')
                        elif user.position == 1:
                            return HttpResponseRedirect('/teacher')
                        else:
                            return redirect('/adminsc/')
                    else:
                        return render(request, 'teacher/login.html', {'error': 'Your account is blocked!'})
                else:
                    return render(request, 'teacher/login.html', {'error': 'Invalid username or password '})
            elif 'firstname' and 'email' and 'password2' in request.POST:
                user_form = UserForm(request.POST)
                if user_form.is_valid():
                    user = user_form.save()
                    return redirect('/')
                else:
                    error = ''
                    for field in user_form:
                        error += field.errors
                    return render(request, 'teacher/login.html',{'error':error})
        return render(request, 'teacher/login.html')


def resetpwd(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = MyUser.objects.get(id=uid)
    except(TypeError, ValueError, OverflowError):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        if request.method == 'POST':
            form = ResetForm(request.POST)
            if form.is_valid():
                user.set_password(form.cleaned_data)
                user.save()
                return redirect('/')
            else:
                return redirect('/')
        return render(request, 'teacher/formresetpass.html', {})
    else:
        return HttpResponse('Link is invalid!')


def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/')


def user_profile(request):
    user = request.user
    if user.is_authenticated and user.position == 1:
        content = {'username': mark_safe(json.dumps(user.username)),
                   'list_lop': ChiTietLop.objects.filter(myuser_id=user)}
        return render(request, 'teacher/profile.html', content)
    else:
        return HttpResponseRedirect('/')


def share(request, lop):
    user = request.user
    if user.is_authenticated:
        ls_chi_tiet = ChiTietLop.objects.filter(lop_id=Lop.objects.get(ten=lop)).values('myuser_id')
        ls_student = MyUser.objects.filter(id__in=ls_chi_tiet, position=0)
        content = {'username': mark_safe(json.dumps(user.username)),
                   'list_lop': ChiTietLop.objects.filter(myuser_id=user),
                   'ls_student': ls_student}
        if user.position == 0:
            return render(request, 'student/share.html', content)
        else:
            return render(request, 'teacher/share.html', content)
    else:
        return HttpResponseRedirect('/')


def call11(request):
    user = request.user
    if user.is_authenticated and user.position == 1:
        return render(request, 'videocall/home.html')
    else:
        return HttpResponseRedirect('/')


def handle_uploaded_file(f):
    name = f.name
    if " " in name:
        name = name.replace(" ", "_")
    path = "{0}/question_upload/{1}".format(settings.MEDIA_ROOT, name)
    file = open(path, 'wb+')
    for chunk in f.chunks():
        file.write(chunk)
    file.close()   
