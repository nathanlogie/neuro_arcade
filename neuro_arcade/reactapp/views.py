from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request


def react_test(request: HttpRequest) -> HttpResponse:
    return render(request, 'react_index.html')


@api_view(['GET', 'POST'])
def fibbonaci(request: Request) -> Response:
    """
    example request:
    {
        'skip': 0,
        'numbers': 10,
    }
    """
    skip = 0
    n = 10
    if request.method == 'POST':
        skip = int(request.data.get('skip', skip))
        n = int(request.data.get('numbers', n))

    arr = [1, 1]

    if skip is None or skip < 0:
        skip = 0

    if n is None or n <= 0:
        return Response({'numbers': []})
    elif skip + n < 3:
        return Response({'numbers': arr[:n]})
    else:
        for _ in range(skip + n):
            arr.append(arr[-1] + arr[-2])

        return Response({'numbers': arr[skip:n]})
