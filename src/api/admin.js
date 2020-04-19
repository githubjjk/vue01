import Axios from "axios";

export function findResByAdmin(token) {
    return new Axios({
        url: "/api/authFun/admin/findResByAdmin",
        method: "post",
        data: {
            token: token
        }
    })
}