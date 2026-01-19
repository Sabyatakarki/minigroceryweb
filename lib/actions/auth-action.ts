"use server"
import {register,login} from '../api/auth';
import { setAuthToken, setUserData } from '../cookies';

export const handleRegister = async(formData:any)=>{
    try{
        const result = await register(formData);
        if(result){
            return {success: true, message: 'Registration successful',data:result.data};
        }
        return {success: false, message: result.message || 'Registration failed'};
    }catch(err: Error| any){
        return {success: false, message: err.message || 'Registration failed'};
    }
}
export const handleLogin = async(formData:any)=>{
       try{
        const result = await login(formData);
        if(result){
            await setAuthToken(result.data.token);
            await setUserData(result.data.user);
            return {success: true, message: 'Login successful',data:result.data};
        }
        return {success: false, message: result.message || 'Login  failed'};
    }catch(err: Error| any){
        return {success: false, message: err.message || 'Login  failed'};
    }
}