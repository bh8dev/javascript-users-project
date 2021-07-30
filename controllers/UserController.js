class UserController
{
    constructor(formId, tableTbodyId)
    {
        this.form = document.getElementById(formId);
        this.tableTbody = document.getElementById(tableTbodyId);
        this.onSubmit();
    }

    onSubmit()
    {
        this.form.addEventListener('submit', event => {

            event.preventDefault();

            this.addNewTableDataIntoTable(this.getValues());
        });
    }

    getValues()
    {
        let user = {};

        for (const field of this.form.elements)
        {

            if (field.name === 'gender')
            {
                if(field.checked)
                {
                    user[field.name] = field.value;
                }
            }
            else
            {
                user[field.name] = field.value;
            }

        }
    
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }

    addNewTableDataIntoTable(user)
    {
        let date = new Date();
        let today = this.addZerosToDate(date.getDay()) + '/' + this.addZerosToDate((date.getMonth() + 1)) + '/' + date.getFullYear();
    
        this.tableTbody.innerHTML = 
        `
            <tr>
                <td>
                    <img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm">
                </td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.admin}</td>
                <td>${(today <= 9) ? '0' + today : today}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `;
    }

    addZerosToDate(date)
    {
        return (date <= 9) ? '0' + date : date;
    }
}