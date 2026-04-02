import { UnauthorizedError } from "../errors/UnauthorizedError";
import User from '../models/User.model';
import jwt from 'jsonwebtoken';
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto";
import { ConflictError } from "../errors/ConflictError";

if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is not defined in your environment variables. Please check your .env file.");

export class AuthService {
    public async login(loginDTO: LoginDTO) {
        const {email, password} = loginDTO;

        const user = await User.findOne({email}).select('+password');

        if (!user || !(await user.comparePassword(password)))
            throw new UnauthorizedError("Invalid email or password. Please try logging in again.");

        const {id, role, isEmailVerified} = user;

        return jwt.sign({id, role, isEmailVerified}, process.env.JWT_SECRET!, {expiresIn : '7d'});
    }

    public async register(registerDTO: RegisterDTO) {
        const {email} = registerDTO;
        const existingUser = await User.findOne({email})

        if (existingUser)
            throw new ConflictError("Email already in use. Please use a different email or log in.");

        const newUser = await User.create(registerDTO);

        const {id, role, isEmailVerified} = newUser;
        return jwt.sign({id, role, isEmailVerified}, process.env.JWT_SECRET!, {expiresIn : '7d'});
    }
}
