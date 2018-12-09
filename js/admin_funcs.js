var body = document.getElementById('main_container');
// alert('I\'m connected!');

var xhr = new XMLHttpRequest();
xhr.open('GET', '/start_page');
xhr.onreadystatechange = () => {
    if (xhr.readyState != 4) return;
    if (xhr.status != 200) return;
    var response = xhr.responseText;
    response = JSON.parse(response);
    var bodyHTML;
    bodyHTML = `
    <a href="/admin/new">
        <img src="https://image.flaticon.com/icons/svg/148/148764.svg" width="30">
    </a><br>
<table border="1" width="60%" cellpadding="5">
   <tr>
    <th>_id</th>
    <th>name</th>
    <th>price</th>
    <th>number</th>
    <th>img</th>
    <th>Options</th>
   </tr>`;
    response.forEach(el => {
        bodyHTML += `<tr>
                               <td>${el._id}</td>
                               <td>${el.name}</td>
                               <td>${el.price}</td>
                               <td>${el.number}</td>
                               <td>${el.img}</td>
                               <td>
                                <a href="/admin/remove/${el._id}" onclick="return confirm('Уверены что хотите удалить?')">
                                    <img src="https://image.flaticon.com/icons/svg/148/148766.svg"
                                        width="23">
                                </a>
                                <a href="/admin/change/${el._id}" style="margin-left: 10px">
                                    <img src="https://image.flaticon.com/icons/svg/1293/1293302.svg"
                                        width="23">
                                </a>
                               </td>
                            </tr>`;
    });
    bodyHTML +=
        `</table>`;
    // alert(bodyHTML);
    document.getElementById('delete_me_after').innerHTML = '';
    body.innerHTML = bodyHTML;
}
xhr.send();

























