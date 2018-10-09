from django.conf.urls import include, url
from django.urls import path
from . import views

app_name = 'adminsc'
urlpatterns = [
    path('', views.home, name='home'),
    path('manage_teacher', views.manage_teacher, name='manage_teacher'),
    path('manage_teacher/data_<str:lop>', views.manage_teacher_data, name='manage_teacher_data'),
    path('mon_data', views.mon_data, name='mon_data'),
    path('lop_data', views.lop_data, name='lop_data'),
    path('manage_student', views.manage_student, name='manage_student'),
    path('manage_student/data_<str:lop>', views.manage_student_data, name='manage_student_data'),
    path('manage_class', views.manage_class, name='manage_class'),
    path('manage_class/data', views.manage_class_data, name='manage_class_data'),
    path('manage_mon', views.manage_mon, name='manage_mon'),
    path('manage_mon/data', views.manage_mon_data, name='manage_mon_data'),
    path('manage_nien_khoa', views.manage_nien_khoa, name='manage_nien_khoa'),
    path('manage_nien_khoa_data', views.manage_nien_khoa_data, name='manage_nien_khoa_data'),
    path('manage_khoa', views.manage_khoa, name='manage_khoa'),
    path('manage_khoa_data', views.manage_khoa_data, name='manage_khoa_data'),
    path('profile', views.user_profile, name='profile'),
    path('logout', views.user_logout, name='logout'),
]
