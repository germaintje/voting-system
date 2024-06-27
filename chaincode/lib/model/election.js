/*
 * Representation of an Election Asset
 * Author: kortsa
 */

'use strict';

const electionStatus = {
    NOT_STARTED: 'NOT_STARTED',
    RUNNING: 'RUNNING',
    FINISHED: 'FINISHED',
}

const State = require('./state.js');

class Election extends State {
    constructor(originId, electionId, electionName, electionParticipants) {
        super('Election');
        this.setOriginId(originId);
        this.setElectionId(electionId);
        this.setElectionName(electionName)
        this.setElectionParticipants(electionParticipants)
        this.setNotStarted();
    }

    getOriginId() {
        return this.originId
    }
    getElectionId() {
        return this.electionId
    }

    getElectionName() {
        return this.electionName
    }

    getElectionParticipants() {
        return this.electionParticipants
    }

    setOriginId(originId) {
        this.originId = originId
    }

    setElectionId(electionId) {
        this.electionId = electionId
    }

    setElectionName(electionName) {
        this.electionName = electionName
    }

    setElectionParticipants(electionParticipants) {
       this.electionParticipants = electionParticipants
    }

    setNotStarted() {
        this.currentState = electionStatus.NOT_STARTED
    }

    setRunning() {
        this.currentState = electionStatus.RUNNING
    }

    setFinished() {
        this.currentState = electionStatus.FINISHED
    }

    isNotStarted() {
        return this.currentState === electionStatus.NOT_STARTED
    }

    isRunning() {
        return this.currentState === electionStatus.RUNNING
    }

    isFinished() {
        return this.currentState === electionStatus.FINISHED
    }

    static deserialise(buffer) {
        const values = JSON.parse(buffer.toString());
        const election = new Election();
        Object.assign(election,values);  
        return election;
    }
}

module.exports = Election
