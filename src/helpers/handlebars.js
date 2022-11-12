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
    is: function (a, b){
        if(a == b) return true
        return false
    },
    switch: function(value, options) {
        this.switch_value = value;
        return options.fn(this);
    },
    case: function(value, options) {
        if (value == this.switch_value) {
            return options.fn(this);
        }
    }
}