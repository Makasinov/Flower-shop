function checkSession() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/session');
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            return;
        }
        if (xhr.responseText != '') {
            document.getElementById('adminMode').style.display = 'block';
            document.getElementById('id').style.opacity = '1';

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
        document.getElementById('content').innerHTML = '';
        for (var i = 0; i < count; i++)
            document.getElementById('content').innerHTML += getHTMLBlock(json[i]);
        document.getElementById('content').innerHTML += '</div>';
    }
}


function dialogueWindow(id) {
    var dialogue = document.getElementById('dialogue');
    if (dialogue.style.display == "block") {
        document.getElementById('delete_me').style.display = "block";
        dialogue.style.display = "none";
    }
    else {
        document.getElementById('form').style.display = "none";
        dialogue.style.display = "block";
        var xhr = new XMLHttpRequest();
        var url = '/get/' + id;
        xhr.open('GET', url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                return;
            }
            var json = JSON.parse(xhr.responseText);
            var a_name = document.getElementById('name');
            a_name.innerHTML = json.name;
            var a_number = document.getElementById('number');
            a_number.innerHTML = 'В наличии: ' + json.number;
            var a_price = document.getElementById('price');
            a_price.innerHTML = ' x ' + json.price + 'р';
            var a_final_price = document.getElementById('final_price');
            a_final_price.innerHTML = ` = ${json.price}p`;
            var a_id = document.getElementById('id');
            a_id.value = id;
            document.getElementById('form').style.display = "block";
            document.getElementById('delete_me').style.display = "none";
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
    const id = document.getElementById('product_id').innerHTML;
    var name = document.getElementById('product_name').innerHTML;
    const inputNumber = document.getElementById('user_quantity').value;
    const user = document.getElementById('user_name').value;
    const tel = document.getElementById('user_mobile').value;
    const email = document.getElementById('user_email').value;
    // var final_price = document.getElementById('final_price').innerHTML;
    // final_price = final_price.substr(3, final_price.length - 4);

    var final_price = 1;

    if (inputNumber != '' && user != '' && tel != '' && email != '' && final_price != '0') {
        var url2 =
            `/buy?id=${id}&
        name=${name}&
        inputNumber=${inputNumber}&
        user=${user}&
        tel=${tel}&
        email=${email}&
        final_price=${final_price}`;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url2);
        let counter = 0;
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) {
                counter++;
                if (counter > 4)
                    alert('При оформлении заказа произошла ошибка!\nПопробуйте позже :(');
                return;
            }
            if (xhr.status != 200) {
                alert('При оформлении заказа произошла ошибка!\nПопробуйте позже :(');
                return;
            }
            if (xhr.responseText == 'success') {
                alert('Заказ успешно сформирован!\nОжидайте звонка оператора');
                window.location = "/";
            } else {
                alert('При оформлении заказа произошла ошибка!\nПопробуйте позже :(');
            }
        }
        xhr.send();
    } else alert('Возникла ошибка!\nВозможно вы не заполнили некоторые поля');
}

var inputNumber = document.getElementById('inputNumber');

inputNumber.oninput = () => {
    var price = document.getElementById('price').innerHTML;
    price = price.substr(3, price.length - 4);
    var finalPrice = document.getElementById('final_price');
    finalPrice.innerHTML = ' = ' + price * inputNumber.value + 'p';
};