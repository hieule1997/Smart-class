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
    if user.is_authenticated and user.position == 2:
        content = {'username': mark_safe(json.dumps(user.username)),}
        return render(request, 'adminsc/index.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_teacher(request):
    user = request.user

    content = {'username': mark_safe(json.dumps(user.username)),}

    if user.is_authenticated and user.position == 2:
        if request.method == 'POST':
            if 'delete' in request.POST:
                MyUser.objects.get(id=request.POST['delete']).delete()
            elif 'block' in request.POST:
                gv = MyUser.objects.get(id=request.POST['block'])
                if gv.is_active:
                    gv.is_active = False
                else:
                    gv.is_active = True
                gv.save()
            elif 'fullname' in request.POST:
                list_mon = request.POST['list_mon']
                list_mon = json.loads(list_mon)
                list_lop = request.POST['list_lop']
                list_lop = json.loads(list_lop)
                if request.POST['kieu'] == 'new':
                    try:
                        gv = MyUser.objects.create_teacher(email=request.POST['email'],
                                                           fullname=request.POST['fullname'],
                                                           username=request.POST['username'],
                                                           password=request.POST['password'],
                                                           gioi_tinh=request.POST['gioi_tinh'])
                        for mon in list_mon:
                            ten, lop = mon.split(" - ")
                            m = Mon.objects.get(ten=ten, lop=lop)
                            GiaoVienMon.objects.create(mon_id=m, myuser_id=gv)
                        for ten in list_lop:
                            l = Lop.objects.get(ten=ten)
                            ChiTietLop.objects.create(lop_id=l, myuser_id=gv)
                    except:
                        pass
                else:
                    try:
                        gv = MyUser.objects.get(username=request.POST['username'])
                        gv.fullname = request.POST['fullname']
                        gv.gioi_tinh = request.POST['gioi_tinh']
                        gv.email = request.POST['email']
                        gv.save()
                        GiaoVienMon.objects.filter(myuser_id=gv).delete()
                        for mon in list_mon:
                            ten, lop = mon.split(" - ")
                            m = Mon.objects.get(ten=ten, lop=lop)
                            GiaoVienMon.objects.create(mon_id=m, myuser_id=gv)
                        ChiTietLop.objects.filter(myuser_id=gv).delete()
                        for ten in list_lop:
                            l = Lop.objects.get(ten=ten)
                            ChiTietLop.objects.create(lop_id=l, myuser_id=gv)
                    except:
                        pass
            else:
                list_teacher = request.POST['list_teacher']
                list_teacher = json.loads(list_teacher)
                for tea in list_teacher:
                    if len(tea) == 0:
                        continue
                    tem = tea[1].split(" ")
                    usname = ''
                    for s in tem:
                        usname += s[0].lower()
                    usname += '_{}'.format(tea[0])
                    email = usname + "@gmail.com"
                    if tea[2] == 'Nam':
                        gioi_tinh = 1
                    else:
                        gioi_tinh = 0
                    gv = MyUser.objects.create_teacher(email=email,
                                                       fullname=tea[1],
                                                       username=usname,
                                                       password=1,
                                                       gioi_tinh=gioi_tinh)
                    list_mon = tea[3].split(",")
                    for mon in list_mon:
                        ten, lop = mon.split(" - ")
                        GiaoVienMon.objects.create(myuser_id=gv, mon_id=Mon.objects.get(ten=ten, lop=lop))
                    list_lop = tea[4].split(",")
                    for lop in list_lop:
                        ChiTietLop.objects.create(lop_id=Lop.objects.get(ten=lop), myuser_id=gv)

        return render(request, 'adminsc/manage_teacher.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_teacher_data(request, lop):
    user = request.user
    if user.is_authenticated and user.position == 2:
        if lop == 'all':
            ls_teacher = MyUser.objects.filter(position=1)
        else:
            ls_chi_tiet = ChiTietLop.objects.filter(lop_id=Lop.objects.get(ten=lop)).values('myuser_id')
            ls_teacher = MyUser.objects.filter(id__in=ls_chi_tiet, position=1)
        data = []
        for teacher in ls_teacher:
            fullname = '<p id="full_{0}">{1}</p>'.format(teacher.id, teacher.fullname)
            username = '<p id="user_{0}">{1}</p>'.format(teacher.id, teacher.username)
            if teacher.gioi_tinh == 0:
                gioi_tinh = '<p id="gioi_{}">Nữ</p>'.format(teacher.id)
            else:
                gioi_tinh = '<p id="gioi_{}">Nam</p>'.format(teacher.id)
            if teacher.is_active:
                icon = 'fa fa-lock'
                title = 'khóa'
                trang_thai = '<span class="label label-success">kích hoạt</span>'
            else:
                icon = 'fa fa-unlock'
                title = 'mở khóa'
                trang_thai = '<span class="label label-danger">khóa</span>'
            mon = GiaoVienMon.objects.filter(myuser_id=teacher)
            ls_mon = ''
            for m in mon:
                ls_mon += '<p class="list_mon{0}">{1} - {2}</p>'.format(teacher.id, m.mon_id.ten, m.mon_id.lop)
            lop = ChiTietLop.objects.filter(myuser_id=teacher)
            ls_lop = ''
            for l in lop:
                ls_lop += '<p class="list_lop{0}">{1}</p>'.format(teacher.id, l.lop_id.ten)
            options = '''
                <div class="btn-group">
                    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#new_teacher" data-title="edit" id="edit_{0}">
                        <i class="fa fa-cog" data-toggle="tooltip" title="Chỉnh sửa"></i>
                    </button> 
                    <button type="button" class="btn btn-warning" data-title="block" id="block_{0}">
                        <i class="{2}" data-toggle="tooltip" title="{3}"></i></i>
                    </button> 
                    <button type="button" class="btn btn-danger" data-title="del" id="del_{0}">
                        <i class="fa fa-trash" data-toggle="tooltip" title="Xóa"></i>
                    </button> 
                </div>
                <p hidden id="email_{0}">{1}</p>
            '''.format(teacher.id, teacher.email, icon, title)
            data.append([fullname, gioi_tinh, ls_mon, ls_lop, username, trang_thai, options])
        big_data = {"data": data}
        json_data = json.loads(json.dumps(big_data))
        return JsonResponse(json_data)


def manage_mon(request):
    user = request.user

    content = {'username': mark_safe(json.dumps(user.username))}

    if user.is_authenticated and user.position == 2:
        if request.method == 'POST':
            if 'delete' in request.POST:
                Mon.objects.get(id=request.POST['delete']).delete()
            else:
                if request.POST['kieu'] == 'new':
                    try:
                        Mon.objects.create(ten=request.POST['ten'], lop=request.POST['lop'], mo_ta=request.POST['mo_ta'])
                    except:
                        pass
                else:
                    m = Mon.objects.get(id=request.POST['id'])
                    m.ten = request.POST['ten']
                    m.lop = request.POST['lop']
                    m.mo_ta = request.POST['mo_ta']
                    m.save()
        return render(request, 'adminsc/manage_mon.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_mon_data(request):
    user = request.user
    if user.is_authenticated and user.position == 2:
        data = []
        for mon in Mon.objects.all():
            ten = '<p id="ten_{0}">{1}</p>'.format(mon.id, mon.ten)
            lop = '<p id="lop_{0}">{1}</p>'.format(mon.id, mon.lop)
            mo_ta = '<p id="mota_{0}">{1}</p>'.format(mon.id, mon.mo_ta)
            options = '''
                <div class="btn-group">
                    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#new_mon" data-title="edit" id="edit_{0}">
                        <i class="fa fa-cog" data-toggle="tooltip" title="Chỉnh sửa"></i>
                    </button> 
                    <button type="button" class="btn btn-danger" data-title="del" id="del_{0}">
                        <i class="fa fa-trash" data-toggle="tooltip" title="Xóa"></i>
                    </button> 
                </div>
            '''.format(mon.id)
            data.append([ten, lop, mo_ta, options])
        big_data = {"data": data}
        json_data = json.loads(json.dumps(big_data))
        return JsonResponse(json_data)


def mon_data(request):
    user = request.user
    if user.is_authenticated and user.position == 2:
        ls_mon = []
        for mon in Mon.objects.all():
            ls_mon.append({"ten": mon.ten, "lop": mon.lop})
        return JsonResponse(ls_mon, safe=False)


def lop_data(request):
    user = request.user
    if user.is_authenticated and user.position == 2:
        ls_lop = []
        for l in Lop.objects.all():
            ls_lop.append({"ten": l.ten})
        return JsonResponse(ls_lop, safe=False)


def manage_student(request):
    user = request.user

    content = {'username': mark_safe(json.dumps(user.username)), 'ds_lop': Lop.objects.all()}

    if user.is_authenticated and user.position == 2:
        if request.method == 'POST':
            if 'delete' in request.POST:
                MyUser.objects.get(id=request.POST['delete']).delete()
            elif 'block' in request.POST:
                hs = MyUser.objects.get(id=request.POST['block'])
                if hs.is_active:
                    hs.is_active = False
                else:
                    hs.is_active = True
                hs.save()
            elif 'fullname' in request.POST:
                if request.POST['kieu'] == 'new':
                    try:
                        hs = MyUser.objects.create_student(email=request.POST['email'],
                                                           fullname=request.POST['fullname'],
                                                           username=request.POST['username'],
                                                           password=request.POST['password'],
                                                           gioi_tinh=request.POST['gioi_tinh'])
                        new_lop = Lop.objects.get(ten=request.POST['list_lop'])
                        ChiTietLop.objects.create(lop_id=new_lop, myuser_id=hs)
                    except:
                        pass
                else:
                    try:
                        hs = MyUser.objects.get(username=request.POST['username'])
                        hs.fullname = request.POST['fullname']
                        hs.gioi_tinh = request.POST['gioi_tinh']
                        hs.email = request.POST['email']
                        hs.save()

                        lop = ChiTietLop.objects.get(myuser_id=hs)
                        lop.lop_id = Lop.objects.get(ten=request.POST['list_lop'])
                        lop.save()

                    except:
                        pass
            else:
                list_student = request.POST['list_student']
                list_student = json.loads(list_student)
                for stu in list_student:
                    if stu is None:
                        continue
                    tem = stu[1].split(" ")
                    usname = ''
                    for s in tem:
                        usname += s[0].lower()
                    usname += '_{}_{}'.format(stu[3], stu[0])
                    email = usname + "@gmail.com"
                    if stu[2] == 'Nam':
                        gioi_tinh = 1
                    else:
                        gioi_tinh = 0
                    try:
                        hs = MyUser.objects.create_student(email=email,
                                                           fullname=stu[1],
                                                           username=usname,
                                                           password=1,
                                                           gioi_tinh=gioi_tinh)
                        new_lop = Lop.objects.get(ten=stu[3])
                        ChiTietLop.objects.create(lop_id=new_lop, myuser_id=hs)
                    except:
                        pass

        return render(request, 'adminsc/manage_student.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_student_data(request, lop):
    user = request.user
    if user.is_authenticated and user.position == 2:
        if lop == 'all':
            ls_student = MyUser.objects.filter(position=0)
        else:
            ls_chi_tiet = ChiTietLop.objects.filter(lop_id=Lop.objects.get(ten=lop)).values('myuser_id')
            ls_student = MyUser.objects.filter(id__in=ls_chi_tiet, position=0)
        data = []
        for student in ls_student:
            fullname = '<p id="full_{0}">{1}</p>'.format(student.id, student.fullname)
            username = '<p id="user_{0}">{1}</p>'.format(student.id, student.username)
            if student.gioi_tinh == 0:
                gioi_tinh = '<p id="gioi_{}">Nữ</p>'.format(student.id)
            else:
                gioi_tinh = '<p id="gioi_{}">Nam</p>'.format(student.id)
            if student.is_active:
                icon = 'fa fa-lock'
                title = 'khóa'
                trang_thai = '<span class="label label-success">kích hoạt</span>'
            else:
                icon = 'fa fa-unlock'
                title = 'mở khóa'
                trang_thai = '<span class="label label-danger">khóa</span>'
            lop_ct = ''
            try:
                lop_ct = ChiTietLop.objects.get(myuser_id=student)
                lop_ct = lop_ct.lop_id.ten
            except ObjectDoesNotExist:
                pass
            ls_lop = '<p class="list_lop{0}">{1}</p>'.format(student.id, lop_ct)
            options = '''
                <div class="btn-group">
                    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#new_student" data-title="edit" id="edit_{0}">
                        <i class="fa fa-cog" data-toggle="tooltip" title="Chỉnh sửa"></i>
                    </button> 
                    <button type="button" class="btn btn-warning" data-title="block" id="block_{0}">
                        <i class="{2}" data-toggle="tooltip" title="{3}"></i></i>
                    </button> 
                    <button type="button" class="btn btn-danger" data-title="del" id="del_{0}">
                        <i class="fa fa-trash" data-toggle="tooltip" title="Xóa"></i>
                    </button> 
                </div>
                <p hidden id="email_{0}">{1}</p>
            '''.format(student.id, student.email, icon, title)
            data.append([fullname, gioi_tinh, ls_lop, username, trang_thai, options])
        big_data = {"data": data}
        json_data = json.loads(json.dumps(big_data))
        return JsonResponse(json_data)


def manage_class(request):
    user = request.user
    if user.is_authenticated and user.position == 2:
        if request.method == 'POST':
            if 'delete' in request.POST:
                Lop.objects.get(id=request.POST['delete']).delete()
            else:
                nien_khoa, nam = request.POST['nien_khoa'].split(" - ")
                if request.POST['kieu'] == 'new':
                    try:
                        Lop.objects.create(ten=request.POST['ten'], truong_id=Truong.objects.get(id=1),
                                           khoa_id=Khoa.objects.get(ten_khoa=request.POST['khoa']),
                                           nien_khoa_id=NienKhoa.objects.get(ten_nien_khoa=nien_khoa, nam_hoc=nam))
                    except:
                        pass
                else:
                    l = Lop.objects.get(id=request.POST['id'])
                    l.ten = request.POST['ten']
                    l.nien_khoa_id = NienKhoa.objects.get(ten_nien_khoa=nien_khoa, nam_hoc=nam)
                    l.khoa_id = Khoa.objects.get(ten_khoa=request.POST['khoa'])
                    l.save()
        content = {'username': mark_safe(json.dumps(user.username)), 'ds_khoa': Khoa.objects.all(),
                   'ds_nien_khoa': NienKhoa.objects.all()}
        return render(request, 'adminsc/manage_class.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_class_data(request):
    user = request.user
    if user.is_authenticated and user.position == 2:
        data = []
        for lop in Lop.objects.all():
            ten = '<p id="ten_{}">{}</p>'.format(lop.id, lop.ten)
            khoa = '<p id="khoa_{}">{}</p>'.format(lop.id, lop.khoa_id.ten_khoa)
            nien_khoa = '<p id="nien_khoa_{}">{}</p>'.format(lop.id, lop.nien_khoa_id.ten_nien_khoa + ' - ' + str(lop.nien_khoa_id.nam_hoc))
            ls_chi_tiet = ChiTietLop.objects.filter(lop_id=lop).values('myuser_id')
            gv = '''
            {1}  <i class="fa fa-info-circle" data-title="{0}" data-toggle="modal" data-target="#detail_teacher"></i> 
            '''.format(lop.ten, MyUser.objects.filter(id__in=ls_chi_tiet, position=1).count())
            hs = '''
            {1}  <i class="fa fa-info-circle" data-title="{0}" data-toggle="modal" data-target="#detail_student"></i> 
            '''.format(lop.ten, MyUser.objects.filter(id__in=ls_chi_tiet, position=0).count())
            options = '''
                <div class="btn-group">
                    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#new_class" data-title="edit" id="edit_{0}">
                        <i class="fa fa-cog" data-toggle="tooltip" title="Chỉnh sửa"></i>
                    </button> 
                    <button type="button" class="btn btn-danger" data-title="del" id="del_{0}">
                        <i class="fa fa-trash" data-toggle="tooltip" title="Xóa"></i>
                    </button> 
                </div>
            '''.format(lop.id)
            data.append([ten, khoa, nien_khoa, gv, hs, options])
        big_data = {"data": data}
        json_data = json.loads(json.dumps(big_data))
        return JsonResponse(json_data)


def manage_nien_khoa(request):
    user = request.user

    content = {'username': mark_safe(json.dumps(user.username))}

    if user.is_authenticated and user.position == 2:
        if request.method == 'POST':
            if 'delete' in request.POST:
                NienKhoa.objects.get(id=request.POST['delete']).delete()
            else:
                if request.POST['kieu'] == 'new':
                    try:
                        NienKhoa.objects.create(ten_nien_khoa=request.POST['khoa'], nam_hoc=request.POST['nam'])
                    except:
                        pass
                else:
                    nk = NienKhoa.objects.get(id=request.POST['id'])
                    nk.ten_nien_khoa = request.POST['khoa']
                    nk.nam_hoc = request.POST['nam']
                    nk.save()
        return render(request, 'adminsc/manage_nien_khoa.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_nien_khoa_data(request):
    user = request.user
    if user.is_authenticated and user.position == 2:
        data = []
        for khoa in NienKhoa.objects.all():
            ten = '<p id="ten_{}">{}</p>'.format(khoa.id, khoa.ten_nien_khoa)
            nam = '<p id="nam_{}">{}</p>'.format(khoa.id, khoa.nam_hoc)
            # ls_chi_tiet = ChiTietLop.objects.filter(lop_id=khoa).values('myuser_id')
            # gv = '''
            # {1}  <i class="fa fa-info-circle" data-title="{0}" data-toggle="modal" data-target="#detail_teacher"></i>
            # '''.format(khoa.ten, MyUser.objects.filter(id__in=ls_chi_tiet, position=1).count())
            # hs = '''
            # {1}  <i class="fa fa-info-circle" data-title="{0}" data-toggle="modal" data-target="#detail_student"></i>
            # '''.format(khoa.ten, MyUser.objects.filter(id__in=ls_chi_tiet, position=0).count())
            options = '''
                <div class="btn-group">
                    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#new_nien_khoa" data-title="edit" id="edit_{0}">
                        <i class="fa fa-cog" data-toggle="tooltip" title="Chỉnh sửa"></i>
                    </button> 
                    <button type="button" class="btn btn-danger" data-title="del" id="del_{0}">
                        <i class="fa fa-trash" data-toggle="tooltip" title="Xóa"></i>
                    </button> 
                </div>
            '''.format(khoa.id)
            data.append([ten, nam, options])
        big_data = {"data": data}
        json_data = json.loads(json.dumps(big_data))
        return JsonResponse(json_data)


def manage_khoa(request):
    user = request.user

    content = {'username': mark_safe(json.dumps(user.username))}

    if user.is_authenticated and user.position == 2:
        if request.method == 'POST':
            if 'delete' in request.POST:
                Khoa.objects.get(id=request.POST['delete']).delete()
            else:
                if request.POST['kieu'] == 'new':
                    try:
                        Khoa.objects.create(ten_khoa=request.POST['khoa'], mo_ta=request.POST['mo_ta'])
                    except:
                        pass
                else:
                    nk = Khoa.objects.get(id=request.POST['id'])
                    nk.ten_khoa = request.POST['khoa']
                    nk.mo_ta = request.POST['mo_ta']
                    nk.save()
        return render(request, 'adminsc/manage_khoa.html', content)
    else:
        return HttpResponseRedirect('/')


def manage_khoa_data(request):
    user = request.user
    if user.is_authenticated and user.position == 2:
        data = []
        for khoa in Khoa.objects.all():
            ten = '<p id="ten_{}">{}</p>'.format(khoa.id, khoa.ten_khoa)
            mo_ta = '<p id="mota_{}">{}</p>'.format(khoa.id, khoa.mo_ta)
            # ls_chi_tiet = ChiTietLop.objects.filter(lop_id=khoa).values('myuser_id')
            # gv = '''
            # {1}  <i class="fa fa-info-circle" data-title="{0}" data-toggle="modal" data-target="#detail_teacher"></i>
            # '''.format(khoa.ten, MyUser.objects.filter(id__in=ls_chi_tiet, position=1).count())
            # hs = '''
            # {1}  <i class="fa fa-info-circle" data-title="{0}" data-toggle="modal" data-target="#detail_student"></i>
            # '''.format(khoa.ten, MyUser.objects.filter(id__in=ls_chi_tiet, position=0).count())
            options = '''
                <div class="btn-group">
                    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#new_khoa" data-title="edit" id="edit_{0}">
                        <i class="fa fa-cog" data-toggle="tooltip" title="Chỉnh sửa"></i>
                    </button> 
                    <button type="button" class="btn btn-danger" data-title="del" id="del_{0}">
                        <i class="fa fa-trash" data-toggle="tooltip" title="Xóa"></i>
                    </button> 
                </div>
            '''.format(khoa.id)
            data.append([ten, mo_ta, options])
        big_data = {"data": data}
        json_data = json.loads(json.dumps(big_data))
        return JsonResponse(json_data)


def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/')


def user_profile(request):
    user = request.user
    if user.is_authenticated and user.position == 2:
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
        content = {'username': mark_safe(json.dumps(user.username))}
        return render(request, 'adminsc/profile.html', content)
    else:
        return redirect("/")

