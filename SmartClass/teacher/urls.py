from django.conf.urls import include, url
from django.urls import path
from . import views

app_name = 'teacher'
urlpatterns = [
    path('', views.user_login),
    path('teacher', views.home, name='home'),
    path('manage_class/<str:lop>', views.manage_class, name='manage_class'),
    path('manage_point/<str:lop>', views.manage_point, name='manage_point'),
    path('manage_point_data_<str:lop>', views.manage_point_data, name='manage_point_data'),
    path('manage_point_detail_<int:id>', views.manage_point_detail, name='manage_point_detail'),
    path('manage_de', views.manage_de, name='manage_de'),
    path('de_data_<int:all>', views.de_data, name='de_data'),
    path('chi_tiet_de_data_<int:id>', views.chi_tiet_de_data, name='de_data'),
    path('manage_question', views.manage_question, name='manage_question'),
    path('question_data_<int:id_mon>_<int:all>', views.question_data, name='question_data'),
    path('profile/', views.user_profile, name='profile'),
    path('logout/', views.user_logout, name='logout'),
    path(r'^resetpassword/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.resetpwd, name='resetpassword'),
    path('share_<str:lop>', views.share, name='share'),
    path('videocall/', views.call11, name='call11'),

]
