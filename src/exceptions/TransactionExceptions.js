export class InsufficientBalanceException extends Error {
    constructor(){
        super('Insufficient balance! Please top up and try again.');
        this.name = 'InsufficientBalanceException';
    }
}