from django.shortcuts import render, redirect, reverse
from .models import Pessoa
import json
from django.http import JsonResponse
from .sup_func import save_data, check_email_db, check_email_syntax
from django.core import serializers




def home(r):
    # READ
    pessoas = Pessoa.objects.all()
    return render(r, 'index.html', {"pessoas": pessoas})






def salvar(r):
    # CREATE
    body_r = json.loads(r.body)
    nome = body_r['nome']
    email = body_r['email']

    try:
        query_s = Pessoa.objects.filter(email=email)
        if query_s:
            return JsonResponse({'status': 500})

        if check_email_syntax(email):
            return JsonResponse({'status': 400})
    except:
        pass

    Pessoa.objects.create(nome=nome, email=email)
    pessoas = Pessoa.objects.all()

    pessoas_json = json.loads(serializers.serialize('json', pessoas))
    pessoas_json = [{'id': pessoa_j['pk'], 'nome': pessoa_j['fields']['nome'], 'email': pessoa_j['fields']['email']} for pessoa_j in pessoas_json]


    return JsonResponse({'status': 200, 'person_array': pessoas_json})







def editar(r, id):
    pessoa = Pessoa.objects.get(id=id)
    return render(r, 'editar.html', {"pessoa": pessoa})


def update(r, id):
    # UPDATE
    body_r = json.loads(r.body)
    nome = body_r['nome']
    email = body_r['email']

    try:
        if check_email_syntax(email):
            return JsonResponse({'status': 400})

        if check_email_db(id, email, pessoa_obj=Pessoa):
            return JsonResponse({'status': 500})

    except:
        pass

    if save_data(id, nome, email, pessoa_obj=Pessoa):
        return JsonResponse({'status': 200, 'nome': nome, 'email': email})
    else:
        return JsonResponse({'status': 500})





def delete(r, id):
    # DELETE
    try:
        pessoa = Pessoa.objects.get(id=id)
        pessoa.delete()
    except:
        return JsonResponse({'status': 500})

    return JsonResponse({'status': 200})
