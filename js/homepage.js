function buy() {

    let client_name  = document.getElementById('client_name').value;
    let client_tel   = document.getElementById('mobile').value;
    let client_email = document.getElementById('email').value;
    let product_id   = document.getElementsByClassName('form')[0].id;
    let product_quantity = document.getElementById('quantity').value;
    let product_name = document.getElementById('recipient-name').value;
    let final_price  = document.getElementById('final_price').dataset.price;

    if (product_quantity != 0 && client_name != '' && client_tel != '' && client_email != '' && final_price != 0) {    // Проверка на пустоту полей
        var url2 =
            `/buy?id=${product_id}&
        name=${product_name}&
        inputNumber=${product_quantity}&
        user=${client_name}&
        tel=${client_tel}&
        email=${client_email}&
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

$('#exampleModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget); // Button that triggered the modal

    let recipient = button.data('id');
    let title = button.data('name');
    let quantity = button.data('quantity');
    let price = button.data('price');
    
    let modal = $(this);
    // modal.find('.modal-title').text('Форма заказа');
    modal.find('form').attr({
        id: recipient
    })
    modal.find('#final_price').attr({
        "data-price" : price
    });
    modal.find('#final_price').text('Конечная стоимость ' + price + 'р');
    modal.find('.modal-body #recipient-name').val(title);
    $("#quantity").attr({
        "max": quantity,
        "placeholder": "В наличии " + quantity
    });
    var final_price = 0;
    var inputNumber = document.getElementById('quantity');
    inputNumber.value = NaN;
    inputNumber.oninput = () => {
        // alert(inputNumber.value);
      if (inputNumber.value > quantity) inputNumber.value = quantity;
      final_price = inputNumber.value * price;
      modal.find('#final_price').attr({
        "data-price" : final_price
    });
      document.getElementById('final_price').innerHTML = 'Конечная стоимость ' + final_price + 'р';  
    };
});