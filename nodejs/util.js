function datesql(time){
    return time.getUTCFullYear() + '-' +
    ('00' + (time.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + time.getUTCDate()).slice(-2) + ' ' + 
    ('00' + time.getUTCHours()).slice(-2) + ':' + 
    ('00' + time.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + time.getUTCSeconds()).slice(-2);
}
module.exports = {datesql};