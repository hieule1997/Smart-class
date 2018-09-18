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
                fullname = '<p id="full_{}">{}</p>'.format(student.id, student.fullname)
                # if student.gioi_tinh == 0:
                #     gioi_tinh = '<p id="gioi_{}">Nữ</p>'.format(student.id)
                # else:
                #     gioi_tinh = '<p id="gioi_{}">Nam</p>'.format(student.id)
                diem_ly_thuyet = '<div class="row">'
                diem_thuc_hanh = '<div class="row">'
                diem_thi = '<div class="row">'
                for diem in DiemSo.objects.filter(myuser_id=student, mon_id=mon):
                    if diem.loai_diem == 'lý thuyết':
                        diem_ly_thuyet += '''
                        <a class="btn" id="lt_{0}" data-toggle="modal" data-target="#point" data-student-id="{1}" data-ngay-lam="{2}" data-bai-lam="{3}">{4}</a>,
                        '''.format(diem.id, student.id, str(diem.ngay_lam), "1+1=2", diem.diem)
                    elif diem.loai_diem == 'thực hành':
                        diem_thuc_hanh += '''
                        <a class="btn" id="th_{0}" data-toggle="modal" data-target="#point" data-student-id="{1}" data-ngay-lam="{2}" data-bai-lam="{3}">{4}</a>,
                        '''.format(diem.id, student.id, str(diem.ngay_lam), "1+1=2", diem.diem)
                    elif diem.loai_diem == 'thi':
                        diem_thi += '''
                        <a class="btn" id="thi_{0}" data-toggle="modal" data-target="#point" data-student-id="{1}" data-ngay-lam="{2}" data-bai-lam="{3}">{4}</a>,
                        '''.format(diem.id, student.id, str(diem.ngay_lam), "1+1=2", diem.diem)
                diem_ly_thuyet += '</div>'
                diem_thuc_hanh += '</div>'
                diem_thi += '</div>'
                data.append([fullname, diem_ly_thuyet, diem_thuc_hanh, diem_thi])
        big_data = {"data": data}
        json_data = json.loads(json.dumps(big_data))
        return JsonResponse(json_data)


def manage_de(request):
    user = request.user
    if user.is_authenticated and user.position == 1:
        content = {'username': mark_safe(json.dumps(user.username)),
                   'list_lop': ChiTietLop.objects.filter(myuser_id=user)}
        return render(request, 'teacher/manage_exam.html', content)
    else:
        return HttpResponseRedirect('/')


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


def question_data(request, id_mon):
    user = request.user
    if user.is_authenticated and user.position == 1:
        data = []
        for ques in CauHoi.objects.filter(myuser_id=user, mon_id=Mon.objects.get(id=id_mon)):
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
            ls_dap_an = ''
            for dap_an in DapAn.objects.filter(cau_hoi_id=ques):
                ls_dap_an += '<p hidden id="dap_an_{0}" class="dap_an_{1}" data-dung="{2}">{3}</p>'.format(dap_an.id, ques.id, dap_an.dap_an_dung, dap_an.noi_dung)
            noi_dung = '<p id="noi_dung_{}">{}</p>{}'.format(ques.id, ques.noi_dung, ls_dap_an)
            data.append([chu_de, dang_cau_hoi, do_kho, ngay_tao, noi_dung])
        json_data = json.loads(json.dumps({"data": data}))
        return JsonResponse(json_data)


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
                    print(user_form.errors)
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