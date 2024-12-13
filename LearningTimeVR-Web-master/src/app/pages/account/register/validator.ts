import { AbstractControl, ValidatorFn } from '@angular/forms';

export function extensionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        if (!value) {
            return null;
        }
        console.log(value);
        // const fileName = value.name;
        // if(!fileName) return null;
        const fileExtension = value.substring(value.lastIndexOf(".") + 1);
        console.log(fileExtension);
        const acceptedExt = ["jpg", "png", "jpeg"];
        const isAccepted = acceptedExt.includes(fileExtension.toLowerCase());
        // console.log("validator accepted", isAccepted);
        console.log("valid?", control)

        return !isAccepted ? { badExt: true } : null;
    };
}

export function confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const password = control.root.get('password')?.value;
        const confirmPasswordControl = control.value;
        if (!password || !confirmPasswordControl) return null;
        
        
        let passwordMatches = password == confirmPasswordControl;
        // console.log("passwordMatches?", passwordMatches ? null : { passwordMatches: true });
        return passwordMatches ? null : { passwordMatches: true };
    }
}
