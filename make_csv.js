const fs = require('fs');
const csv = require('csv-parser');

const make_csv = function (array,keys,path) {

    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: path,
        header: keys.map(k=>{return {id:k,title:k}})
    });
    csvWriter
        .writeRecords(array)
        .then(()=> console.log("CSV file subject"));
}

module.exports = make_csv