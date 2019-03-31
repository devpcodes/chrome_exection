var data;
export default function filterTree(filter, list){
    for (let i = 0; i < list.length; i++) {
        if (list[i].structure == filter) {
            data = list[i];
            break;
        }else{
            if (typeof list[i].children != 'undefined') {
                filterTree(filter, list[i].children);
            }
        }
    }
    return data;
}