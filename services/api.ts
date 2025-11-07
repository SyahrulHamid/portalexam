// FIX: Provide full implementation for the API service.
import { USERS, EXAMS } from '../constants/data.ts';
import { User, Exam } from '../types.ts';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const login = async (username: string, password?: string): Promise<User | null> => {
  await delay(500);
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
};

export const fetchUsers = async (): Promise<User[]> => {
  await delay(500);
  // Return users without passwords
  return USERS.map(user => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  });
};

export const fetchExams = async (): Promise<Exam[]> => {
  await delay(500);
  return EXAMS;
};


export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    await delay(300);
    
    let username = user.username;
    if (user.role === 'guru' && user.nip) {
        username = user.nip;
    } else if (user.role === 'murid' && user.nisn) {
        username = user.nisn;
    }

    if (!username) {
      throw new Error('Username, NIP, atau NISN wajib diisi.');
    }

    if (USERS.some(u => u.username === username)) {
      throw new Error(`Pengguna dengan NIP/NISN '${username}' sudah ada.`);
    }

    const newUser: User = { 
        ...user, 
        id: Date.now(), 
        username: username,
        profilePicture: user.profilePicture || 'https://i.pravatar.cc/150?u=' + Date.now() 
    };

    let finalPassword = user.password;
    if (!finalPassword) { // If password is not provided (e.g., from AddUserModal for guru/murid)
        if (newUser.role === 'guru' && newUser.nip) {
            finalPassword = newUser.nip;
        } else if (newUser.role === 'murid' && newUser.nisn) {
            finalPassword = newUser.nisn;
        }
    }

    if (!finalPassword) {
      throw new Error('Kata sandi harus disediakan untuk pengguna baru.');
    }

    const userWithPassword = { ...newUser, password: finalPassword };
    USERS.push(userWithPassword);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = userWithPassword;
    return userWithoutPassword;
};

export const updateUser = async (user: Partial<User> & { id: number }): Promise<User> => {
    await delay(500);
    const index = USERS.findIndex(u => u.id === user.id);
    if (index !== -1) {
        const existingUser = USERS[index];
        const updatedData = { ...existingUser, ...user };

        let username = updatedData.username;
        if (updatedData.role === 'guru' && updatedData.nip) {
          username = updatedData.nip;
        } else if (updatedData.role === 'murid' && updatedData.nisn) {
          username = updatedData.nisn;
        }

        if (username !== existingUser.username && USERS.some(u => u.username === username && u.id !== user.id)) {
            throw new Error(`Pengguna dengan NIP/NISN '${username}' sudah ada.`);
        }
        updatedData.username = username;
        USERS[index] = updatedData;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = USERS[index];
    return userWithoutPassword;
};

export const deleteUser = async (userId: number): Promise<void> => {
    await delay(500);
    const initialLength = USERS.length;
    const filteredUsers = USERS.filter(u => u.id !== userId);

    if (filteredUsers.length < initialLength) {
        // Clear the original array while maintaining its reference
        USERS.length = 0;
        // Push the filtered users back into the original array
        USERS.push(...filteredUsers);
    }
};

export const changePassword = async (userId: number, oldPassword: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    await delay(500);
    const user = USERS.find(u => u.id === userId);
    if (!user) {
        return { success: false, message: 'Pengguna tidak ditemukan.' };
    }
    if (user.password !== oldPassword) {
        return { success: false, message: 'Kata sandi lama salah.'};
    }
    user.password = newPassword;
    return { success: true, message: 'Kata sandi berhasil diubah.'};
};

export const resetAllPasswords = async (role: 'guru' | 'murid'): Promise<{ success: boolean; message: string }> => {
    await delay(1000); // Simulate a longer process
    let updatedCount = 0;
    
    // Using a standard for loop for more direct and robust mutation.
    for (let i = 0; i < USERS.length; i++) {
        const user = USERS[i];
        if (user.role === role) {
            if (role === 'guru' && user.nip) {
                USERS[i].password = user.nip;
                updatedCount++;
            } else if (role === 'murid' && user.nisn) {
                USERS[i].password = user.nisn;
                updatedCount++;
            }
        }
    }

    if (updatedCount === 0) {
        return { success: false, message: `Tidak ada pengguna ${role} yang ditemukan untuk direset.` };
    }
    return { success: true, message: `${updatedCount} kata sandi berhasil direset.` };
};