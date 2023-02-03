let s_msg =  document.getElementById('s_modal');
let e_msg =  document.getElementById('e_modal');
let modal_delete =  document.getElementById('modal_delete');


function hide_msg(number) {
    if (number === 1) {
        s_msg = document.getElementById('s_modal');
        s_modal.style.display = 'none';
    }else if(number === 2) {
        let e_msg = document.getElementById('e_modal');
        e_msg.style.display = 'none';
    }
}

function set_time(number) {

    if (number === 1) {
        setTimeout(function() {hide_msg(1)}, 3500);
    }else if(number === 2) {
        setTimeout(function(){hide_msg(2)}, 3500);
    }
}


function get_data(nome, email) {
    let n = document.getElementById(nome);
    let e = document.getElementById(email);
    return [n, e]
}


function fill_person_data(person_data) {
    let persons = document.getElementById('persons');
    persons.innerHTML = '';
    for (person of person_data) {
        persons.innerHTML += `<li class="flex card">
                                <a class="text-card" href="/main/editar/${person.id}">${person.id} - ${person.nome}</a>
                                <button class="delete-btn" onclick="delete_url(${person.id}, '${person.nome}')">Deletar</button>
                           </li>`

    }

    let duplicate = document.getElementsByClassName('hidden')
    let duplicate_list = Array.from(duplicate); // Transformando o HTMLcollection em uma array

    i = 0
    while (duplicate_list.length > 1){
        i++;
        duplicate_list[i].pop() // Removendo todas as duplicatas e deixando apenas um
    }



}



function save_client(event) {
    event.preventDefault()
    let csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let [_nome, _email] = get_data('nome_c', 'email_c')
    console.log(_nome, _email)
    fetch('/usuarios/salvar', {
        method: 'POST',
        headers: {'X-CSRFToken': csrf_token},
        body: JSON.stringify({nome: _nome.value, email: _email.value}),
    }).then((r)=> {
        return r.json()
    }).then(data=>{

        if(data.status === 500) {
            document.getElementById('text_e').innerHTML = '<p>Este e-mail já esta em uso</p>';
            e_msg.style.display = 'flex';
            set_time(2);

        }else if(data.status === 200) {
            document.getElementById('text_s').innerHTML = '<p>Dados salvo com sucesso</p>';
            s_msg.style.display = 'flex';
            set_time(1);
            fill_person_data(data.person_array)
        }else {
            document.getElementById('text_e').innerHTML = '<p>E-mail invalido. Digite novamente</p>';
            e_msg.style.display = 'flex';
            set_time(2);
        }
    })
}




function fill_info(name, email) {
    let _nome = document.getElementById('info-name').innerHTML = `<p>${name}</p>`;
    let _email = document.getElementById('info-email').innerHTML = `<p>${email}</p>`;
}


function update_c(event) {
    event.preventDefault()

    let id = document.getElementById('p_id').value;
    let _nome = document.getElementById('nome').value;
    let _email = document.getElementById('email').value;
    let csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`/usuarios/update/${id}`, {
        method: 'POST',
        headers: {'X-CSRFToken': csrf_token},
        body: JSON.stringify({nome: _nome, email: _email}),
    }).then((r)=> {
        return r.json()
    }).then((data)=> {
        console.log(data.status)
        if(data.status === 200) {
            s_msg.style.display = 'flex';
            set_time(1);
            fill_info(data.nome, data.email);


        }else if(data.status === 400) {
            document.getElementById('text_e').innerHTML = '<p>E-mail inválido. Digite novamente</p>';
            e_msg.style.display = 'flex';
            set_time(2)


        }else if(data.status === 500) {
            document.getElementById('text_e').innerHTML = '<p>Este e-mail já esta em uso</p>';
            e_msg.style.display = 'flex';
            set_time(2)
        }
    })
}




function hide_modal (e){
    let target_id = e.target.id
    if (target_id === 'modal_delete') {
        modal_delete.style.display = 'none'
    }
}



function delete_url(id, nome, e) {
    let csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    modal_delete.style.display = 'flex'
    document.getElementById('modal_text').innerHTML = `Você quer mesmo apagar o usuário: <span class="delete_name">${nome}</span>?`;



    let delete_btn = document.getElementById('delete-btn')
    delete_btn.addEventListener('click', ()=> {
        fetch(`/usuarios/delete/${id}`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrf_token},
        }).then((resp)=> {
            return resp.json()
        }).then((data)=> {
            if(data.status === 200) {
                document.getElementById('text_s').innerHTML = 'Usuário removido';
                s_msg.style.display = 'flex';
                set_time(1);

                setTimeout(()=> {
                    location.replace("/usuarios/")
                }, 1500)

            }

        })
    })

}


