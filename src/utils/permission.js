
export function checkBtnPer(myBtnPer) {
    let allBtn = this.$store.getters['per_btn'];
    for (let i in allBtn) {
        if (allBtn[i].indexOf(myBtnPer) != -1) {
            return true;
        }
    }
    return false;
}