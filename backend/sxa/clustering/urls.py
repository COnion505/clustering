from django.urls import path

from . import views

urlpatterns = [
  path('exec/', views.Clustering.as_view(), name='clustering'),
]
