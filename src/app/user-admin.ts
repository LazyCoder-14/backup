export default class Users{
    id! : string;
    name! : string;
    email! : string;
    contactNumber! : number;

    constructor(id : string, name: string, email: string,contactNumber: number){
        this.id = id;
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
    }

}