const split_stimuli_to_blocks = function (stimuli,num_of_blocks,subject_id,block_starting_at=1) {
    const Q_per_block = Math.ceil(stimuli.length/num_of_blocks)
    let blocks = []
    for (let i = 0; i < stimuli.length; i+=Q_per_block) {
        let stim_slice = stimuli.slice(i,i+Q_per_block)
        blocks.push(stim_slice)
    }
    return blocks
}

module.exports = split_stimuli_to_blocks