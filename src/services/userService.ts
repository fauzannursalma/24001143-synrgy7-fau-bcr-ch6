import { UserRepository } from "../repositories/userRepository";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword, checkPassword } from "../utils/passwordUtils";
import { createToken } from "../utils/tokenUtils";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(user: any): Promise<any> {
    const isEmailExist = await this.userRepository.show({ email: user.email });

    if (isEmailExist !== undefined) {
      throw new Error("Email already exist");
    }
    user.id = uuidv4();

    if (!user.password || !user.name || !user.email) {
      throw new Error("All fields are required");
    } else if (user.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    user.password = await encryptPassword(user.password as string);

    return await this.userRepository.create({
      ...user,
      role: "member",
    });
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userRepository.show({ email });

    if (user === undefined) {
      throw new Error("Email or password invalid");
    }

    const isPasswordValid = await checkPassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email or password invalid");
    }

    const token = createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      name: user.name,
      email: user.email,
      token,
    };
  }

  async logout(req: any, res: any) {
    delete req.userData;
    res.status(200).json({ message: "Logout success" });
  }

  async create(user: any): Promise<any> {
    const isEmailExist = await this.userRepository.show({ email: user.email });

    if (isEmailExist !== undefined) {
      throw new Error("Email already exist");
    }

    if (!user.password || !user.name || !user.email) {
      throw new Error("All fields are required");
    } else if (user.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    user.id = uuidv4();
    user.password = await encryptPassword(user.password as string);

    return await this.userRepository.create({
      ...user,
      role: "admin",
    });
  }

  async update(id: string, user: any, currentUser: any): Promise<any> {
    const existingUser = await this.userRepository.show({ id });

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (currentUser.role !== "superadmin" && currentUser.id !== id) {
      throw new Error("Forbidden access");
    }

    if (
      user.role &&
      user.role !== existingUser.role &&
      currentUser.role !== "superadmin"
    ) {
      throw new Error("Changing role is not allowed");
    }

    if (!user.name && !user.email && !user.password) {
      throw new Error("At least one field is required");
    }

    if (user.email && user.email !== existingUser.email) {
      const isEmailExist = await this.userRepository.show({
        email: user.email,
      });
      if (isEmailExist !== undefined) {
        throw new Error("Email already exists");
      }
    }

    if (user.password) {
      user.password = await encryptPassword(user.password as string);
    }

    await this.userRepository.update(id, user);

    const userUpdated = await this.userRepository.show({ id });

    return userUpdated;
  }

  async delete(id: string): Promise<any> {
    const existingUser = await this.userRepository.show({ id });

    if (!existingUser) {
      throw new Error("User not found");
    }

    return await this.userRepository.delete(id);
  }

  async show(id: string): Promise<any> {
    const user = await this.userRepository.show({ id });

    if (user === undefined) {
      throw new Error("User not found");
    }

    return user;
  }

  async changePassword(
    id: string,
    password: string,
    currentUser: any
  ): Promise<any> {
    const user = await this.userRepository.show({ id });

    if (user === undefined) {
      throw new Error("User not found");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const ExistingPassword = await checkPassword(password, user.password);

    if (ExistingPassword) {
      throw new Error("New password must be different from the old password");
    }

    if (currentUser.role !== "superadmin" && currentUser.id !== id) {
      throw new Error("Forbidden access");
    }

    const newPassword = await encryptPassword(password);

    return await this.userRepository.update(id, { password: newPassword });
  }

  async list(query: any): Promise<any> {
    const users = await this.userRepository.list(query);
    return users;
  }
}
