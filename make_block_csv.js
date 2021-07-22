const fs = require('fs');
const csv = require('csv-parser');

const make_block_csv = function (participant_id, participant_dir, block_num, stimuli) {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;





    let data =stimuli.map((stim,i) => {
        let dat = {
            subject_id: stim.subject_id,
            question_in_block: i+1,
            question_in_task:stim.Q_num,
            block_num: block_num,
            probe:stim.probe,
            shifted_dir:stim.shifted_dir,
            shift_amount:stim.shift_amount,
            shift_position:stim.shift_position,
            set:stim.set,
            order:stim.order,
            mode: stim.mode,
            mode_num: stim.mode_num,
            transposition: stim.transposition,
            decoy: stim.decoy,
            probe_file:stim.probe_file,
        }
        return dat
    })
    fs.writeFile(participant_dir + "csv/" + "block_" + block_num + ".json", JSON.stringify(data), function(err) {
        if(err) {
            return console.log(err);
        }
    });
    const csvWriter = createCsvWriter({
        path: participant_dir + "csv/" + "block_" + block_num + ".csv",
        header: Object.keys(data[0]).map(el=>{return {id:el,title:el}})
    }).writeRecords(data)
        .then(()=> console.log("CSV file subject",participant_id,"block", block_num,"was successfully created."));
}

module.exports = make_block_csv