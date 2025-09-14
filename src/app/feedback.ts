export default class feedback{
    feedbackId!:number;
    eventId!:number;
    userId!:any;
    userName!: string;
    rating!:number;
    comments!:string;
    submittedTimestamp!:any;
    createdAt: string|undefined;

    
    constructor(feedbackId:number,eventId:number,userId:any,userName:string,rating:number,comments:string,submittedTimestamp:any){
        this.feedbackId=feedbackId;
        this.eventId=eventId;
        this.userId=userId;
        this.userName=userName;
        this.rating=rating;
        this.comments=comments;
        this.submittedTimestamp=submittedTimestamp;
        
        
    }
}