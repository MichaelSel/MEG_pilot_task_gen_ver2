const EDO = require("edo.js").EDO


let edo = new EDO()
const max_traverse = 1
let all_possibilities = Array.from(Array(7).keys()).map(el=>el-3)
let all_3s = edo.get.partitioned_subsets(Array.from(Array(3).fill(all_possibilities)))
    .filter(p=>{
        let sum = p.reduce((ag,e)=>ag+e,0)
        return Math.abs(sum)<=max_traverse && sum!=0
    })
let all_4s = edo.get.partitioned_subsets(Array.from(Array(4).fill(all_possibilities)))
    .filter(p=>{
        let sum = p.reduce((ag,e)=>ag+e,0)
        return Math.abs(sum)<=max_traverse && sum!=0
    })
console.log(all_4s.length)
