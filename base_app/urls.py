from django.conf.urls import url
import views

urlpatterns = [
    url(r'^home/$', views.home, name='home_url'),
    url(r'^about/$', views.about, name='about_url'),
]