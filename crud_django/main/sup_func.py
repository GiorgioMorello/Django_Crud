import re


def save_data(id: int, nome: str, email: str, pessoa_obj: object) -> bool:
    try:
        pessoa = pessoa_obj.objects.get(id=id)
        pessoa.nome = nome
        pessoa.email = email
        pessoa.save()
        return True
    except:
        return False


def check_email_syntax(cliente_email: str)-> bool:
    if not re.fullmatch(re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'), cliente_email):
        return True


def check_email_db(id: int, cliente_email: str, pessoa_obj: object)-> bool:
    qs = None

    try:
        pessoa_existente = pessoa_obj.objects.filter(email=cliente_email)
        print(pessoa_existente)
        if pessoa_existente is not None:
            print("JA existe")
            qs = pessoa_existente.exclude(id=id)
        if qs.exists():
            print("Email ja existe")
            return True  # Caso o email já exista

    except:
        print("AKI DIZ QUE FOI")
        return False
