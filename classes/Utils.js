class Utils
{
    static dateFormat(date)
    {
        return this.addZerosToDate(date.getDay()) + '/' + this.addZerosToDate((date.getMonth() + 1)) + 
            '/' + date.getFullYear() + ' ' + this.addZerosToDate(date.getHours()) + ':' + date.getMinutes();
    }

    static addZerosToDate(date)
    {
        return (date <= 9) ? '0' + date : date;
    }
}