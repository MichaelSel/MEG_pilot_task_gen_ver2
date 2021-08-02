const fs = require('fs');
const csv = require('csv-parser');
const make_stimuli = require('./make_stimuli')
const make_folder = require('./make_folder')
const split_stimuli_to_blocks = require('./split_stimuli_to_blocks')
const make_block_csv = require('./make_block_csv')
const make_audio = require('./make_audio')
const all_sets = JSON.parse(fs.readFileSync('./selected-7-note-sets.json','utf-8'))
const matrix = JSON.parse(fs.readFileSync('./subject_matrix.json','utf-8'))
const EDO = require("edo.js").EDO


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**Set Settings here*/
async function gen_task_set (sub_id,prefix="MEG2p",root='./task_sets',num_of_blocks=20) {
    let sub = matrix.filter(row=>row.subject_id==sub_id)[0]
    const edo = new EDO(12)
    const sub_name = prefix + "0".repeat(4-String(sub_id).length) + String(sub_id)

    make_folder(root,"/" + sub_name)
    make_folder(root + "/" + sub_name,["/audio","/csv"])


    const Qs_per_set = 15 // was 10, changed to 15 at sub 2011
    const pc_decoy = 0.3
    const decoys = Math.floor(Qs_per_set*pc_decoy)
    const real_Qs = Qs_per_set - decoys

    let blocks = []
    for (let i = 0; i < num_of_blocks; i++) {
        const set1 = make_stimuli(sub_name,real_Qs,decoys,[0,12],16,[0,2,4,7,9]) /**Pentatonic*/
        const set2 = make_stimuli(sub_name,real_Qs,decoys,[0,12],16,[0,1,2,3,5]) /**Worst 5-note set*/
        let block = [...set1,...set2]
        blocks.push(shuffle(block))
    }

    //Add final info after shuffling
    let Q_num = 0
    blocks = blocks.map(block=>{
        block.map(stimulus=>{
            stimulus.Q_num = ++Q_num
            stimulus.probe_file = "Q-" +(Q_num)+ "-000-probe.wav"
            return stimulus
        })
        return block
    })


    const process_block_audio = function (block) {
        const audio_dir = root+"/" + sub_name +"/audio/"
        let mp3 = []
        block.forEach((stimulus,Q_num)=>{
            mp3.push(make_audio(stimulus["probe"],audio_dir + stimulus.probe_file))
        })
        return Promise.all(mp3)

    }
    async function process_block  (block_num=0) {
            if(block_num<blocks.length) {
                console.log(sub_name,"processing block " + (block_num+1))
                let block = blocks[block_num]
                block.forEach((stimulus,Q_num)=>{
                    stimulus.block = block_num+1
                })
                make_block_csv(sub_name,root+"/" + sub_name +"/",block_num+1,block)
                await process_block_audio(block)
                console.log("created block " + parseInt(block_num+1) +" audio")
                await process_block(block_num+1)
            }
    }
    await process_block(0).then(function () {
        console.log("finished", sub_name)
    })
    return sub_name
}


module.exports = gen_task_set



gen_task_set(2013)
