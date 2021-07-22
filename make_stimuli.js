const EDO = require("edo.js").EDO
let edo = new EDO(12)
const mod = (n, m) => {
    return ((n % m) + m) % m;
}
const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}

const CJS = function (thing) {
    console.log(JS(thing))
}
const rand_int_in_range = function (min,max) {
    return Math.floor(Math.random() * (max - min +1)) + min
}

const rand_int_in_range_but_not_zero = function (min,max) {
    let val = Math.floor(Math.random() * (max - min +1)) + min
    while(val==0) val = Math.floor(Math.random() * (max - min +1)) + min
    return val
}
const unique_in_array = (list) => {

    let unique  = new Set(list.map(JSON.stringify));
    unique = Array.from(unique).map(JSON.parse);

    return unique
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const make_stimuli = function (subject_id,realQs=10, decoys=10,range=[0,12],length=12,set=[0,2,4,7,9]) {

    let time = Date.now()



    /**
    * Pseudo-randomizing
    * --------------------
    */
    //Shift up or down?
    let set_shift_array = shuffle(Array.from(Array(realQs+decoys)).map((el,i)=>(i<(realQs+decoys)/2)?-1:1))

    //Shift position (2nd to last or 3rd to last)
    let set_note_to_shift = shuffle(Array.from(Array(realQs+decoys)).map((el,i)=>(i<(realQs+decoys)/2)?length-2:length-3))

    //Transposition array
    let random_start = rand_int_in_range(0,6)
    let transpositions = shuffle(Array.from(Array(realQs+decoys)).map((el,i)=>((i+random_start)%7)-3))

    //Mode array
    random_start = rand_int_in_range(0,set.length)
    let modes = shuffle(Array.from(Array(realQs+decoys)).map((el,i)=>(i+random_start)%set.length))

    let Q = []
    while(Q.length<(realQs+decoys)) {

        let mode_num = modes[0]
        let Q_mode = edo.scale(set).mode(mode_num).pitches
        let pitches = edo.get.random_melody(length,range,true,Q_mode,avoid_leaps=6,end_with_first=false)

        //Verify that the melody includes all pitches BEFORE the shift position
        let unique_pitches = Array.from(new Set(pitches.slice(0,pitches.length-3).map(p=>edo.mod(p,12))))
        if (unique_pitches.length<set.length) continue;

        //Make sure there are no repeated notes in any of the test conditions
        if(edo.convert.to_steps(pitches).indexOf(0)!=-1) continue

        //Transpose melody
        let transposition = transpositions.shift()
        pitches = pitches.map(p=>p+transposition)

        if(Q.length<= realQs) {

            let shifted = [...pitches] //make a copy of the original melody (already transposed)
            let note_to_shift = set_note_to_shift[0]
            let amount_to_shift = set_shift_array[0]
            let shift_direction = (amount_to_shift==-1) ? "down" : "up"

            shifted[note_to_shift] = shifted[note_to_shift] + amount_to_shift


            let unique_in_shifted = Array.from(new Set(shifted.map(p=>edo.mod(p,12))))

            //if shifted note doesn't violate set: discard
            if(unique_in_shifted<=set.length) continue

            let shift_pos = set_note_to_shift.shift()
            let shift_amount = set_shift_array.shift()
            Q.push({subject_id:subject_id,probe:shifted,shift_dir:shift_direction, shift_amount:shift_amount,shift_position: shift_pos,set:set,mode:Q_mode,mode_num:mode_num,transposition:transposition, decoy:false})
        } else {
            Q.push({subject_id:subject_id,probe:pitches,shift_dir:0, shift_amount:0,shift_position: 0,set:set,mode:Q_mode,mode_num:mode_num,transposition:transposition, decoy:true})
        }

        modes.shift()


    }
    let stimuli = shuffle(Q)
    return stimuli
}



module.exports = make_stimuli


