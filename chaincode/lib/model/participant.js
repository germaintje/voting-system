/*
 * Representation of an Egg Box Asset
 * Author: MFK
 */

'use strict';

const State = require('./state.js');

class Participant extends State {

    constructor(id, name, role) {
        super('Participant');
        this.setId(id);
        this.setName(name);
        this.setRole(role);
        this.setVoted()
        this.setVoteCount()
    }

    /* Basic Getters */

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getRole() {
        return this.role;
    }

    getVoted() {
        return this.voted;
    }

    /** basic setters */
    
    setId(id) {
        this.id = id;
    }

    setName(name) {
        this.name = name;
    }

    setRole(role) {
        this.role = role;
    }

    addVote() {
        this.voteCount += 1
    }

    setVoteCount() {
        this.voteCount = 0
    }

    setVoted() {
        this.voted = false;
    }

    vote() {
        if (this.voted === false) {
            this.voted = true;
        }
    }


    

    /**
     * Returns an object from a buffer. Normally called after a getState
     * @param {*} buffer
     */
    static deserialise(buffer) {
        const values = JSON.parse(buffer.toString());
        const participant = new Participant();
        Object.assign(participant,values);  
        return participant;
    }
}

module.exports = Participant;