'use server'
import type { SignInCredential } from '@/@types/auth'
import { validateUserCredentials } from '@/services/AuthValidationService'

const validateCredential = async (values: SignInCredential) => {
    return validateUserCredentials(values)
}

export default validateCredential
