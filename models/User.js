class User
{
    constructor(name, gender, birth, country, email, password, photo, admin)
    {
        this._photo = photo;
        this._name = name;
        this._email = email;
        this._admin = admin;
        this._register = new Date();
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._password = password;
    }

    // Getters

    get photo()
    {
        return this._photo;
    }

    get name()
    {
        return this._name;
    }

    get email()
    {
        return this._email;
    }

    get admin()
    {
        return this._admin;
    }

    get register()
    {
        return this._register;
    }

    get gender()
    {
        return this._gender;
    }

    get birth()
    {
        return this._birth;
    }

    get country()
    {
        return this._country;
    }

    get password()
    {
        return this._password;
    }

    // Setters

    set photo(value)
    {
        this._photo = value;
    }

    set name(value)
    {
        this._name = value;
    }

    set email(value)
    {
        this._email = value;
    }

    set admin(value)
    {
        this._admin = value;
    }
    
    set gender(value)
    {
        this._gender = value;
    }

    set birth(value)
    {
        this._birth = value;
    }

    set country(value)
    {
        this._country = value;
    }

    set password(value)
    {
        this._password = value;
    }
}