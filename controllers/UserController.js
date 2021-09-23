class UserController
{
    constructor(formCreate, formUpdate, tableTbodyId)
    {
        this.formCreate = document.getElementById(formCreate);
        this.formUpdate = document.getElementById(formUpdate);
        this.tableTbody = document.getElementById(tableTbodyId);
        this.onSubmit();
        this.onEditOrCancel();
    }

    onSubmit()
    {
        this.formCreate.addEventListener('submit', event => {

            event.preventDefault();

            let btnSubmit = this.formCreate.querySelector("[type='submit']");
            btnSubmit.disabled = true;

            let values = this.getValues(this.formCreate);

            if(! values)
            {
                return false;
            }

            this.getPhoto(this.formCreate).then(content => {

                values.photo = content;
                this.addNewTableDataIntoTable(values);

                this.formCreate.reset();
                btnSubmit.disabled = false;

            }).catch((err) => {

                console.error(err);

            });
        });
    }

    getValues(form)
    {
        let user = {};
        let isValidForm = true;
        
        [...form.elements].forEach((field, index) => {

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value)
            {
                field.parentElement.classList.add('has-error');
                isValidForm = false;
            }

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
        
        if(! isValidForm)
        {
            return false;
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
        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(user);
    
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
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `;

        this.addEventsToTableRow(tr);
        
        this.tableTbody.appendChild(tr);

        this.updateUserStatistics();
    }

    getPhoto(targetForm)
    {
        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...targetForm.elements].filter(element => {

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

    updateUserStatistics()
    {
        let usersCounter = 0;
        let adminUsersCounter = 0;

        [...this.tableTbody.children].forEach(tr => {
    
            usersCounter++;

            let user = JSON.parse(tr.dataset.user);

            if(user._admin)
            {
                adminUsersCounter++;
            }

        });
        this.updateElements(usersCounter, adminUsersCounter);
    }

    updateElements(users, admins)
    {
        document.getElementById('users-counter').innerHTML = users;
        document.getElementById('admin-users-counter').innerHTML = admins;
    }

    showCreatePanel()
    {
        document.getElementById('box-user-create').style.display = 'block';
        document.getElementById('box-user-update').style.display = 'none';
    }

    showUpdatePanel()
    {
        document.getElementById('box-user-create').style.display = 'none';
        document.getElementById('box-user-update').style.display = 'block';
    }

    onEditOrCancel()
    {
        document.querySelector('#box-user-update .btn-cancel').addEventListener("click", event => {
            this.showCreatePanel();
        });

        this.formUpdate.addEventListener('submit', event => {

            event.preventDefault();

            let btnSubmit = this.formUpdate.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues(this.formUpdate);
            
            let rowIndex = this.formUpdate.dataset.tableRowIndex;

            let tableRow = this.tableTbody.rows[rowIndex];

            let oldUserObject = JSON.parse(tableRow.dataset.user);

            let newUserFromAssingnedObjects = Object.assign({}, oldUserObject, values);

            this.showCreatePanel();

            this.getPhoto(this.formUpdate).then(content => {

                if (!values.photo)
                {
                    newUserFromAssingnedObjects._photo = oldUserObject._photo;
                }
                else
                {
                    newUserFromAssingnedObjects._photo = content;
                }

                tableRow.dataset.user = JSON.stringify(newUserFromAssingnedObjects);

                tableRow.innerHTML = 
                `
                    <tr>
                        <td>
                            <img src="${newUserFromAssingnedObjects._photo}" alt="User Image" class="img-circle img-sm">
                        </td>
                        <td>${newUserFromAssingnedObjects._name}</td>
                        <td>${newUserFromAssingnedObjects._email}</td>
                        <td>${(newUserFromAssingnedObjects._admin) ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(newUserFromAssingnedObjects._register)}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    </tr>
                `;

                this.addEventsToTableRow(tableRow);

                this.updateUserStatistics();

                this.formUpdate.reset();

                btnSubmit.disabled = false;

                this.showCreatePanel();

            }).catch((err) => {

                console.error(err);

            });

        });
    }

    addEventsToTableRow(tableRow)
    {
        tableRow.querySelector('.btn-edit').addEventListener("click", event => {
            
            event.preventDefault();
            
            let usersJson = JSON.parse(tableRow.dataset.user);

            this.formUpdate.dataset.tableRowIndex = tableRow.sectionRowIndex;

            for (const name in usersJson)
            {
                let field = this.formUpdate.querySelector(" [name=" + name.replace('_', '') + "] ");
                
                if(field)
                {
                    switch (field.type)
                    {
                        case 'file':
                            continue;
                        case 'radio':
                            field = this.formUpdate.querySelector(" [name=" + name.replace('_', '') + "][value=" + usersJson[name] + "] ");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = usersJson[name];
                            break;
                        default:
                            field.value = usersJson[name];
                    }
                }
            }
            this.formUpdate.querySelector('.photo').src = usersJson._photo;
            this.showUpdatePanel();
        });
    }
}