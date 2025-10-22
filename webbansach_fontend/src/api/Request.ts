import React from "react";

export  async function request(duongDan: String){
    const respone=await fetch(duongDan.toString());

    if(!respone.ok) {
        throw new Error('Không thể truy cập ${duongDan}' + respone.status); 
    }
    return respone.json();

}
