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

            let btnSubmit = this.form.querySelector("[type='submit']");
            btnSubmit.disabled = true;

            let values = this.getValues();

            this.getPhoto().then(result => {

                values.photo = result;
                this.addNewTableDataIntoTable(values);

                this.form.reset();
                btnSubmit.disabled = false;

            }).catch((err) => {

                console.error(err);

            });
        });
    }

    getValues()
    {
        let user = {};
        
        [...this.form.elements].forEach((field, index) => {

            if (field.name === 'gender')
            {
                if(field.checked)
                {
                    user[field.name] = field.value;
                }
            }
            else if(field.name === 'admin')
            {
                user[field.name] = field.checked;
            }
            else
            {
                user[field.name] = field.value;
            }

        });
    
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
        let tr = document.createElement('tr');
    
        tr.innerHTML = 
        `
            <tr>
                <td>
                    <img src="${user.photo}" alt="User Image" class="img-circle img-sm">
                </td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${(user.admin) ? 'Sim' : 'Não'}</td>
                <td>${Utils.dateFormat(user.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `;
        this.tableTbody.appendChild(tr);
    }

    getPhoto()
    {
        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...this.form.elements].filter(element => {

                if(element.name === 'photo')
                {
                    return element;
                }

            });

            let file = elements[0].files[0];

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (err) => {
                reject(err);
            };

            if(file)
            {

                fileReader.readAsDataURL(file);
            }
            else
            {
                resolve('dist/img/boxed-bg.jpg');
            }

        });
    }
}