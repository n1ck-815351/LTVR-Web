import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'app/services/firebase/auth.service';
import { UserService, UserType, userTypes } from 'app/services/firebase/user.service';
import { BehaviorSubject, Observable, catchError, first, map, of, switchMap, take, tap } from 'rxjs';

export const AdminGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);





  return authService.authStatusListener().pipe(
    switchMap(result => {
      if (result != null) {
        return userService.queryCurrentUserData().pipe(
          take(1),
          map(value => {
            console.log("loggedIn", authService.loggedIn, "user", (value[0] as UserType).baseUser?.title);

            if (value && value.length > 0) {
              let v = value[0] as UserType;

              if (v.baseUser?.userType == userTypes.Administrator)
                return true;
              else
                return router.parseUrl('/restrictedfallback');
            } else {
              return router.parseUrl('/restrictedfallback');
            }
          })
        );
      } else {
        return of(router.parseUrl('/loginfallback'));
      }
    })
  );




  return userService.queryCurrentUserData().pipe(
    take(1),
    map(value => {
      console.log("loggedIn", authService.loggedIn, "user", value);

      if (value && value.length > 0) {

        let v = value[0] as UserType;

        if (v.baseUser?.userType == userTypes.Administrator)
          return true; else return router.parseUrl('/restrictedfallback');
      }
      else {
        return router.parseUrl('/restrictedfallback');
      }
    })
    // catchError(() => of(router.parseUrl('/restrictedfallback')))
  );





  //   authService.authStatusListener().pipe(map(result => {
  //     if (result != null) return true; else {
  //       return of(router.parseUrl('/loginfallback'));
  //     }
  //   }));
  // 
  // 
  // 
  //   return userService.queryCurrentUserData().pipe(
  //     take(1),
  //     map(value => {
  //       console.log("loggedIn", authService.loggedIn, "user", value);
  //       if (value && value.length > 0) {
  //         let v = value[0] as UserType;
  //         if (v.baseUser?.userType == userTypes.Administrator)
  //           return true; else return router.parseUrl('/restrictedfallback');
  //       } else {
  //         return router.parseUrl('/restrictedfallback');
  //       }
  //     })
  //     // catchError(() => of(router.parseUrl('/restrictedfallback')))
  //   );
};




// export const adminGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
//   console.log("---------*************** ADMIN GUARD ACTIVATED ---------***************");
//   const authService = inject(AuthService);
//   const userService = inject(UserService);
//   const router = inject(Router);
// 
//   return userService.getCurrentUserData().pipe(map(user => {
//     if (authService.loggedIn && user) {
//       console.log("found user", userService.user);
//       return true;
//     }
//     else {
//       console.log("This page was restricted.");
//       return router.parseUrl('/restrictedfallback'); // Redirect to the homepage or any other route
//     }
//   }));
// }