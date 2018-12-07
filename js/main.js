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
    } else {
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

var inputNumber = document.getElementById('inputNumber');


document.addEventListener('DOMContentLoaded', function () {
    let buttons = document.getElementsByClassName("btn btn-sm btn-outline-secondary");
    for (let i = 0; i < buttons.length; i++) {
        const el = buttons[i];
        const str = `window.location= 'http://${location.host}/product/${el.id}'`
        el.setAttribute("onclick",str);
        console.log(el.onClick);
    }
});