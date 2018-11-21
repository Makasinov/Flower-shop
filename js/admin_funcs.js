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
<table border="1" width="60%" cellpadding="5">
   <tr>
    <th>_id</th>
    <th>name</th>
    <th>price</th>
    <th>number</th>
    <th>img</th>
   </tr>`;
    response.forEach(el => {
        bodyHTML += `<tr>
                               <td>${el._id}</td>
                               <td>${el.name}</td>
                               <td>${el.price}</td>
                               <td>${el.number}</td>
                               <td>${el.img}</td>
                            </tr>`;
    });
    bodyHTML += 
`</table>`;
    alert(bodyHTML);
    body.innerHTML = bodyHTML;
}
xhr.send();

























document.getElementById('delete_me_after').innerHTML = '';