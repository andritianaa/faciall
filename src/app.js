let arr1 = [1,2,3];

function doubler(arr, callback){
    const newArr=[];
    for(let i=0; arr.length>i; i++){
        newArr.push(callback(arr[i]));
    }
    return newArr;

}

const t1 = [1,2,3];
const t2 = [1,2,3];

const compare = ((a,b) => a.length === b.length && a.every((v,i)=> v === b[i]))
 
t1.every

console.log(compare(t1,t2));


arr1 = doubler(arr1,(val)=>{
    return val*2;
})
console.log(arr1);
//<>