import { PhoneDTO } from "./phone.dto";
import { AddressDTO } from "./address.dto";

export type RegisterDTO = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    // Optional fields
    phoneNumbers?: PhoneDTO[];
    savedAddresses?: AddressDTO[];
}

export type LoginDTO = {
    email: string;
    password: string;
}