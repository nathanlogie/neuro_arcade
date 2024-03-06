from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def react_index(request: HttpRequest) -> HttpResponse:
    return render(request, 'index.html')
