export default class User {
  userId: string;
  name: string;
  email: string;
  contactNumber: string;
  password: string;
  age?: number;
  address?: string;
  gender?: string;

  isAdmin?: boolean;
  isLoggedIn?: boolean;

  constructor(
    userId: string,
    name: string,
    email: string,
    contactNumber: string,
    password: string,
    age?: number,
    address?: string,
    gender?: string,

    isAdmin?: boolean,
    isLoggedIn?: boolean
  ) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.contactNumber = contactNumber;
    this.password = password;
    this.age = age;
    this.address = address;
    this.gender = gender;

    this.isAdmin = isAdmin || false;
    this.isLoggedIn = isLoggedIn || false;
  }
}
