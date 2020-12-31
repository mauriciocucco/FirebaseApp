import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Usuario } from "../models/usuario.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private urlServer: string = environment.url;
  private apiKey: string = environment.apiKey;
  userToken: string;

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  login(usuario: Usuario) {
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };

    return this.http
      .post(
        `${this.urlServer}/accounts:signInWithPassword?key=${this.apiKey}`,
        authData
      )
      .pipe(
        map((resp) => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
  }

  logout() {
    localStorage.removeItem("token");
  }

  nuevoUsuario(usuario: Usuario) {
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.urlServer}/accounts:signUp?key=${this.apiKey}`, authData)
      .pipe(
        map((resp) => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
  }

  private guardarToken(token: string) {
    let hoy = new Date();

    this.userToken = token;
    localStorage.setItem("token", token);

    hoy.setSeconds(3600); //el tiempo en el que va a expirar el token (1 hora)
    localStorage.setItem("expira", hoy.getTime().toString());
  }

  private leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem("expira"));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
