export const randomId = (hashLength = 16):string => {
    if (!hashLength || typeof(Number(hashLength)) != 'number') {
        hashLength = 16
    }
    var ar = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    var hs = [];
    var hl = Number(hashLength);
    var al = ar.length;
    for (var i = 0; i < hl; i ++) {
        hs.push(ar[Math.floor(Math.random() * al)]);
    }
     
    return hs.join('');
}

export const getCurrentMonthDays = () => {
    let now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1

    return new Date(year,month, 0).getDate()
}

export const randomInt = (num:number) => {
    return Math.ceil(Math.random()*num)
}