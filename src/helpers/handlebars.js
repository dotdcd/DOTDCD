import * as ntl from 'numero-a-letras'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const helpers = {
    section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
    json: function (obj) {
        return JSON.stringify(obj);
    },
    multiply: function (num1, num2) {
        return num1 * num2
    },
    money: function (num) {
        const money = new Intl.NumberFormat('en-US').format(num)
        return money
    },
    is: function (a, b) {
        if (a == b) return true
        return false
    },
    switch: function (value, options) {
        this.switch_value = value;
        return options.fn(this);
    },
    case: function (value, options) {
        if (value == this.switch_value) {
            return options.fn(this);
        }
    },
    ntp: function (value) {
        return ntl.NumerosALetras(value)
    },
    month: function (value) {
        const m = value.split('-')
        const month = m[1].split('0')
        return meses[month[1] - 1]
    },
    day: function (value) {
        const d = value.split('-')
        return d[2]
    },
    year: function (value) {
        const y = value.split('-')
        return y[0]
    },
    cDate: function () {
        const date = new Date()
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()
        return `${day} días del mes de ${meses[month]} del año ${year}`
    },
    age: function (value) {
        const birth = value.split('-')
        let today = new Date();
        //Restamos los años
        let años = today.getFullYear() - birth[0];
        // Si no ha llegado su cumpleaños le restamos el año por cumplir (Los meses en Date empiezan en 0, por eso tenemos que sumar 1)
        if (birth[1] > (today.getMonth()) || birth[2] > today.getDay())
            años--;
        return años;
    },
    period: function (value) {
        const period = (value == 1) ? '1 mes' : `${value} meses`
        return period
    },
    dateWord: function (value) {
        const date = value.split('-')
        const day = date[2]
        const m = date[1].split('0')
        const month = meses[date[1] - 1]
        const year = date[0]

        return `${day} Días del Mes de ${month} del Año ${year}`
    },
    asignSign: function (a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i].lvl == b) {
                return a[i].firma
            }

        }
    },
    asignName: function (a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i].lvl == b) {
                return a[i].nombre
            }

        }
    },
    maxminDate: function (a) {
        const hoy = new Date()
        const current = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()
        if (a == 1) {
            return current
        } else {
            const min = hoy.getFullYear() + 1 + '-' + (hoy.getMonth() + 1) + '-' + (hoy.getDate() - 3)
            console.log(min)
            return min
        }
    },
    isDolar: function (a) {
        const b = a / 21
        return b.toFixed(2)
    }
}

