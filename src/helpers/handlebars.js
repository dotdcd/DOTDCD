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
        return b.toFixed(2).replace( /(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    isPesos: function (a) {
        const b = a * 21
        return b.toFixed(2).replace( /(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    isMoney: function(a) {
        if (!a) {
            return '$0.00'; // Si a es falsy (null, undefined, '', etc.), retorna '$0.00'
        }
        const b = a.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        return '$' + b;
    },
    daysColors: function (a) {
        const fechaActual = new Date();
        const fechaDada = new Date(a);
        const milisegundosPorDia = 86400000; // 1000 ms * 60 s * 60 min * 24 h
        const diferencia = fechaActual.getTime() - fechaDada.getTime();

        const diasTranscurridos = (a == null || a == undefined ) ? null : Math.round(diferencia / milisegundosPorDia)
        
        switch (true) {
            case (diasTranscurridos >= 1 && diasTranscurridos <= 15):
                //console.log(diasTranscurridos, '0 a 15')
                return '#8BC34A'
                break;
            case (diasTranscurridos >= 16 && diasTranscurridos <= 30):
                //console.log(diasTranscurridos, '16 a 30')
                return '#CDDC39'
                break;
            case (diasTranscurridos >= 31 && diasTranscurridos <= 45):
                //console.log(diasTranscurridos, '31 a 45')
                return '#FFC107'
                break;
            case (diasTranscurridos >= 46 && diasTranscurridos <= 60):
                //console.log(diasTranscurridos, '46 a 60')
                return '#FF9800'
                break;
            case (diasTranscurridos >= 61):
                //console.log(diasTranscurridos, 'mayor')
                return '#FC4C49'
                break;
            case (diasTranscurridos == null || diasTranscurridos  == undefined ):
                //console.log('nulo')
                return '#F6F6F6'
            default:
                break;
        }
    },
    accordionN: function (a, b){
        let contador = 0;

        for (let i = 0; i < b.length; i++) {
            if (b[i].insumo_nivel_id == a) {
                contador++;
            }
        }
        return contador <= 0 ? 'd-none' : '';
    },
    accordionSub: function (a, b, c){
        let contador = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i].insumo_nivel_id == b && a[i].insumo_tipo_id == c) {
                contador++;
            }
        }
        return contador <= 0 ? 'd-none' : '';
    },
    isTwo: function (a, b, c, d) {
        if (a == b && c == d) {
            return true
        } else {
            return false
        }
    },
    clog: function (a) {
        console.log(a)
    },
    roundCero: function (a) {
        return a | 0;
    },
    isPercentMayor: function (a) {
        if (a >= 100) {
            return true
        } else {
            return false
        }
    },
    isPercentMinor: function (a) {
        if (a <= 0) {
            return true
        } else {
            return false
        }
    },
    disciplicaIcon: function (a) {
        switch (a) {
            case 'Voz  Datos y TV':
                return 'fas fa-wifi'

            case 'CCTV':
                return 'fas fa-video'

            case 'Incendio':
                return 'fas fa-fire'
            
            case 'Automatizacion':
                return 'fas fa-robot'

            case 'Control de Acceso':
                return 'fas fa-user-lock'

            case 'Sistemas':
                return 'fas fa-cogs'
            
            case 'Pantallas TV':
                return 'fas fa-tv'

            case 'Sistema de cobro':
                return 'fas fa-money-bill-wave'

            case 'Infraestructura':
                return 'fas fa-network-wired'
            
            case 'Servicios':
                return 'fas fa-tools'

            default:
                return 'fas fa-cog'
        }
    },
    substract: function (a, b) {
        return a - b;
    }
}

