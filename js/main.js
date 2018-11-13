function checkSession() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/session');
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            return;
        }
        if (xhr.responseText != '')
            {
                document.getElementById('adminMode').style.display = 'block';
            }
    }
}

function loadCatalogue() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/start_page');
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            return;
        }
        var str = xhr.responseText;
        var count = 0;
        var json = JSON.parse(str, (key, value) => {
            count++;
            return value;
        });
        if (count > 10) count = 10;
        for (var i = 0; i < count; i++)
            document.getElementById('content').innerHTML += getHTMLBlock(json[i]);
        document.getElementById('content').innerHTML += '</div>';
    }
}

function dialogueWindow(id) {
    var dialogue = document.getElementById('dialogue');
    if (dialogue.style.display == "block")
        dialogue.style.display = "none";
    else {
        var xhr = new XMLHttpRequest();
        var url = '/get/' + id;
        xhr.open('GET', url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                return;
            }
            var json = JSON.parse(xhr.responseText);
            dialogue.style.display = "block";
            var a_name = document.getElementById('name');
            a_name.innerHTML = json.name;
            var a_number = document.getElementById('number');
            a_number.innerHTML = 'В наличии: ' + json.number;
            var a_price = document.getElementById('price');
            a_price.innerHTML = ' x ' + json.price + 'р';
            var a_final_price = document.getElementById('final_price');
            a_final_price.innerHTML = ` = ${json.price}p`;
            var a_id = document.getElementById('id');
            a_id.innerHTML = id;
        }
        xhr.send();
    }
}

function getHTMLBlock(obj) {
    var string =
        '<div class="container noselect">' +
        '<div class="title">' +
        '<a class="name">' +
        obj.name +
        '</a>' +
        `<a class="jlink" onClick="dialogueWindow(\'${obj._id}\')" style="width: 360px">` +
        '<span class="b">' +
        obj.price +
        'р</span>' +
        '<span class="c">Купить</span>' +
        '</a>' +
        '</div>' +
        '<img src="' +
        obj.img +
        '" width="300" height="300"></img>' +
        '</div>';
    return string;
}

function buy() {
    var xhr = new XMLHttpRequest();
    const id = document.getElementById('id').innerHTML;
    var name = document.getElementById('name').innerHTML;
    const inputNumber = document.getElementById('inputNumber').value;
    const user = document.getElementById('user').value;
    const tel = document.getElementById('tel').value;
    const email = document.getElementById('email').value;

    var url2 =  
        `/buy?id=${id}&
        name=${name}&
        inputNumber=${inputNumber}&
        user=${user}&
        tel=${tel}&
        email=${email}`;
    xhr.open('GET', url2);
    xhr.onreadystatechange = () => {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            return;
        }
        // if (xhr.responseText == 'success')
        //     alert('Вы успешно заказали товар!');
        alert(xhr.responseText);
    }
    xhr.send();
}