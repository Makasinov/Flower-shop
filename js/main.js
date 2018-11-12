var xhr = new XMLHttpRequest();
xhr.open('GET','/start_page');
xhr.send();
xhr.onreadystatechange = () => {
    if (xhr.readyState != 4) return;
    if (xhr.status != 200) {
        return;
    }
    var str = xhr.responseText;
    var count = 0;
    var json = JSON.parse(str, (key, value) => {
        //if (key == 'name') return value;
        count++;
        return value;
    });
    if (count > 10) count = 10;
    for (var i = 0; i < count; i++)
        document.getElementById('content').innerHTML += getHTMLBlock(json[i]);
    document.getElementById('content').innerHTML += '</div>';
}

function dialogueWindow(id) {
    var dialogue = document.getElementById('dialogue');
    if  (dialogue.style.display == "block")
         dialogue.style.display = "none";
    else 
    {
        dialogue.style.display = "block";
        var a_name = document.getElementById('name');
        a_name.innerHTML = id;
    }
}

function getHTMLBlock(obj) {
    var string = 
        '<div class="container noselect">' +
            '<div class="title">' +
                '<a class="name">' +
                    obj.name + 
                '</a>' +
                `<a class="jlink" onClick="dialogueWindow(\'${obj.name}\')" style="width: 360px">` +
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