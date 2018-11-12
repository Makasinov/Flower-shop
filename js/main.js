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

function getHTMLBlock(obj) {
    var string = 
        '<div class="container">' +
            '<div class="title">' +
                '<a class="name">' +
                    obj.name + 
                '</a>' +
                '<a class="jlink" href="#" style="width: 360px">' +
                '<span class="b">' +
                    obj.price +
                'р</span>' +
                '<span class="c">Купить</span>' + 
                '</a>' + 
                // '<br>'+ 
            '</div>' +
            '<img src="' +
                obj.img + 
            '" width="300" height="300">' +
        '</div>';

        return string;
}