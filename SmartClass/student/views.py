from django.shortcuts import render, redirect, get_object_or_404
from django.template import RequestContext
from django.contrib.auth import login
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth import logout
from django.contrib.auth.hashers import check_password
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

from django.contrib import messages


class EmailThread(threading.Thread):
    def __init__(self, email):
        threading.Thread.__init__(self)
        self._stop_event = threading.Event()
        self.email = email

    def run(self):
        self.email.send()


def home(request):
    user = request.user
    if user.is_authenticated and user.position == 0:
        content = {'mon': lop_mon(user), 'username': mark_safe(json.dumps(user.username))}
        return render(request, 'student/base.html', content)
    else:
        return HttpResponseRedirect('/')


def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/')


def user_profile(request):
    user = request.user
    if user.is_authenticated and user.position == 0:
        if request.method == 'POST':
            if 'fullname' in request.POST:
                if check_password(request.POST['password'], user.password):
                    user.fullname = request.POST['fullname']
                    user.email = request.POST['email']
                    if 'nu' in request.POST:
                        user.gioi_tinh = 0
                    else:
                        user.gioi_tinh = 1
                    user.save()
                    messages.success(request, "Cập nhật thành công")
                else:
                    messages.warning(request, 'Mật khẩu không đúng')
            else:
                if check_password(request.POST['pass1'], user.password):
                    user.set_password(request.POST['pass2'])
                    user.save()
                    messages.success(request, "Cập nhật thành công")
                else:
                    messages.warning(request, 'Mật khẩu không đúng')
            return HttpResponseRedirect("profile")
        content = {'mon': lop_mon(user), 'username': mark_safe(json.dumps(user.username))}
        return render(request, 'student/profile.html', content)
    else:
        return redirect("/")

    
def score(request):
    user = request.user
    if user.is_authenticated and user.position == 0:
        content = {'mon': lop_mon(user), 'username': mark_safe(json.dumps(user.username))}
        return render(request, 'student/score.html', content)
    else:
        return redirect("/")


def mon(request, id):
    user = request.user
    if user.is_authenticated and user.position == 0:
        lopOb = ChiTietLop.objects.get(myuser_id=user)
        monOb = Mon.objects.get(id=id)
        ls_chi_tiet = ChiTietLop.objects.filter(lop_id=lopOb.lop_id).values('myuser_id')
        ls_student = MyUser.objects.filter(id__in=ls_chi_tiet, position=0)
        ls_teacher = MyUser.objects.filter(id__in=ls_chi_tiet, position=1)
        teacher_ht = GiaoVienMon.objects.get(myuser_id__in=ls_teacher, mon_id=monOb)
        content = {'lop': mark_safe(json.dumps(lopOb.lop_id.ten)),'mon': lop_mon(user), 'mon_ht': monOb, 'ls_student': ls_student, 'teacher_ht': teacher_ht, 'username': mark_safe(json.dumps(user.username))}
        return render(request, 'student/subjects.html', content)
    else:
        return redirect("/")


def score_data(request):
    user = request.user

    if user.is_authenticated and user.position == 0:
        data = []
        for mon in Mon.objects.all():
            list_score = DiemSo.objects.filter(myuser_id=user, mon_id=mon)
            if len(list_score) == 0:
                continue
            mon_data = ' <a class="btn">{} - {}</a>'.format(mon.ten, mon.lop)
            kiem_tra_15p = ''
            kiem_tra_1_tiet = ''
            diem_thi = ''
            for diem in list_score:
                if diem.loai_diem == "kiểm tra 15'":
                    kiem_tra_15p += '''
                        <a class="btn" data-id="{0}" data-toggle="modal" data-target="#point" >{1}</a>,
                        '''.format(diem.id, diem.diem)
                elif diem.loai_diem == 'kiểm tra 1 tiết':
                    kiem_tra_1_tiet += '''
                        <a class="btn" data-id="{0}" data-toggle="modal" data-target="#point" >{1}</a>,
                        '''.format(diem.id, diem.diem)
                elif diem.loai_diem == 'thi':
                    diem_thi += '''
                        <a class="btn" data-id="{0}" data-toggle="modal" data-target="#point" >{1}</a>,
                        '''.format(diem.id, diem.diem)
            data.append([mon_data, kiem_tra_15p, kiem_tra_1_tiet, diem_thi])
        big_data = {"data": data}
        json_data = json.loads(json.dumps(big_data))
        return JsonResponse(json_data)


def score_data_detail(request, id):
    user = request.user
    if user.is_authenticated and user.position == 0:
        diem = DiemSo.objects.get(id=id)
        content = '''
        <div class="col-md-6 col-sm-6 col-xs-12 form-group has-feedback">
          <input type="text" class="form-control has-feedback-left" value="{0}" disabled>
          <span class="fa fa-book form-control-feedback left" aria-hidden="true"></span>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12 form-group has-feedback">
          <input type="number" class="form-control has-feedback-left" value="{1}" disabled>
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
        <div class="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
            {4}
        </div>
        <div class="clearfix"></div>
        '''.format('{} - {}'.format(diem.mon_id.ten, diem.mon_id.lop), diem.diem, str(diem.ngay_lam), diem.loai_diem, diem.bai_lam)
        return HttpResponse(content)


def user_mon(request):
    user = request.user
    if user.is_authenticated and user.position == 0:
        content = {'mon': lop_mon(user), 'lop': ChiTietLop.objects.get(myuser_id=user)}

        return render(request, 'student/mon.html', content)
    else:
        return redirect("/")


def lop_mon(user):
    lop = ChiTietLop.objects.get(myuser_id=user)
    try:
        ten_lop = lop.lop_id.ten[:2]
    except:
        ten_lop = lop.lop_id.ten[0]
    all_mon = Mon.objects.filter(lop=ten_lop)
    giao_vien = ChiTietLop.objects.filter(lop_id=lop.lop_id,
                                          myuser_id__in=MyUser.objects.filter(position=1)).values("myuser_id")
    return GiaoVienMon.objects.filter(myuser_id__in=giao_vien, mon_id__in=all_mon)


def exam(request):
    user = request.user
    if user.is_authenticated and user.position == 0:
        if request.method == "POST":
            de = De.objects.get(id=request.POST['de_id'])
            dap_an_id = json.loads(request.POST['dap_an_id'])
            s_dung = 0
            bai_lam = ''
            for i, ch in enumerate(ChiTietDe.objects.filter(de_id=de)):
                tempt = '\n'
                media = ''
                if "Hình ảnh" in ch.cau_hoi_id.dang_cau_hoi:
                    media = '<img style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src="/media/{}" alt="không tồn tại" /><br>'.format(
                        ch.cau_hoi_id.dinh_kem)
                elif "Âm thanh" in ch.cau_hoi_id.dang_cau_hoi:
                    media = '<br><audio controls width="100%" src="/media/{}"></audio>'.format(ch.cau_hoi_id.dinh_kem)
                elif "Video" in ch.cau_hoi_id.dang_cau_hoi:
                    media = '<video controls width="100%" src="/media/{}"></video>'.format(ch.cau_hoi_id.dinh_kem)
                for k, da in enumerate(DapAn.objects.filter(cau_hoi_id=ch.cau_hoi_id)):
                    s = chr(ord(str(k)) + 17)
                    dung = ''
                    if da.dap_an_dung:
                        dung += '(Đúng)'
                        if da.id in dap_an_id:
                            dung += '(Chọn)'
                            s_dung += 1
                    else:
                        if da.id in dap_an_id:
                            dung += '(Chọn)'
                    tempt += '{0}: {1}{2}\n'.format(s, da.noi_dung, dung)
                bai_lam += '''
                <label>Câu hỏi {0}:</label>
                {3}
                <pre style="white-space: pre-wrap;">{1}{2}</pre>
                '''.format(i + 1, ch.cau_hoi_id.noi_dung, tempt, media)
            DiemSo.objects.create(de_id=de, myuser_id=user, mon_id=de.mon_id, loai_diem=de.loai_de, bai_lam=bai_lam,
                                  diem=round(s_dung/ChiTietDe.objects.filter(de_id=de).count(), 3)*10)
        content = {'mon': lop_mon(user),
                   'lop': ChiTietLop.objects.get(myuser_id=user)}
        return render(request, 'student/exam.html', content)
    else:
        return redirect("/")


def exam_data(request, id):
    user = request.user
    if user.is_authenticated and user.position == 0:
        list_ques = ChiTietDe.objects.filter(de_id=De.objects.get(id=id))
        left_content = ''
        right_content = ''
        for i, ques in enumerate(list_ques):
            dap_an = '\n'
            left_content += '''
            <div class="mail_list">
                <a href="#cau_{0}" id="stt_{0}">
                  Câu {0} <span class="label label-danger"><i class="fa fa-close"></i></span>
                </a>
            </div>
            '''.format(i+1)
            media = ''
            if "Hình ảnh" in ques.cau_hoi_id.dang_cau_hoi:
                media = '<img style="max-height:600px;max-width:600px; display: block; margin-left: auto;margin-right: auto;" src="/media/{}" alt="không tồn tại" /><br>'.format(
                    ques.cau_hoi_id.dinh_kem)
            elif "Âm thanh" in ques.cau_hoi_id.dang_cau_hoi:
                media = '<br><audio controls width="100%" src="/media/{}"></audio>'.format(ques.cau_hoi_id.dinh_kem)
            elif "Video" in ques.cau_hoi_id.dang_cau_hoi:
                media = '<video controls width="100%" src="/media/{}"></video>'.format(ques.cau_hoi_id.dinh_kem)
            list_dap_an = DapAn.objects.filter(cau_hoi_id=ques.cau_hoi_id)
            for k, da in enumerate(list_dap_an):
                s = chr(ord(str(k)) + 17)
                dap_an += '''<div class="row">
                    <div class="col-md-1 col-sm-12 col-xs-12 form-group">
                      <input type="radio" class="form-control" data-id="{0}" data-ch_id="{1}" data-da_id="{4}" style="transform:scale(0.6);" name="dap_an_{1}">
                    </div>
                    <div class="col-md-11 col-sm-12 col-xs-12 form-group">
                      <pre style="white-space: pre-wrap;">{2}: {3}</pre>
                    </div>
                </div>'''.format(i+1, ques.cau_hoi_id.id, s, da.noi_dung, da.id)
            right_content += '''
                <div id="cau_{0}">
                    <label>Câu hỏi {0}:</label>
                    {3}
                    <pre style="white-space: pre-wrap;">{1}</pre>
                    {2}
                </div>
            <div>
            '''.format(i+1, list_ques[i].cau_hoi_id.noi_dung, dap_an, media)
        content = '''
        <div class="col-sm-1 mail_list_column">{0}</div>
        <div class="col-sm-11 mail_view showde">
            <div class="inbox-body">{1}</div>
        <div>
        <input type="hidden" value="{2}" name="de_id">
        '''.format(left_content, right_content, id)
        return HttpResponse(content)
