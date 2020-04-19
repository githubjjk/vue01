export function judgeArgsIsNull(data) {
    if (data == "" || data == "null" || data == "undefined" || data == undefined || data == null) {
        return true;
    }
    return false;
}
