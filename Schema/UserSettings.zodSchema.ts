import { currencies } from '@/lib/currencies';
import {z} from 'zod';

export const UserSettingsUpdateZodSchema = z.object({
    currency: z.custom((value) => {
        const found = currencies.some(c => c.value === value)
        if(!found){
            throw new Error(`Invalid Currency Value ${value}`)
        }
        return value
    })
})