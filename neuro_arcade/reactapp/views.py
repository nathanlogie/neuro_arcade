from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def react_test(request: HttpRequest) -> HttpResponse:
    return render(request, 'react_index.html')

